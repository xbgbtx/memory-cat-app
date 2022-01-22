import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-card-table')
export class MemoryCatCardTable extends LitElement {
  @property({ type: Number }) gamesize = 0;

  @property({ type: Array }) cards = [];

  static styles = css``;

  render() {
    return html` <main>${this.renderCards()}</main> `;
  }

  renderCards() {
    return this.cards.map(url => html`<div>${url}</div>`);
  }
}
