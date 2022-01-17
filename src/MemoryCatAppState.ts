import { createMachine, assign } from 'xstate';

interface MemoryCatContext {
  catUrls: Array<string>;
}

const addCatUrl = assign({
  catUrls: (context: MemoryCatContext, event) => [...context.catUrls, 'foo'],
});

function enoughCats(context: MemoryCatContext) {
  return context.catUrls.length >= 6;
}

const memoryCatMachine = createMachine<MemoryCatContext>(
  {
    id: 'memory-cat',
    initial: 'welcome',
    context: {
      catUrls: [],
    },
    states: {
      welcome: {
        on: {
          start: { target: 'fetchCats' },
        },
      },
      fetchCats: {},
      gameplay: {},
    },
  },
  {
    actions: { addCatUrl },
    guards: { enoughCats },
  }
);

export { memoryCatMachine };
