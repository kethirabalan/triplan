import { Observable, Subject, BehaviorSubject } from 'rxjs';

// Volume Meter Audio Worklet code as a string

export interface VolumeData {
    volume: number;    // Linear volume level (0.0 to 1.0)
    rms: number;       // Raw RMS value
    timestamp: number; // Audio context time
}

export interface VolumeListenerOptions {
    updateInterval?: number;  // How often to update volume (in audio samples)
    sensitivity?: number;     // Volume sensitivity multiplier (default: 10)
    smoothing?: number;       // Volume smoothing factor (0-1, default: 0.8)
}

export class VolumeListener {
    private audioContext: AudioContext | null = null;
    private volumeWorkletNode: AudioWorkletNode | null = null;
    private volumeSubject = new Subject<VolumeData>();
    private smoothedVolumeSubject = new BehaviorSubject<number>(0);
    private isInitialized = false;
    private smoothingFactor: number;
    private lastSmoothedVolume = 0;

    public volume$: Observable<VolumeData> = this.volumeSubject.asObservable();
    public smoothedVolume$: Observable<number> = this.smoothedVolumeSubject.asObservable();

    constructor(private options: VolumeListenerOptions = {}) {
        this.smoothingFactor = options.smoothing ?? 0.8;
    }

    /**
     * Initialize the volume listener with an audio context
     * @param audioContext The audio context to use for volume detection
     */
    async initialize(audioContext: AudioContext): Promise<void> {
        if (this.isInitialized) {
            console.warn('VolumeListener is already initialized');
            return;
        }

        this.audioContext = audioContext;

        try {
            // Create and add the volume meter worklet
            const workletBlob = new Blob([this.createCustomWorklet()], { type: 'application/javascript' });
            const workletURL = URL.createObjectURL(workletBlob);

            try {
                await this.audioContext.audioWorklet.addModule(workletURL);
            } finally {
                URL.revokeObjectURL(workletURL);
            }

            // Create the volume worklet node
            this.volumeWorkletNode = new AudioWorkletNode(this.audioContext, 'volume-meter');

            // Handle volume data from worklet
            this.volumeWorkletNode.port.onmessage = (event) => {
                if (event.data.volume !== undefined) {
                    const volumeData: VolumeData = {
                        volume: event.data.volume,
                        rms: event.data.rms,
                        timestamp: event.data.timestamp
                    };

                    // Emit raw volume data
                    this.volumeSubject.next(volumeData);

                    // Apply smoothing and emit smoothed volume
                    this.lastSmoothedVolume = this.lastSmoothedVolume * this.smoothingFactor +
                        volumeData.volume * (1 - this.smoothingFactor);
                    this.smoothedVolumeSubject.next(this.lastSmoothedVolume);
                }
            };

            this.volumeWorkletNode.port.onmessageerror = (error) => {
                console.error('Volume worklet message error:', error);
            };

            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize VolumeListener:', error);
            await this.cleanup();
            throw error;
        }
    }

    /**
     * Connect an audio source to the volume listener
     * @param audioSource The audio source node to monitor
     * @returns The volume worklet node for further connection if needed
     */
    connectSource(audioSource: AudioNode): AudioWorkletNode {
        if (!this.isInitialized || !this.volumeWorkletNode) {
            throw new Error('VolumeListener must be initialized before connecting a source');
        }

        // Connect the audio source to the volume worklet
        audioSource.connect(this.volumeWorkletNode);

        return this.volumeWorkletNode;
    }

    /**
     * Disconnect the volume listener from its current source
     */
    disconnect(): void {
        if (this.volumeWorkletNode) {
            this.volumeWorkletNode.disconnect();
        }
    }

    /**
     * Get the current smoothed volume level (0.0 to 1.0)
     */
    getCurrentVolume(): number {
        return this.smoothedVolumeSubject.value;
    }

    /**
     * Update volume listener options
     */
    updateOptions(options: Partial<VolumeListenerOptions>): void {
        if (options.smoothing !== undefined) {
            this.smoothingFactor = options.smoothing;
        }
        // Note: updateInterval and sensitivity require worklet recreation
        if (options.updateInterval !== undefined || options.sensitivity !== undefined) {
            console.warn('Changing updateInterval or sensitivity requires recreating the VolumeListener');
        }
    }

    /**
     * Clean up all resources
     */
    async cleanup(): Promise<void> {
        if (this.volumeWorkletNode) {
            this.volumeWorkletNode.port.onmessage = null;
            this.volumeWorkletNode.port.onmessageerror = null;
            this.volumeWorkletNode.disconnect();
            this.volumeWorkletNode = null;
        }

        this.volumeSubject.complete();
        // Don't complete BehaviorSubject as it might be subscribed to
        this.smoothedVolumeSubject.next(0);

        this.audioContext = null;
        this.isInitialized = false;
        this.lastSmoothedVolume = 0;
    }

    /**
     * Create a customized worklet with the current options
     */
    private createCustomWorklet(): string {
        const updateInterval = this.options.updateInterval ?? 60;
        const sensitivity = this.options.sensitivity ?? 10;

        return `
class VolumeMeter extends AudioWorkletProcessor {
    constructor() {
        super();
        this.volume = 0;
        this.updateInterval = ${updateInterval};
        this.sensitivity = ${sensitivity};
        this.sampleCount = 0;
    }
    
    process(inputs) {
        const input = inputs[0];
        if (input.length > 0 && input[0].length > 0) {
            // Calculate RMS (Root Mean Square) for volume detection
            let sumOfSquares = 0.0;
            for (const sample of input[0]) {
                sumOfSquares += sample * sample;
            }
            const rms = Math.sqrt(sumOfSquares / input[0].length);
            
            // Convert RMS to a linear scale (0.0 to 1.0)
            this.volume = Math.min(1.0, rms * this.sensitivity);
            
            // Throttle updates to avoid overwhelming the main thread
            this.sampleCount++;
            if (this.sampleCount >= this.updateInterval) {
                this.port.postMessage({ 
                    volume: this.volume,
                    rms: rms,
                    timestamp: currentTime 
                });
                this.sampleCount = 0;
            }
        } else {
            // No input, set volume to 0
            this.volume = 0;
            this.sampleCount++;
            if (this.sampleCount >= this.updateInterval) {
                this.port.postMessage({ 
                    volume: 0,
                    rms: 0,
                    timestamp: currentTime 
                });
                this.sampleCount = 0;
            }
        }
        
        return true; // Keep processor alive
    }
}
registerProcessor('volume-meter', VolumeMeter);
`;
    }
}

/**
 * Utility function to create and initialize a VolumeListener
 * @param audioContext The audio context to use
 * @param options Configuration options for the volume listener
 * @returns Promise that resolves to an initialized VolumeListener
 */
export async function createVolumeListener(
    audioContext: AudioContext,
    options?: VolumeListenerOptions
): Promise<VolumeListener> {
    const volumeListener = new VolumeListener(options);
    await volumeListener.initialize(audioContext);
    return volumeListener;
}

/**
 * Utility function to create a volume listener and connect it to an audio source
 * @param audioContext The audio context to use
 * @param audioSource The audio source to monitor
 * @param options Configuration options for the volume listener
 * @returns Promise that resolves to an initialized and connected VolumeListener
 */
export async function createConnectedVolumeListener(
    audioContext: AudioContext,
    audioSource: AudioNode,
    options?: VolumeListenerOptions
): Promise<VolumeListener> {
    const volumeListener = await createVolumeListener(audioContext, options);
    volumeListener.connectSource(audioSource);
    return volumeListener;
}

/**
 * Convert linear volume (0-1) to decibels
 * @param volume Linear volume level (0.0 to 1.0)
 * @returns Volume in decibels
 */
export function volumeToDecibels(volume: number): number {
    if (volume <= 0) return -Infinity;
    return 20 * Math.log10(volume);
}

/**
 * Convert decibels to linear volume (0-1)
 * @param decibels Volume in decibels
 * @returns Linear volume level (0.0 to 1.0)
 */
export function decibelsToVolume(decibels: number): number {
    if (decibels === -Infinity) return 0;
    return Math.pow(10, decibels / 20);
}

/**
 * Apply a simple gate/threshold to volume levels
 * @param volume Input volume level (0.0 to 1.0)
 * @param threshold Minimum threshold (0.0 to 1.0)
 * @returns Gated volume level
 */
export function applyVolumeGate(volume: number, threshold: number = 0.01): number {
    return volume >= threshold ? volume : 0;
}