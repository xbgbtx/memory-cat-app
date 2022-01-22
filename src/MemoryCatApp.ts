import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { interpret } from 'xstate';
import {
  memoryCatMachine,
  MemoryCatContext,
  memoryCatsInitialContext,
} from './xstate/MemoryCatAppState.js';
import './MemoryCatWelcome.js';
import './MemoryCatFetch.js';
import './MemoryCatDealing.js';
import './MemoryCatCardTable.js';

const appState = interpret(memoryCatMachine);

function forwardAppEvent(e: Event) {
  appState.send((e as CustomEvent).detail);
}

export class MemoryCatApp extends LitElement {
  @property({ type: String }) stateName = '';

  @property({ type: Object }) context: MemoryCatContext;

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

    this.context = memoryCatsInitialContext();

    appState.onTransition(state => {
      const s = JSON.stringify(state.value);
      this.stateName = s.replace(/"/g, '');
      this.context = state.context;
    });
    appState.start();
    this.addEventListener('memory-cat-event', forwardAppEvent);
  }

  render() {
    return html`
      <main>
        <h1>Memory Cats!</h1>
        ${this.renderApp()}
        <p>State = ${this.stateName}</p>
        <p>Context = ${JSON.stringify(this.context)}</p>
      </main>
    `;
  }

  renderApp() {
    switch (this.stateName) {
      case 'welcome':
        return html`<mc-welcome></mc-welcome>`;
      case 'fetchCats':
        return html`<mc-fetch
          catsRequired="${this.context.gamesize}"
          numFetched="${this.context.catUrls.length}"
        ></mc-fetch>`;
      case 'dealing':
        return html`<mc-dealing> </mc-dealing>`;
      case 'noSelection':
        return html`<mc-card-table
          gamesize=${this.context.gamesize}
          cards=${JSON.stringify(this.context.cards)}
        ></mc-card-table>`;
      default:
        return html`Error!`;
    }
  }
}
