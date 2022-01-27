import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { interpret } from 'xstate';
import {
  memoryCatMachine,
  memoryCatsInitialContext,
} from './xstate/MemoryCatAppState.js';
import {
  MemoryCatContext,
  MemoryCatEvents,
} from './xstate/MemoryCatAppTypes.js';
import './MemoryCatWelcome.js';
import './MemoryCatFetch.js';
import './MemoryCatDealing.js';
import './MemoryCatCardTable.js';

const appState = interpret(memoryCatMachine);

function forwardAppEvent(e: Event) {
  appState.send((e as CustomEvent).detail);
}

export function dispatchMCEvent(e: MemoryCatEvents.BaseEvent) {
  window.dispatchEvent(
    new CustomEvent('memory-cat-event', {
      bubbles: true,
      composed: true,
      detail: e,
    })
  );
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

    appState.onTransition((state, e: MemoryCatEvents.BaseEvent) => {
      const s = JSON.stringify(state.value);
      this.stateName = s.replace(/"/g, '');
      this.context = state.context;

      //forward events for components that are listening
      const stateEvent = new CustomEvent(e.type, {
        composed: true,
        detail: e,
      });
      window.dispatchEvent(stateEvent);
    });
    appState.start();
    window.addEventListener('memory-cat-event', forwardAppEvent);
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
      case 'cardTable':
        return html`<mc-card-table></mc-card-table>`;
      default:
        return html`Error!`;
    }
  }
}
