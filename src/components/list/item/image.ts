import { BaseComponent } from '../../component.js';

export class ImageComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`
      <div class="image">
        <h3 class="image__title"></h3>
        <div class="image__holder">
          <img class="image__thumbnail">
        </div>
      </div>
    `);

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
}
