import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let MemoryCatFetch = class MemoryCatFetch extends LitElement {
    constructor() {
        super(...arguments);
        this.numFetched = 0;
    }
    render() {
        return html `
      <main>
        <p>Fetched ${this.numFetched}</p>
      </main>
    `;
    }
};
MemoryCatFetch.styles = css ``;
__decorate([
    property({ type: Number })
], MemoryCatFetch.prototype, "numFetched", void 0);
MemoryCatFetch = __decorate([
    customElement('mc-fetch')
], MemoryCatFetch);
export { MemoryCatFetch };
//# sourceMappingURL=MemoryCatFetch.js.map