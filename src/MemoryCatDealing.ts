import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-dealing')
export class MemoryCatDealing extends LitElement {
  @property({ type: String }) numFetched = 0;

  @property({ type: String }) catsRequired = 0;

  static styles = css``;

  render() {
    return html`
      <main>
        <p>Dealing...</p>
      </main>
    `;
  }
}
