import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MemoryCatEvents, Card } from './xstate/MemoryCatAppTypes.js';
import { dispatchMCEvent } from './MemoryCatApp.js';

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
      margin: 0 auto;
      text-align: center;
    }

    .card-table {
      display: grid;
      grid-gap: 1rem;
      height: 80%;
      width: 80vw;
    }

    .card {
      aspect-ratio: 1 / 1.6;
      display: flex;
    }

    @keyframes dealing {
      0% {
        transform: translate(0px, 400px) rotate(80deg);
      }
      100% {
        transform: translate(0px, 0px) rotate(0deg);
      }
    }

    .card-inner {
      border: 5px ridge #8275be;
      border-radius: 27px;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      display: flex;
    }

    .card.dealt {
      animation: dealing 0.3s ease-out;
    }

    .card.undealt {
      visibility: hidden;
    }
  `;

  constructor() {
    super();

    window.addEventListener(
      'cardDealt',
      (e: Event) => {
        const detail: MemoryCatEvents.BaseEvent = (e as CustomEvent).detail;
        const { cards, dealt } = detail as MemoryCatEvents.CardDealt;
        this.cards = cards;
        window.setTimeout(
          () => dispatchMCEvent({ type: 'dealAninComplete' }),
          500
        );
      },
      false
    );

    dispatchMCEvent({ type: 'tableComponentReady' });
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

    const cardClicked = (idx: number) =>
      dispatchMCEvent({
        type: 'CARDCLICKED',
        card: idx,
      } as MemoryCatEvents.CardClicked);

    return html`
      <div
        class="card-table"
        style="grid-template-columns: repeat(${this.numColumns()}, 1fr)"
      >
        ${this.cards.map(
          (c, idx) => html`
            <div class="${'card ' + (c.dealt ? 'dealt' : ' undealt')}">
              <div
                @click="${() => cardClicked(idx)}"
                class=${'card-inner ' +
                (c.revealed ? 'card-front' : 'card-back')}
              >
                <div>${c.imageUrl}</div>
                <div>Card Back</div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}
