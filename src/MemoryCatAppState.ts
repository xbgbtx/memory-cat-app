import { createMachine, assign } from 'xstate';

export interface MemoryCatContext {
  gamesize: number;
  catUrls: Array<string>;
}

namespace MemoryCatEvents {
  interface BaseEvent {
    type: string;
  }

  export interface StartGame extends BaseEvent {
    gamesize: number;
  }

  export interface ReceivedCatUrl extends BaseEvent {
    catUrl: string;
  }
}

export function memoryCatsInitialContext() {
  return {
    catUrls: [],
    gamesize: 0,
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
    (event as MemoryCatEvents.StartGame).gamesize,
});

function validConfig(context: MemoryCatContext) {
  return context.gamesize > 2 && context.gamesize <= 12;
}

function enoughCats(context: MemoryCatContext) {
  return context.catUrls.length >= 6;
}

const memoryCatMachine = createMachine<MemoryCatContext>(
  {
    id: 'memory-cat',
    initial: 'welcome',
    context: memoryCatsInitialContext(),
    states: {
      welcome: {
        always: {
          target: 'fetchCats',
          cond: 'validConfig',
        },
        on: {
          START: {
            actions: 'applyConfig',
          },
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
    },
  },
  {
    actions: { addCatUrl, applyConfig },
    guards: { enoughCats, validConfig },
  }
);

export { memoryCatMachine };
