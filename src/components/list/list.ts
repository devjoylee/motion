import { BaseComponent, Component } from '../component.js';

type OnCloseListener = () => void;

export class ListItem extends BaseComponent<HTMLElement> {
  private closeListener?: OnCloseListener; // 외부에서 전달받은 콜백함수
  constructor() {
    super(`
      <section class="list-item">
        <div class="list-item__body"></div>
        <div class="list-item__controls">
          <button class="close">&times;</button>
        </div>
      </section>
    `);

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener(); // 클릭 시 콜백함수 실행
    };
  }

  // 전달받은 item을 html에 추가
  addChild(child: Component) {
    const container = this.element.querySelector(
      '.list-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }

  // 전달받은 콜백함수를 멤버변수에 저장
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
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
    item.setOnCloseListener(() => {
      // close버튼 클릭 시 실행할 콜백함수 정의
      item.removeFrom(this.element);
    });
  }
}
