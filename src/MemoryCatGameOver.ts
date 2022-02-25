import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dispatchMCEvent } from './MemoryCatApp.js';

@customElement('mc-game-over')
export class MemoryCatGameOver extends LitElement {
  static styles = css`
    .cat-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .cat-img {
      max-width: 90vw;
      max-height: 90vw;
      width: auto;
      height: auto;
      padding-bottom: 10px;
    }
  `;

  @property({ type: Array }) catUrls: Array<string> = [];

  render() {
    return html`
      <main>
        <p>You remembered all the cats!</p>
        <div class="cat-container">${this.renderCats()}</div>
        <button @click="${() => dispatchMCEvent({ type: 'newGame' })}">
          New Game
        </button>
      </main>
    `;
  }

  renderCats() {
    if (this.catUrls == null) return html``;
    return this.catUrls.map(
      url => html`<img class="cat-img" src="${url}" loading="eager" />`
    );
  }
}
