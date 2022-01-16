import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
let MemoryCatWelcome = class MemoryCatWelcome extends LitElement {
    render() {
        return html `
      <main>
        <p>Click to fetch cats!</p>
      </main>
    `;
    }
};
MemoryCatWelcome.styles = css ``;
MemoryCatWelcome = __decorate([
    customElement('mc-welcome')
], MemoryCatWelcome);
export { MemoryCatWelcome };
//# sourceMappingURL=MemoryCatWelcome.js.map