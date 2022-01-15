import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { interpret } from 'xstate';
import { memoryCatMachine } from './MemoryCatAppState.js';

export class MemoryCatApp extends LitElement {
  @property({ type: String }) appState = '';

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--memory-cat-app-background-color);
    }

    main {
      flex-grow: 1;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  constructor() {
    super();
    const stateService = interpret(memoryCatMachine);
    stateService.onTransition(state => {
      this.appState = JSON.stringify(state);
    });
    stateService.start();
  }

  render() {
    return html`
      <main>
        <h1>Memory Cats!</h1>
        <p>State = ${this.appState}</p>
      </main>
    `;
  }
}
