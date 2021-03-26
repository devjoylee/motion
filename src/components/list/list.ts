import { BaseComponent } from '../component.js';

export class List extends BaseComponent<HTMLDivElement> {
  constructor() {
    super(`<div class="list"></div>`);
  }
}
