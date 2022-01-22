import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-card-table')
export class MemoryCatCardTable extends LitElement {
  @property({ type: Number }) gamesize = 0;

  @property({ type: Array }) cards = [];

  static styles = css`
    .card-table {
      display: grid;
      grid-template-rows: repeat(auto-fill, 1fr);
    }
  `;

  render() {
    return html`
      <main>
        <div
          class="card-table"
          style="grid-template-columns: repeat(${this.numColumns()}, 1fr)"
        >
          ${this.renderCards()}
        </div>
      </main>
    `;
  }

  /**
   * Number of columns to display cards -- must fill all rows.
   */
  numColumns() {
    const cards = this.cards.length;
    const allowedCols = [2, 3, 4, 6].filter(n => n < cards / 2);

    return allowedCols.reduce(
      (prev, next) => (cards % next == 0 ? next : prev),
      1
    );
  }

  renderCards() {
    return this.cards.map(url => html`<div class="card">${url}</div>`);
  }
}
