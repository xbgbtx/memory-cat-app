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

const processCorrectPick = pure(
  (context: CardTableContext, event: MemoryCatEvents.BaseEvent) => {
    const correctPicks = context.userPicks;
    return [
      sendParent((context: CardTableContext, e) => {
        return {
          type: 'correctPick',
          picks: correctPicks,
        };
      }),
      assign({
        userPicks: (context: CardTableContext, e) => [],
      }),
    ];
  }
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

function allCardsMatched(
  context: CardTableContext,
  e: MemoryCatEvents.BaseEvent
) {
  return context.cards.filter(c => !c.revealed).length == 0;
}

function pickedCardsMatch(
  context: CardTableContext,
  e: MemoryCatEvents.BaseEvent
) {
  return (
    context.userPicks.length == 2 &&
    new Set(context.userPicks.map(p => context.cards[p].imageUrl)).size == 1
  );
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
          dealAnimComplete: {
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
              target: 'correctPick',
              cond: 'pickedCardsMatch',
            },
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
      correctPick: {
        entry: 'processCorrectPick',
        on: {
          correctAnimComplete: [
            { target: 'victory', cond: 'allCardsMatched' },
            { target: 'awaitCardPick' },
          ],
        },
      },
      hidePicked: {
        entry: 'hidePickedCards',
        on: { hideAnimComplete: { target: 'awaitCardPick' } },
      },
      victory: {
        entry: sendParent('victory'),
        on: { victoryAnimComplete: { actions: sendParent('gameOver') } },
      },
    },
  },
  {
    actions: {
      dealCard,
      revealPickedCard,
      hidePickedCards,
      processCorrectPick,
    },

    guards: {
      allCardsDealt,
      pickedCardAlreadyRevealed,
      maxCardsPicked,
      pickedCardsMatch,
      allCardsMatched,
    },
  }
);
