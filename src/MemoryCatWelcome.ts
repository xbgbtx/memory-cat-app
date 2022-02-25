import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MemoryCatEvents } from './xstate/MemoryCatAppTypes.js';
import { dispatchMCEvent } from './MemoryCatApp.js';

interface ConfigElements extends HTMLCollection {
  gamesize: HTMLInputElement;
}

@customElement('mc-welcome')
export class MemoryCatWelcome extends LitElement {
  static styles = css``;

  render() {
    return html`
      <main>
        <h1>Memory Cats!</h1>
        <form
          @submit="${this._startGame}"
          @change="${this._applyConfig}"
          id="options-form"
        >
          <label for="gamesize">Game Size:</label>
          <select name="gamesize" id="gamesize" form="options-form">
            <option value="3">Small</option>
            <option value="6" selected="selected">Medium</option>
            <option value="8">Large</option>
            <option value="12">Super</option>
          </select>
          <br />
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
    dispatchMCEvent({ type: 'CONFIG', gamesize } as MemoryCatEvents.Config);
  }

  private _startGame(e: Event) {
    e.preventDefault();

    dispatchMCEvent({ type: 'START' });
  }
}
