import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-game-over')
export class MemoryCatGameOver extends LitElement {
  static styles = css``;

  render() {
    return html`
      <main>
        <p>You remembered all the cats!</p>
      </main>
    `;
  }
}
