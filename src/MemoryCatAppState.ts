import { createMachine, assign } from 'xstate';

export interface MemoryCatContext {
  gamesize: number;
  catUrls: Array<string>;
}

namespace MemoryCatEvents {
  interface BaseEvent {
    type: string;
  }

  export interface Config extends BaseEvent {
    gamesize: number;
  }

  export interface ReceivedCatUrl extends BaseEvent {
    catUrl: string;
  }
}

export function memoryCatsInitialContext() {
  return {
    catUrls: [],
    gamesize: 6,
  };
}

const addCatUrl = assign({
  catUrls: (context: MemoryCatContext, event) => {
    const url = (event as MemoryCatEvents.ReceivedCatUrl).catUrl;
    return [...context.catUrls, url];
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
          target: 'gameplay',
          cond: 'enoughCats',
        },
        on: {
          RECEIVEDCATURL: {
            target: 'fetchCats',
            actions: 'addCatUrl',
          },
        },
      },
      gameplay: {},
      error: {
        after: {
          2000: { target: 'welcome' },
        },
      },
    },
  },
  {
    actions: { addCatUrl, applyConfig },
    guards: { enoughCats, validConfig },
  }
);

export { memoryCatMachine };
