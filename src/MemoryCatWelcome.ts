import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MemoryCatEvent } from './MemoryCatEvent.js';

@customElement('mc-welcome')
export class MemoryCatWelcome extends LitElement {
  static styles = css``;

  render() {
    return html`
      <main>
        <p>Click to fetch cats!</p>
        <button @click="${this._startFetch}">Click</button>
      </main>
    `;
  }

  private _startFetch() {
    const stateEvent = new MemoryCatEvent('start');
    this.dispatchEvent(stateEvent);
  }
}
