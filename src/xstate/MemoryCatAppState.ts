import { createMachine, assign } from 'xstate';

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
}

export interface MemoryCatContext {
  gamesize: number;
  catUrls: Array<string>;
  cards?: Array<string>;
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
  catUrls: (context: MemoryCatContext, event) => {
    const url = (event as MemoryCatEvents.ReceivedCatUrl).data;
    return [...context.catUrls, url];
  },
});

const shuffleCards = assign({
  cards: (context: MemoryCatContext, event) => {
    const cards = context.catUrls.reduce<Array<string>>(
      (acc, curr) => [...acc, curr, curr],
      []
    );

    return cards;
  },
});

const applyConfig = assign({
  gamesize: (context: MemoryCatContext, event) =>
    (event as MemoryCatEvents.Config).gamesize,
});

function validConfig(context: MemoryCatContext) {
  return context.gamesize > 2 && context.gamesize <= 12;
}

function enoughCats(context: MemoryCatContext) {
  return context.catUrls.length >= context.gamesize;
}

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
          target: 'dealing',
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
      dealing: {
        entry: shuffleCards,
        on: { DEALCOMPLETE: { target: 'noSelection' } },
      },
      noSelection: {},
      gameover: {},
      error: {
        after: {
          2000: { target: 'welcome' },
        },
      },
    },
  },
  {
    actions: { applyConfig, storeCatUrl, shuffleCards },
    guards: { enoughCats, validConfig },
  }
);

export { memoryCatMachine };
