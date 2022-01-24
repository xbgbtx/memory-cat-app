import { createMachine, assign, send, sendParent } from 'xstate';

namespace MemoryCatEvents {
  interface BaseEvent {
    type: string;
  }

  export interface Config extends BaseEvent {
    gamesize: number;
  }

  export interface ReceivedCatUrl extends BaseEvent {
    data: string;
  }

  export interface Shuffle extends BaseEvent {
    catUrls: Array<string>;
  }
}

export interface MemoryCatContext {
  gamesize: number;
  catUrls: Array<string>;
  cards?: Array<string>;
}

export interface CardTableContext {
  cards: Array<string>;
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
  return catUrls.reduce<Array<string>>((acc, curr) => [...acc, curr, curr], []);
}

const applyConfig = assign({
  gamesize: (context: MemoryCatContext, e) =>
    (e as MemoryCatEvents.Config).gamesize,
});

function validConfig(context: MemoryCatContext) {
  return context.gamesize > 2 && context.gamesize <= 12;
}

function enoughCats(context: MemoryCatContext) {
  return context.catUrls.length >= context.gamesize;
}

const cardTableMachine = createMachine<CardTableContext>({
  id: 'card-table',
  initial: 'dealing',
  states: {
    dealing: {
      entry: () => console.log('Card table dealing'),
    },
  },
});

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
