import { createMachine, assign, send, sendParent } from 'xstate';

export namespace MemoryCatEvents {
  export interface BaseEvent {
    type: string;
  }

  export interface Config extends BaseEvent {
    gamesize: number;
  }

  export interface ReceivedCatUrl extends BaseEvent {
    data: string;
  }

  export interface TableUpdated extends BaseEvent {
    cards: Array<Card>;
  }
}

export interface MemoryCatContext {
  gamesize: number;
  catUrls: Array<string>;
}

export interface CardTableContext {
  cards: Array<Card>;
}

export interface Card {
  imageUrl: string;
  dealt: boolean;
  revealed: boolean;
}

export function memoryCatsInitialContext() {
  return {
    catUrls: [],
    gamesize: 6,
  };
}

const fetchCatUrl = () => {
  const sleep = new Promise(resolve => setTimeout(resolve, 1000));
  return sleep.then(() => `Cat=${Math.floor(Math.random() * 1000)}`);
};

const storeCatUrl = assign({
  catUrls: (context: MemoryCatContext, e) => {
    const url = (e as MemoryCatEvents.ReceivedCatUrl).data;
    return [...context.catUrls, url];
  },
});

function createCards(catUrls: Array<string>) {
  const card = (url: string) => ({
    imageUrl: url,
    dealt: false,
    revealed: false,
  });
  return catUrls.reduce<Array<Card>>(
    (acc, curr) => [...acc, card(curr), card(curr)],
    []
  );
}

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

const cardsUpdated = sendParent((context: CardTableContext, _) => ({
  type: 'TABLEUPDATED',
  cards: context.cards,
}));

const applyConfig = assign({
  gamesize: (context: MemoryCatContext, e) =>
    (e as MemoryCatEvents.Config).gamesize,
});

function allCardsDealt(context: CardTableContext) {
  return context.cards.filter(c => !c.dealt).length == 0;
}

function validConfig(context: MemoryCatContext) {
  return context.gamesize > 2 && context.gamesize <= 12;
}

function enoughCats(context: MemoryCatContext) {
  return context.catUrls.length >= context.gamesize;
}

const cardTableMachine = createMachine<CardTableContext>(
  {
    id: 'card-table',
    initial: 'dealing',
    context: { cards: [] },
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
      },
    },
  },
  {
    actions: { dealCard, cardsUpdated },
    guards: { allCardsDealt },
  }
);

const memoryCatMachine = createMachine<MemoryCatContext>(
  {
    id: 'memory-cat',
    initial: 'welcome',
    context: memoryCatsInitialContext(),
    states: {
      welcome: {
        on: {
          CONFIG: {
            actions: 'applyConfig',
          },
          START: [
            {
              target: 'fetchCats',
              cond: 'validConfig',
            },
            {
              target: 'error',
            },
          ],
        },
      },
      fetchCats: {
        always: {
          target: 'cardTable',
          cond: 'enoughCats',
        },
        invoke: {
          id: 'fetchCats',
          src: fetchCatUrl,
          onDone: {
            target: 'fetchCats',
            actions: 'storeCatUrl',
          },
          onError: {
            target: 'error',
          },
        },
      },
      cardTable: {
        invoke: {
          src: cardTableMachine,
          data: {
            cards: (context: MemoryCatContext, _: Event) =>
              createCards(context.catUrls),
          },
        },
      },
      gameover: {},
      error: {
        after: {
          2000: { target: 'welcome' },
        },
      },
    },
  },
  {
    actions: { applyConfig, storeCatUrl },
    guards: { enoughCats, validConfig },
  }
);

export { memoryCatMachine };
