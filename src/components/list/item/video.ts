import { BaseComponent } from '../../component.js';

export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`
      <div class="media video">
        <div class="media__holder">
          <iframe class="iframe"></iframe>
        </div>
        <h3 class="media__title"></h3>
      </div>
    `);

    const titleElement = this.element.querySelector(
      '.video .media__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;

    const iframe = this.element.querySelector('.iframe')! as HTMLIFrameElement;
    iframe.src = this.convertToEmbeddedURL(url);
  }

  // youtube 주소에서 id 를 추출해서 embed 주소로 변환
  private convertToEmbeddedURL(url: string): string {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-]{11}))|(?:youtu.be\/([a-zA-Z0-9-]{11})))/;

    const match = url.match(regExp);

    const videoId = match ? match[1] || match[2] : undefined;

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }
}
