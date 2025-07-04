export function Debounce(delay: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let timer: any;
        descriptor.value = function (...args: any[]) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                originalMethod.apply(this, args);
            }, delay);
        };
        return descriptor;
    }
}