export class ImageComponent {
  private element: HTMLElement;
  constructor(title: string, url: string) {
    const template = document.createElement('template');
    template.innerHTML = `
      <section class="image">
        <h3 class="image__title"></h3>
        <div class="image__holder">
          <img class="image__thumbnail">
        </div>
      </section>
    `;

    this.element = template.content.firstElementChild! as HTMLElement;

    const titleElement = this.element.querySelector(
      '.image__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const imageElement = this.element.querySelector(
      '.image__thumbnail'
    )! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }
}
