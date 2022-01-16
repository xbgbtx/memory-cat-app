import { createMachine } from 'xstate';

const memoryCatMachine = createMachine({
  id: 'memory-cat',
  initial: 'welcome',
  states: {
    welcome: {
      on: {
        start: { target: 'getCards' },
      },
    },
    getCards: {},
  },
});

export { memoryCatMachine };
