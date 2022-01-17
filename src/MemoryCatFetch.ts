import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-fetch')
export class MemoryCatFetch extends LitElement {
  @property({ type: String }) numFetched = 0;

  static styles = css``;

  constructor() {
    super();

    this._fetchLoop();
  }

  _fetchLoop() {
    const e = new CustomEvent('memory-cat-event', {
      bubbles: true,
      composed: true,
      detail: { type: 'RECEIVEDCATURL' },
    });
    this.dispatchEvent(e);
    setTimeout(() => {
      this._fetchLoop();
    }, 2000);
  }

  render() {
    return html`
      <main>
        <p>Fetched ${this.numFetched}</p>
      </main>
    `;
  }
}
