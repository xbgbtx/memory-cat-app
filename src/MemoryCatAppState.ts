import { createMachine, assign, send } from 'xstate';

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

const fetchCatUrl = () => {
  window.setTimeout(() => {
    const url = `Cat=${Math.floor(Math.random() * 1000)}`;
    const e = new CustomEvent('memory-cat-event', {
      bubbles: true,
      composed: true,
      detail: { type: 'RECEIVEDCATURL', catUrl: url },
    });
    window.dispatchEvent(e);
  }, 1000);
};

const storeCatUrl = assign({
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
        entry: send('STARTFETCH'),
        always: {
          target: 'gameplay',
          cond: 'enoughCats',
        },
        on: {
          STARTFETCH: {
            actions: 'fetchCatUrl',
          },
          RECEIVEDCATURL: {
            actions: 'storeCatUrl',
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
    actions: { storeCatUrl, fetchCatUrl, applyConfig },
    guards: { enoughCats, validConfig },
  }
);

export { memoryCatMachine };
