import { createMachine, assign } from 'xstate';

export interface MemoryCatContext {
  catUrls: Array<string>;
}

namespace MemoryCatEvents {
  export interface ReceivedCatUrl {
    type: string;
    catUrl: string;
  }
}

export function memoryCatsInitialContext() {
  return {
    catUrls: [],
  };
}

const addCatUrl = assign({
  catUrls: (context: MemoryCatContext, event) => {
    const url = (event as MemoryCatEvents.ReceivedCatUrl).catUrl;
    return [...context.catUrls, url];
  },
});

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
        on: {
          START: { target: 'fetchCats' },
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
    actions: { addCatUrl },
    guards: { enoughCats },
  }
);

export { memoryCatMachine };
