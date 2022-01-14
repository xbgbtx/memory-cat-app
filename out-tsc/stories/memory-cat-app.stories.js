import { html } from 'lit';
import '../src/memory-cat-app.js';
export default {
    title: 'MemoryCatApp',
    component: 'memory-cat-app',
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};
const Template = ({ title, backgroundColor = 'white' }) => html `
  <memory-cat-app style="--memory-cat-app-background-color: ${backgroundColor}" .title=${title}></memory-cat-app>
`;
export const App = Template.bind({});
App.args = {
    title: 'My app',
};
//# sourceMappingURL=memory-cat-app.stories.js.map