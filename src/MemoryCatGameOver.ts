import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dispatchMCEvent } from './MemoryCatApp.js';

@customElement('mc-game-over')
export class MemoryCatGameOver extends LitElement {
  static styles = css``;

  @property({ type: Array }) catUrls: Array<string> = [];

  render() {
    return html`
      <main>
        <p>You remembered all the cats!</p>
        ${this.renderCats()}
        <button @click="${() => dispatchMCEvent({ type: 'newGame' })}">
          New Game
        </button>
      </main>
    `;
  }

  renderCats() {
    if (this.catUrls != null)
      return this.catUrls.map(url => html`<img src="${url}" />`);
  }
}
