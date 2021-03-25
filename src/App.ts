import { ImageComponent } from './components/list/item/image.js';
import { TextComponent } from './components/list/item/text.js';
import { ListComponent } from './components/list/list.js';

class App {
  private readonly page: ListComponent;
  constructor(appRoot: HTMLElement) {
    this.page = new ListComponent();
    this.page.attachTo(appRoot);

    const image = new ImageComponent(
      'Image',
      'https://i.ytimg.com/vi/XplrxSSrja0/maxresdefault.jpg'
    );
    image.attachTo(appRoot);
    console.log(image);

    const text = new TextComponent('Text Title', 'hello');
    text.attachTo(appRoot);
    console.log(text);
  }
}

new App(document.querySelector('.document')! as HTMLElement);
