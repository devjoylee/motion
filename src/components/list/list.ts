import { BaseComponent, Component } from '../component.js';

export class ListItem extends BaseComponent<HTMLElement> {
  constructor() {
    super(`
      <section class="list-item">
        <div class="list-item__body"></div>
        <div class="list-item__controls">
          <button class="close">&times;</button>
        </div>
      </section>
    `);
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      '.list-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }
}

export class List extends BaseComponent<HTMLDivElement> {
  constructor() {
    super(`<div class="list"></div>`);
  }

  addChild(section: Component) {
    const item = new ListItem();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
  }
}
