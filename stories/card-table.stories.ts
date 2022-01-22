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
  cards: Array<string>;
}

const Template: Story<ArgTypes> = ({ gamesize, cards }: ArgTypes) => html`
  <mc-card-table
    gamesize=${gamesize}
    cards=${JSON.stringify(cards)}
  ></mc-card-table>
`;

function testUrls(n: Number) {
  const urls: Array<string> = [];
  for (let i = 0; i < n; i++) {
    const u = `https://foo.bar/${Math.floor(Math.random() * 10000)}`;
    urls.push(u);
    urls.push(u);
  }
  return urls;
}

export const Small = Template.bind({});
Small.args = { gamesize: 3, cards: testUrls(3) };

export const Medium = Template.bind({});
Medium.args = { gamesize: 6, cards: testUrls(6) };

export const Large = Template.bind({});
Large.args = { gamesize: 8, cards: testUrls(8) };

export const Super = Template.bind({});
Super.args = { gamesize: 1, cards: testUrls(12) };
