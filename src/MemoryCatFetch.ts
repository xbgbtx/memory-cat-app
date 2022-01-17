import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-fetch')
export class MemoryCatFetch extends LitElement {
  @property({ type: Number }) numFetched = 0;

  static styles = css``;

  render() {
    return html`
      <main>
        <p>Fetched ${this.numFetched}</p>
      </main>
    `;
  }
}
