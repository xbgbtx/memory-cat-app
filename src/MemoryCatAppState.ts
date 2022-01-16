import { createMachine } from 'xstate';

type MemoryCatEvent = { type: 'START' };

interface MemoryCatContext {
  cardsLoaded: number;
}

const memoryCatMachine = createMachine<MemoryCatContext, MemoryCatEvent>({
  id: 'memory-cat',
  initial: 'welcome',
  states: {
    welcome: {
      on: {
        START: { target: 'getCards' },
      },
    },
    getCards: {},
  },
});

export { memoryCatMachine };
