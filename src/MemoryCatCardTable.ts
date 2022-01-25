import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MemoryCatEvents, Card } from './xstate/MemoryCatAppState.js';

@customElement('mc-card-table')
export class MemoryCatCardTable extends LitElement {
  @property({ type: Number }) gamesize = 0;

  @property({ type: Array }) cards: Array<Card> = [];

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

  constructor() {
    super();

    window.addEventListener(
      'TABLEUPDATED',
      (e: Event) => {
        const detail: MemoryCatEvents.BaseEvent = (e as CustomEvent).detail;
        const cards: Array<Card> = (detail as MemoryCatEvents.TableUpdated)
          .cards;
        this.cards = cards;
      },
      false
    );
  }

  render() {
    return html` <main>${this.renderCards()}</main> `;
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
    if (this.cards == null || this.cards.length == 0) return html``;
    return html`
      <div
        class="card-table"
        style="grid-template-columns: repeat(${this.numColumns()}, 1fr)"
      >
        ${this.cards.map(c => html`<div class="card">${c.imageUrl}</div>`)}
      </div>
    `;
  }
}
