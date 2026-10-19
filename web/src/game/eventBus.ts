type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    if (this.events.has(event)) {
      this.events.get(event)!.delete(callback);
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach(cb => {
        try {
          cb(...args);
        } catch (err) {
          console.error(`Error in event listener for "${event}":`, err);
        }
      });
    }
  }
}

export const eventBus = new EventBus();
