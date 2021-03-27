import { BaseComponent } from '../../component.js';

export class TextSectionInput extends BaseComponent<HTMLElement> {
  constructor() {
    super(`
      <div class="input-form">
        <div class="form__container">
          <label for="title">Title</label>
          <input type="text" id="title" />
        </div>
        <div class="form__container">
          <label for="body">Body</label>
          <textarea type="text" row="3" id="body"></textarea>
        </div>
      </div>
    `);
  }

  // 사용자가 getter를 호출하는 시점의 DOM에 입력된 값(value)를 읽어온다.
  get title(): string {
    const element = this.element.querySelector('#title')! as HTMLInputElement;
    return element.value;
  }

  get body(): string {
    const element = this.element.querySelector('#body')! as HTMLTextAreaElement;
    return element.value;
  }
}
