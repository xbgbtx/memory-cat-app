import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-card-table')
export class MemoryCatCardTable extends LitElement {
  @property({ type: Number }) gamesize = 0;

  static styles = css``;

  render() {
    return html`
      <main>
        <p>Card Table...</p>
        <p>Size = ${this.gamesize}</p>
      </main>
    `;
  }
}
