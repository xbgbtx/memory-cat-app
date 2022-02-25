import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MemoryCatEvents, Card } from './xstate/MemoryCatAppTypes.js';
import { dispatchMCEvent } from './MemoryCatApp.js';

@customElement('mc-card-table')
export class MemoryCatCardTable extends LitElement {
  @property({ type: Number }) gamesize = 0;

  @property({ type: Array }) cards: Array<Card> = [];

  //card indexes in this array have the dancing class
  @property({ type: Array }) dancing: Array<number> = [];

  static styles = css`
    :host {
      --card-undealt-transform: translate(0px, 400px) rotate(80deg);
      --card-pos-transform: translate(0px, 0px);
      --card-front-transform: rotateY(180deg);
      --card-back-transform: rotate(0deg);
    }

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
      padding: 3vw;
      width: 80vw;
    }

    .card {
      aspect-ratio: 1 / 1.375;
      display: flex;
    }

    @keyframes dealing {
      0% {
        transform: var(--card-undealt-transform);
      }
      100% {
        transform: var(--card-pos-transform);
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
      transform: var(--card-front-transform);
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

    @keyframes dancing {
      0% {
        transform: translate(0px, 0px) var(--card-front-transform);
      }
      25% {
        transform: translate(0px, 4px) var(--card-front-transform);
      }
      75% {
        transform: translate(0px, -40px) var(--card-front-transform);
      }
      100% {
        transform: translate(0px, 0px) var(--card-front-transform);
      }
    }

    .card-inner.dance {
      animation: dancing 0.3s ease-in 0s 3;
    }

    .card-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 27px;
      margin: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%);
    }
  `;

  constructor() {
    super();

    //Handler to store updated card data fron message
    const updateCards = (e: Event) => {
      const detail: MemoryCatEvents.BaseEvent = (e as CustomEvent).detail;
      const { cards } = detail as MemoryCatEvents.CardDealt;
      this.cards = cards;
    };

    //Handler to respond that animation is complete
    const animationComplete = (animationName: string, delay: number) => () =>
      window.setTimeout(
        () => dispatchMCEvent({ type: `${animationName}AnimComplete` }),
        delay
      );

    window.addEventListener(
      'cardDealt',
      e => {
        updateCards(e);
        animationComplete('deal', 100)();
      },
      false
    );

    window.addEventListener(
      'cardRevealed',
      e => {
        updateCards(e);
        animationComplete('reveal', 500)();
      },
      false
    );

    window.addEventListener(
      'cardsHidden',
      e => {
        window.setTimeout(() => {
          updateCards(e);
          animationComplete('hide', 500)();
        }, 700);
      },
      false
    );

    window.addEventListener(
      'correctPick',
      e => {
        const detail: MemoryCatEvents.BaseEvent = (e as CustomEvent).detail;
        this.dancing = (detail as MemoryCatEvents.CorrectPick).picks;

        window.setTimeout(() => {
          this.dancing = [];
          animationComplete('correct', 100)();
        }, 1000);
      },
      false
    );

    window.addEventListener(
      'victory',
      e => {
        this.dancing = this.cards.map((c, idx) => idx);
        window.setTimeout(() => {
          this.dancing = [];
          animationComplete('victory', 100)();
        }, 2000);
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

  numRows() {
    const cards = this.cards.length;
    return Math.floor(cards / this.numColumns());
  }

  renderCards() {
    if (this.cards == null || this.cards.length == 0) return html``;

    const cardClicked = (idx: number) =>
      dispatchMCEvent({
        type: 'cardPicked',
        card: idx,
      } as MemoryCatEvents.CardClicked);

    const cardClass = (c: Card, idx: number) =>
      ['card', c.dealt ? 'dealt' : ' undealt']
        .filter(className => className.length > 0)
        .join(' ');

    const innerClass = (c: Card, idx: number) =>
      [
        'card-inner',
        c.revealed ? 'front' : 'back',
        this.dancing.findIndex(x => x == idx) == -1 ? '' : 'dance',
      ]
        .filter(className => className.length > 0)
        .join(' ');

    const cardWidth = () => 98 / Math.max(1, this.numColumns() + 1);

    return html`
      <div
        class="card-table"
        style="grid-template-columns: repeat(${this.numColumns()}, 1fr);grid-template-rows: repeat(${this.numRows()}, 1fr)"
      >
        ${this.cards.map(
          (c, idx) => html`
            <div class="${cardClass(c, idx)}" style="height:${cardWidth()}vw">
              <div
                @click="${() => cardClicked(idx)}"
                class=${innerClass(c, idx)}
              >
                <div class="card-front">
                  <img class="card-img" src="${c.imageUrl}" loading="eager" />
                </div>
                <div class="card-back">Card Back</div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}
