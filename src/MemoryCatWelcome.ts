import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mc-welcome')
export class MemoryCatWelcome extends LitElement {
  static styles = css``;

  render() {
    return html`
      <main>
        <p>Click to fetch cats!</p>
      </main>
    `;
  }
}
