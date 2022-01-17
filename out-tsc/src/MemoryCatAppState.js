import { createMachine } from 'xstate';
const memoryCatMachine = createMachine({
    id: 'memory-cat',
    initial: 'welcome',
    states: {
        welcome: {
            on: {
                start: { target: 'fetchCats' },
            },
        },
        fetchCats: {},
        gameplay: {},
    },
});
export { memoryCatMachine };
//# sourceMappingURL=MemoryCatAppState.js.map