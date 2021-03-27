import { List } from './components/list/list.js';
import { ImageComponent } from './components/list/item/image.js';
import { NoteComponent } from './components/list/item/note.js';
import { Dialog } from './components/dialog/dialog.js';

class App {
  private readonly list: List;
  constructor(appRoot: HTMLElement) {
    this.list = new List();
    this.list.attachTo(appRoot);

    const image = new ImageComponent(
      'Image',
      'https://i.ytimg.com/vi/XplrxSSrja0/maxresdefault.jpg'
    );
    this.list.addChild(image);

    const note = new NoteComponent('Note Title', 'hello');
    this.list.addChild(note);

    const noteBtn = document.querySelector('#new-note')! as HTMLButtonElement;
    noteBtn.addEventListener('click', () => {
      const dialog = new Dialog();
      dialog.attachTo(document.body);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(document.body);
      });

      dialog.setOnSubmitListener(() => {
        // 섹션을 만들어 페이지에 추가한다.
        dialog.removeFrom(document.body);
      });
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement);
