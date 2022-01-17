import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

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
    const stateEvent = new CustomEvent('memory-cat-event', {
      bubbles: true,
      composed: true,
      detail: { type: 'start' },
    });
    this.dispatchEvent(stateEvent);
  }
}
