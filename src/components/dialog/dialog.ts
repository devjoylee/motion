import { BaseComponent, Component } from '../component.js';

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export class Dialog extends BaseComponent<HTMLElement> {
  // 외부에서 전달받은 Event Listener 저장 장소
  closeListener?: OnCloseListener;
  submitListener?: OnSubmitListener;

  constructor() {
    super(`
      <div class="dialog">
        <div class="dialog__container">
          <button class="close">&times;</button>
          <div class="dialog__body"></div>
          <button class="submit">ADD</button>
        </div>
      </div>
    `);

    // 👉 이벤트 처리 방법
    // 👉 내부적으로 처리하지 않고 외부로 부터 전달 받은 리스너가 있으면 호출해 주는 방식으로 작성한다.

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };

    const submitBtn = this.element.querySelector(
      '.submit'
    )! as HTMLButtonElement;
    submitBtn.onclick = () => {
      this.submitListener && this.submitListener();
    };
  }

  // 외부에서 이벤트 전달에 사용할 methods.
  // 전달받은 Event Listener를 각각의 내부 변수에 저장한다.
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }

  setOnSubmitListener(listener: OnSubmitListener) {
    this.submitListener = listener;
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      '.dialog__body'
    )! as HTMLElement;
    child.attachTo(container);
  }
}
