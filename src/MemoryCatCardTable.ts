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

    .card.dealt {
      animation: dealing 0.1s ease-out;
    }

    .card.undealt {
      visibility: hidden;
    }

    .card-inner {
      border: 5px ridge #8275be;
      border-radius: 27px;
      height: 100%;
      width: 100%;
      transition: transform 0.8s;
      transform-style: preserve-3d;
    }

    .card-inner.front {
      transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden; /* Safari */
      backface-visibility: hidden;
    }

    .card-front {
      transform: rotateY(180deg);
    }
    .card-back {
      transform: rotateY(0deg);
    }
  `;

  constructor() {
    super();

    //generic handler to update cards and return animation complete message
    const actionHandler =
      (animationName: string, delay: number) => (e: Event) => {
        const detail: MemoryCatEvents.BaseEvent = (e as CustomEvent).detail;
        const { cards } = detail as MemoryCatEvents.CardDealt;
        this.cards = cards;
        window.setTimeout(
          () => dispatchMCEvent({ type: `${animationName}AnimComplete` }),
          delay
        );
      };

    window.addEventListener('cardDealt', actionHandler('deal', 100), false);
    window.addEventListener(
      'cardRevealed',
      actionHandler('reveal', 500),
      false
    );

    //a small delay is added before hiding the cards
    window.addEventListener(
      'cardsHidden',
      e => window.setTimeout(() => actionHandler('hide', 500)(e), 700),
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
        type: 'cardPicked',
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
                class=${'card-inner ' + (c.revealed ? 'front' : 'back')}
              >
                <div class="card-front">${c.imageUrl}</div>
                <div class="card-back">Card Back</div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}
