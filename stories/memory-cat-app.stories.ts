import { html, TemplateResult } from 'lit';
import '../src/memory-cat-app.js';

export default {
  title: 'MemoryCatApp',
  component: 'memory-cat-app',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ title, backgroundColor = 'white' }: ArgTypes) => html`
  <memory-cat-app style="--memory-cat-app-background-color: ${backgroundColor}" .title=${title}></memory-cat-app>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
