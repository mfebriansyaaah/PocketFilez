class MockEventEmitter {
  constructor() {
    this.listeners = new Map();
  }
  addListener(event, callback) {
    const list = this.listeners.get(event) || [];
    list.push(callback);
    this.listeners.set(event, list);
    return { remove: () => this.removeListener(event, callback) };
  }
  removeListener(event, callback) {
    const list = (this.listeners.get(event) || []).filter((cb) => cb !== callback);
    this.listeners.set(event, list);
  }
  removeAllListeners(event) {
    if (event) this.listeners.delete(event);
    else this.listeners = new Map();
  }
  emit(event, ...args) {
    (this.listeners.get(event) || []).forEach((cb) => cb(...args));
  }
}

global.EventEmitter = MockEventEmitter;
