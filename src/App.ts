import { List } from './components/list/list.js';
import { ImageComponent } from './components/list/item/image.js';
import { NoteComponent } from './components/list/item/note.js';

class App {
  private readonly list: List;
  constructor(appRoot: HTMLElement) {
    this.list = new List();
    this.list.attachTo(appRoot);

    const image = new ImageComponent(
      'Image',
      'https://i.ytimg.com/vi/XplrxSSrja0/maxresdefault.jpg'
    );
    image.attachTo(appRoot);
    console.log(image);

    const note = new NoteComponent('Note Title', 'hello');
    note.attachTo(appRoot);
    console.log(note);
  }
}

new App(document.querySelector('.document')! as HTMLElement);
