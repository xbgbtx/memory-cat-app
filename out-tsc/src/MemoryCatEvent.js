export class MemoryCatEvent extends Event {
    constructor(action) {
        super('memory-cat-event', { bubbles: true, composed: true });
        this.action = 'no-action';
        this.action = action;
    }
}
//# sourceMappingURL=MemoryCatEvent.js.map