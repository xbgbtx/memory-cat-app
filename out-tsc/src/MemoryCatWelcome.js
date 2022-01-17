import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
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
        const stateEvent = new CustomEvent('memory-cat-event', {
            bubbles: true,
            composed: true,
            detail: { type: 'start' },
        });
        this.dispatchEvent(stateEvent);
    }
};
MemoryCatWelcome.styles = css ``;
MemoryCatWelcome = __decorate([
    customElement('mc-welcome')
], MemoryCatWelcome);
export { MemoryCatWelcome };
//# sourceMappingURL=MemoryCatWelcome.js.map