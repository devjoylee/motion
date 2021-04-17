import { BaseComponent } from '../../component.js';

export class ImageComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`
      <div class="media image">
        <div class="media__holder">
          <img class="img">
        </div>
        <h3 class="media__title"></h3>
      </div>
    `);

    const titleElement = this.element.querySelector(
      '.image   .media__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const imageElement = this.element.querySelector(
      '.img'
    )! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;
  }
}
