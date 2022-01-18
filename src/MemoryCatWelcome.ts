import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

interface ConfigElements extends HTMLCollection {
  gamesize: HTMLInputElement;
}

@customElement('mc-welcome')
export class MemoryCatWelcome extends LitElement {
  static styles = css``;

  render() {
    return html`
      <main>
        <form
          @submit="${this._startGame}"
          @change="${this._applyConfig}"
          id="options-form"
        >
          <label for="gamesize">Game Size:</label>
          <select name="gamesize" id="gamesize" form="options-form">
            <option value="3">Small</option>
            <option value="6">Medium</option>
            <option value="8">Large</option>
          </select>
          <br />
          <input type="submit" value="Start Game" />
        </form>
      </main>
    `;
  }

  private _applyConfig() {
    const configForm = this.shadowRoot!.getElementById(
      'options-form'
    ) as HTMLFormElement;
    const configElements = configForm.elements as ConfigElements;
    const gamesize = parseInt(configElements.gamesize.value, 10);
    const stateEvent = new CustomEvent('memory-cat-event', {
      bubbles: true,
      composed: true,
      detail: { type: 'CONFIG', gamesize },
    });
    this.dispatchEvent(stateEvent);
  }

  private _startGame(e: Event) {
    e.preventDefault();

    const stateEvent = new CustomEvent('memory-cat-event', {
      bubbles: true,
      composed: true,
      detail: { type: 'START' },
    });
    this.dispatchEvent(stateEvent);
  }
}
