
import { Observable } from 'rxjs';

export default (audioElement: HTMLAudioElement, eventName: string): Observable<Event> => {
    return new Observable<Event>(observer => {
        const handler = (event: Event) => observer.next(event);

        audioElement.addEventListener(eventName, handler);

        return () => {
            audioElement.removeEventListener(eventName, handler);
        };
    });
}