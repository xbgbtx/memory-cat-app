import { createMachine, assign, send, interpret } from 'xstate';
import {
  MemoryCatContext,
  MemoryCatEvents,
  CardTableContext,
  Card,
} from './MemoryCatAppTypes.js';
import { cardTableMachine } from './CardTableState.js';

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
          id: 'cardTableMachine',
          data: {
            userPicks: [],
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

const memoryCatAppState = interpret(memoryCatMachine).onTransition(
  (state, e) => {
    if (state.value == 'cardTable' && state.children.cardTableMachine != null) {
      state.children.cardTableMachine.send(e);
    }
  }
);

export { memoryCatAppState };
