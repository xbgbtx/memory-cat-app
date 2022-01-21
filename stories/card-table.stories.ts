import { html, TemplateResult } from 'lit';
import '../src/MemoryCatCardTable.js';

export default {
  title: 'card table',
  component: 'mc-card-table',
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
  gamesize: Number;
}

const Template: Story<ArgTypes> = ({ gamesize }: ArgTypes) => html`
  <mc-card-table gamesize=${gamesize}></mc-card-table>
`;

export const Small = Template.bind({});
Small.args = { gamesize: 3 };

export const Medium = Template.bind({});
Medium.args = { gamesize: 6 };

export const Large = Template.bind({});
Large.args = { gamesize: 8 };

export const Super = Template.bind({});
Super.args = { gamesize: 12 };
