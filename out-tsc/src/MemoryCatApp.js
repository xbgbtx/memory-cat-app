import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { interpret } from 'xstate';
import { memoryCatMachine } from './MemoryCatAppState.js';
import './MemoryCatWelcome.js';
const appState = interpret(memoryCatMachine);
function forwardAppEvent(e) {
    appState.send(e.action);
}
export class MemoryCatApp extends LitElement {
    constructor() {
        super();
        this.stateName = '';
        appState.onTransition(state => {
            const s = JSON.stringify(state.value);
            this.stateName = s.replace(/"/g, '');
        });
        appState.start();
        this.addEventListener('memory-cat-event', forwardAppEvent);
    }
    render() {
        return html `
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
                return html `<mc-welcome></mc-welcome>`;
            case 'getCards':
                return html `<p>Getting Cards!</p>`;
            default:
                return html `Error!`;
        }
    }
}
MemoryCatApp.styles = css `
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
__decorate([
    property({ type: String })
], MemoryCatApp.prototype, "stateName", void 0);
//# sourceMappingURL=MemoryCatApp.js.map