import { createMachine, assign, send, sendParent } from 'xstate';
import {
  MemoryCatContext,
  MemoryCatEvents,
  CardTableContext,
  Card,
} from './MemoryCatAppTypes.js';

const dealCard = assign({
  cards: (context: CardTableContext, _) => {
    let cardDealt = false;
    return context.cards.reduce<Array<Card>>((prev, next) => {
      if (cardDealt || next.dealt) return [...prev, next];
      cardDealt = true;
      return [...prev, { ...next, dealt: true }];
    }, []);
  },
});

const handleCardClick = assign({
  cards: (context: CardTableContext, e) => {
    const cardIdx = (e as MemoryCatEvents.CardClicked).card;
    console.log(`Clicked card ${cardIdx}`);
    return context.cards;
  },
});

const cardsUpdated = sendParent((context: CardTableContext, _) => ({
  type: 'TABLEUPDATED',
  cards: context.cards,
}));

function allCardsDealt(context: CardTableContext) {
  return context.cards.filter(c => !c.dealt).length == 0;
}

export const cardTableMachine = createMachine<CardTableContext>(
  {
    id: 'cardTable',
    initial: 'dealing',
    context: { cards: [], userPicks: [] },
    states: {
      dealing: {
        entry: 'cardsUpdated',
        always: {
          target: 'ready',
          cond: 'allCardsDealt',
        },
        after: { 150: { actions: 'dealCard', target: 'dealing' } },
      },
      ready: {
        entry: 'cardsUpdated',
        on: { CARDCLICKED: { actions: 'handleCardClick', target: 'ready' } },
      },
    },
  },
  {
    actions: { dealCard, cardsUpdated, handleCardClick },
    guards: { allCardsDealt },
  }
);