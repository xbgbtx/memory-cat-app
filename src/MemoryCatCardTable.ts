import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-card-table')
export class MemoryCatCardTable extends LitElement {
  @property({ type: Number }) gamesize = 0;

  @property({ type: Array }) cards = [];

  static styles = css`
    main {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
    }

    .card-table {
      display: grid;
      grid-template-rows: repeat(auto-fill, 1fr);
    }

    .card {
      aspect-ratio: 1 / 1.6;
      margin: 8px;
      border: 5px ridge #8275be;
      border-radius: 27px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      justify-content: center;
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
    const allowedCols = [3, 4, 6].filter(n => n <= cards / 2);

    return allowedCols.reduce(
      (prev, next) => (cards % next == 0 ? next : prev),
      1
    );
  }

  renderCards() {
    return this.cards.map(url => html`<div class="card">${url}</div>`);
  }
}
