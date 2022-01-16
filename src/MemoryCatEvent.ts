export class MemoryCatEvent extends Event {
  action: string = 'no-action';

  constructor(action: string) {
    super('memory-cat-event', { bubbles: true, composed: true });
    this.action = action;
  }
}
