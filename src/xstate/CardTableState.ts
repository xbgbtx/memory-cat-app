import { createMachine, assign, send, sendParent, actions } from 'xstate';
import {
  MemoryCatContext,
  MemoryCatEvents,
  CardTableContext,
  Card,
} from './MemoryCatAppTypes.js';

const { pure } = actions;

const dealCard = pure(
  (context: CardTableContext, event: MemoryCatEvents.BaseEvent) => [
    assign({
      cards: (context: CardTableContext, _) => {
        let cardDealt = false;
        return context.cards.reduce<Array<Card>>((prev, next) => {
          if (cardDealt || next.dealt) return [...prev, next];
          cardDealt = true;
          return [...prev, { ...next, dealt: true }];
        }, []);
      },
    }),
    sendParent((context: CardTableContext, _) => ({
      type: 'cardDealt',
      cards: context.cards,
    })),
  ]
);

const revealPickedCard = pure(
  (context: CardTableContext, event: MemoryCatEvents.BaseEvent) => [
    assign({
      userPicks: (context: CardTableContext, e) => [
        ...context.userPicks,
        (e as MemoryCatEvents.CardClicked).card,
      ],
      cards: (context: CardTableContext, e) => {
        const clickedIdx = (e as MemoryCatEvents.CardClicked).card;
        return context.cards.map((card, idx) =>
          idx == clickedIdx ? { ...card, revealed: true } : card
        );
      },
    }),
    sendParent((context: CardTableContext, e) => {
      const revealed = (e as MemoryCatEvents.CardClicked).card;
      return {
        type: 'cardRevealed',
        cards: context.cards,
      };
    }),
  ]
);

const hidePickedCards = pure(
  (context: CardTableContext, event: MemoryCatEvents.BaseEvent) => [
    assign({
      userPicks: (context: CardTableContext, e) => [],
      cards: (context: CardTableContext, e) => {
        return context.cards.map((card, idx) =>
          context.userPicks.includes(idx) ? { ...card, revealed: false } : card
        );
      },
    }),
    sendParent((context: CardTableContext, e) => {
      return {
        type: 'cardsHidden',
        cards: context.cards,
      };
    }),
  ]
);

function allCardsDealt(context: CardTableContext) {
  return context.cards.filter(c => !c.dealt).length == 0;
}

function pickedCardAlreadyRevealed(
  context: CardTableContext,
  e: MemoryCatEvents.BaseEvent
) {
  return context.cards[(e as MemoryCatEvents.CardClicked).card].revealed;
}

function maxCardsPicked(
  context: CardTableContext,
  e: MemoryCatEvents.BaseEvent
) {
  return context.userPicks.length >= 2;
}

export const cardTableMachine = createMachine<CardTableContext>(
  {
    id: 'cardTableMachine',
    initial: 'start',
    context: { cards: [], userPicks: [] },
    states: {
      start: {
        on: { tableComponentReady: { target: 'dealing' } },
      },
      dealing: {
        always: [
          {
            target: 'awaitCardPick',
            cond: 'allCardsDealt',
          },
          {
            target: 'dealCard',
          },
        ],
      },
      dealCard: {
        entry: 'dealCard',
        on: {
          dealAninComplete: {
            target: 'dealing',
          },
        },
      },
      awaitCardPick: {
        on: {
          cardPicked: [
            {
              cond: 'pickedCardAlreadyRevealed',
            },
            { target: 'revealCard' },
          ],
        },
      },
      revealCard: {
        entry: 'revealPickedCard',
        on: {
          revealAnimComplete: [
            {
              target: 'hidePicked',
              cond: 'maxCardsPicked',
            },
            {
              target: 'awaitCardPick',
            },
          ],
        },
      },
      hidePicked: {
        entry: 'hidePickedCards',
        on: { hideAnimComplete: { target: 'awaitCardPick' } },
      },
    },
  },
  {
    actions: { dealCard, revealPickedCard, hidePickedCards },

    guards: { allCardsDealt, pickedCardAlreadyRevealed, maxCardsPicked },
  }
);
