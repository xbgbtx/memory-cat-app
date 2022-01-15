import { createMachine } from 'xstate';

const memoryCatMachine = createMachine({
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
