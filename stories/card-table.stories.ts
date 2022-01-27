import { html, TemplateResult } from 'lit';
import '../src/MemoryCatCardTable.js';
import { Card } from '../src/xstate/MemoryCatAppTypes.js';

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
  cards: Array<Card>;
}

const Template: Story<ArgTypes> = ({ gamesize, cards }: ArgTypes) => html`
  <mc-card-table
    gamesize=${gamesize}
    cards=${JSON.stringify(cards)}
  ></mc-card-table>
`;

function testCards(n: Number) {
  const cards: Array<Card> = [];
  for (let i = 0; i < n; i++) {
    const u = `https://foo.bar/${Math.floor(Math.random() * 10000)}`;
    const c = {
      imageUrl: u,
      dealt: false,
      revealed: false,
    };
    cards.push(c);
    cards.push(c);
  }
  return cards;
}

export const Small = Template.bind({});
Small.args = { gamesize: 3, cards: testCards(3) };

export const Medium = Template.bind({});
Medium.args = { gamesize: 6, cards: testCards(6) };

export const Large = Template.bind({});
Large.args = { gamesize: 8, cards: testCards(8) };

export const Super = Template.bind({});
Super.args = { gamesize: 1, cards: testCards(12) };
