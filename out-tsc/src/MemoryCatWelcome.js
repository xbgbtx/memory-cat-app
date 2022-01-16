import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MemoryCatEvent } from './MemoryCatEvent.js';
let MemoryCatWelcome = class MemoryCatWelcome extends LitElement {
    render() {
        return html `
      <main>
        <p>Click to fetch cats!</p>
        <button @click="${this._startFetch}">Click</button>
      </main>
    `;
    }
    _startFetch() {
        const stateEvent = new MemoryCatEvent('start');
        this.dispatchEvent(stateEvent);
    }
};
MemoryCatWelcome.styles = css ``;
MemoryCatWelcome = __decorate([
    customElement('mc-welcome')
], MemoryCatWelcome);
export { MemoryCatWelcome };
//# sourceMappingURL=MemoryCatWelcome.js.map