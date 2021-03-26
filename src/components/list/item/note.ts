import { BaseComponent } from '../../component.js';

export class NoteComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, note: string) {
    super(`
      <div class="note">
        <h3 class="note__title"></h3>
        <p class="note__body"></p>
      </div>
    `);

    const titleElement = this.element.querySelector(
      '.note__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const noteElement = this.element.querySelector(
      '.note__body'
    )! as HTMLParagraphElement;
    noteElement.textContent = note;
  }
}
