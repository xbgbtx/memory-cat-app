import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-fetch')
export class MemoryCatFetch extends LitElement {
  @property({ type: String }) numFetched = 0;

  @property({ type: String }) catsRequired = 0;

  static styles = css``;

  constructor() {
    super();

    setTimeout(async () => {
      await this._fetchLoop();
    }, 0);
  }

  async _fetchLoop() {
    const url = `Cat=${Math.floor(Math.random() * 1000)}`;
    const e = new CustomEvent('memory-cat-event', {
      bubbles: true,
      composed: true,
      detail: { type: 'RECEIVEDCATURL', catUrl: url },
    });
    this.dispatchEvent(e);

    setTimeout(async () => {
      await this._fetchLoop();
    }, 2000);
  }

  render() {
    return html`
      <main>
        <p>Fetched ${this.numFetched} / ${this.catsRequired}</p>
      </main>
    `;
  }
}
