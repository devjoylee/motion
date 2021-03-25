export class TextComponent {
  private element: HTMLElement;
  constructor(title: string, text: string) {
    const template = document.createElement('template');
    template.innerHTML = `
      <section class="text">
        <h3 class="text__title"></h3>
        <p class="text__body"></p>
      </section>
    `;

    this.element = template.content.firstElementChild! as HTMLElement;

    const titleElement = this.element.querySelector(
      '.text__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const textElement = this.element.querySelector(
      '.text__body'
    )! as HTMLParagraphElement;
    textElement.textContent = text;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }
}
