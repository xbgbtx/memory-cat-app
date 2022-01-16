import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { interpret } from 'xstate';
import { memoryCatMachine } from './MemoryCatAppState.js';
import './MemoryCatWelcome.js';

const appState = interpret(memoryCatMachine);

export class MemoryCatApp extends LitElement {
  @property({ type: String }) stateName = '';

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
    appState.onTransition(state => {
      const s = JSON.stringify(state.value);
      this.stateName = s.replace(/"/g, '');
    });
    appState.start();
  }

  render() {
    return html`
      <main>
        <h1>Memory Cats!</h1>
        ${this.renderApp()}
        <p>State = ${this.stateName}</p>
      </main>
    `;
  }

  renderApp() {
    switch (this.stateName) {
      case 'welcome':
        return html`<mc-welcome></mc-welcome>`;
      default:
        return html`Error!`;
    }
  }
}
