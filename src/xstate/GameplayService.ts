import { createMachine, assign } from 'xstate';

export const gameplayMachine = createMachine({
  id: 'gameplay-machine',
  initial: 'dealing',
  states: {
    dealing: {
      after: {
        500: { target: 'gameover' },
      },
    },
    gameover: {
      type: 'final',
    },
  },
});
