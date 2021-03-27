import { Composable, List, ListItem } from './components/list/list.js';
import { ImageComponent } from './components/list/item/image.js';
import { NoteComponent } from './components/list/item/note.js';
import { Dialog } from './components/dialog/dialog.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { Component } from './components/component.js';

class App {
  // list => Component 이면서 Composable(addChild)이 가능한 요소
  private readonly list: Component & Composable;
  constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
    this.list = new List(ListItem); // List 클래스 생성 시, ListItem을 추가할 것을 전달
    this.list.attachTo(appRoot);

    const noteBtn = document.querySelector('#new-note')! as HTMLButtonElement;
    noteBtn.addEventListener('click', () => {
      const dialog = new Dialog();
      const textSection = new TextSectionInput();
      dialog.addChild(textSection); // dialog에 input 섹션 추가
      dialog.attachTo(dialogRoot); // 완성된 dialog를 body에 추가

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });

      dialog.setOnSubmitListener(() => {
        // 👉 submit 버튼 클릭 : getter 호출
        // 👉 사용자가 textSection에 입력한 정보를 getter로 가져와서, NoteComponent로 전달한다
        const note = new NoteComponent(textSection.title, textSection.body);
        this.list.addChild(note);
        dialog.removeFrom(dialogRoot);
      });
    });

    const imageBtn = document.querySelector('#new-img')! as HTMLButtonElement;
    imageBtn.addEventListener('click', () => {
      const dialog = new Dialog();
      const mediaSection = new MediaSectionInput();
      dialog.addChild(mediaSection);
      dialog.attachTo(dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });

      dialog.setOnSubmitListener(() => {
        const image = new ImageComponent(mediaSection.title, mediaSection.url);
        this.list.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
