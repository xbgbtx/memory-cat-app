import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mc-welcome')
export class MemoryCatWelcome extends LitElement {
  static styles = css``;

  render() {
    return html`
      <main>
        <form @submit="${this._startGame}" id="options-form">
          <label for="gamesize">Game Size:</label>
          <select name="gamesize" id="gamesize" form="options-form">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <br />
          <input type="submit" value="Start Game" />
        </form>
      </main>
    `;
  }

  private _startGame(e: Event) {
    e.preventDefault();

    const stateEvent = new CustomEvent('memory-cat-event', {
      bubbles: true,
      composed: true,
      detail: { type: 'START', gamesize: 20 },
    });
    this.dispatchEvent(stateEvent);
  }
}
