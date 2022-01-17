import { createMachine, assign } from 'xstate';
const addCatUrl = assign({
    catUrls: (context, event) => [...context.catUrls, 'foo'],
});
function enoughCats(context) {
    return context.catUrls.length >= 6;
}
const memoryCatMachine = createMachine({
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
}, {
    actions: { addCatUrl },
    guards: { enoughCats },
});
export { memoryCatMachine };
//# sourceMappingURL=MemoryCatAppState.js.map