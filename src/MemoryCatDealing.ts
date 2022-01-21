import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-dealing')
export class MemoryCatDealing extends LitElement {
  @property({ type: String }) numFetched = 0;

  @property({ type: String }) catsRequired = 0;

  static styles = css``;

  constructor() {
    super();
    window.setTimeout(() => {
      const e = new CustomEvent('memory-cat-event', {
        bubbles: true,
        composed: true,
        detail: { type: 'DEALCOMPLETE' },
      });
      this.dispatchEvent(e);
    }, 2000);
  }

  render() {
    return html`
      <main>
        <p>Dealing...</p>
      </main>
    `;
  }
}
