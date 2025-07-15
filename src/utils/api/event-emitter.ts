type EventCallback = (...args: any[]) => void;

export class EventEmitter {
    private events: Map<string, EventCallback[]>;

    constructor() {
        this.events = new Map();
    }

    public on(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);
    }

    public off(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event)!;
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
        
        if (callbacks.length === 0) {
            this.events.delete(event);
        }
    }

    protected emit(event: string, ...args: any[]): void {
        if (!this.events.has(event)) return;
        
        this.events.get(event)!.forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`Error in event ${event} callback:`, error);
            }
        });
    }
} 