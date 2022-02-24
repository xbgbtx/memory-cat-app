import { createMachine, assign, send, actions, interpret } from 'xstate';
import {
  MemoryCatContext,
  MemoryCatEvents,
  CardTableContext,
  Card,
} from './MemoryCatAppTypes.js';
import { cardTableMachine } from './CardTableState.js';

const { pure } = actions;

export function memoryCatsInitialContext() {
  return {
    catUrls: [],
    gamesize: 6,
  };
}

const fetchCatUrl = () => {
  return fetch('https://wow-cool.online/cats/')
    .then(response => console.log(response))
    .catch(e => console.log(e))
    .then(() => `Cat=${Math.floor(Math.random() * 1000)}`);
};

const storeCatUrl = assign({
  catUrls: (context: MemoryCatContext, e) => {
    const url = (e as MemoryCatEvents.ReceivedCatUrl).data;
    return [...context.catUrls, url];
  },
});

const resetContext = pure(
  (context: MemoryCatContext, event: MemoryCatEvents.BaseEvent) => {
    const initial = memoryCatsInitialContext();

    //map initial context data to function pointers for assign
    const assignEntries = Object.entries(initial).map(([key, value]) => [
      key,
      () => value,
    ]);
    return [assign(Object.fromEntries(assignEntries) as MemoryCatContext)];
  }
);

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
        on: { gameOver: { target: 'gameOver' } },
      },
      gameOver: {
        on: { newGame: { target: 'welcome', actions: 'resetContext' } },
      },
      error: {
        after: {
          2000: {
            target: 'welcome',
            actions: 'resetContext',
          },
        },
      },
    },
  },
  {
    actions: { applyConfig, storeCatUrl, resetContext },
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
