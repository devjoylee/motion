import { Composable, List, ListItem } from './components/list/list.js';
import { ImageComponent } from './components/list/item/image.js';
import { NoteComponent } from './components/list/item/note.js';
import { VideoComponent } from './components/list/item/video.js';
import { Dialog } from './components/dialog/dialog.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { Component } from './components/component.js';

// MediaSectionInput 혹은 TextSectionInput 을 만드는 타입
type InputComponentConstructor<T = MediaSectionInput | TextSectionInput> = {
  new (): T;
};

class App {
  // list => Component 이면서 Composable(addChild)이 가능한 요소
  private readonly list: Component & Composable;
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.list = new List(ListItem); // List 클래스 생성 시, ListItem을 추가할 것을 전달
    this.list.attachTo(appRoot);

    // 데모 코드
    this.list.addChild(
      new ImageComponent('랜덤이미지', 'https://picsum.photos/800/400')
    );

    this.list.addChild(
      new VideoComponent(
        '추천 플레이리스트',
        'https://www.youtube.com/watch?v=NRI1rgeRNe0'
      )
    );

    this.list.addChild(
      new NoteComponent(
        'Motion 노트 앱입니다',
        '위 버튼을 눌러 더 많은 노트를 추가한 후 드래그하여 원하는 위치로 배치해보세요 😊'
      )
    );

    // Create Note Section
    this.bindElementToDialog<TextSectionInput>(
      '#new-note',
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    // Create Image Section
    this.bindElementToDialog<MediaSectionInput>(
      '#new-img',
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );

    // Create Video Section
    this.bindElementToDialog<MediaSectionInput>(
      '#new-video',
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );
  }

  // 반복적으로 쓰이는 코드는 함수로 작성해두고 재사용 한다
  private bindElementToDialog<T extends MediaSectionInput | TextSectionInput>(
    // 1. 추가할 섹션 버튼의 id
    selector: string,
    // 2. 어떤 컴포넌트를 만들지 (input 컴포넌트 타입)
    InputComponent: InputComponentConstructor<T>,
    // 3. 전달 받은 input으로 필요한 컴포넌트 생성
    makeSection: (input: T) => Component
  ) {
    const addButton = document.querySelector(selector)! as HTMLButtonElement; // 1
    addButton.addEventListener('click', () => {
      const dialog = new Dialog();
      const input = new InputComponent(); // 2
      dialog.addChild(input); // dialog에 input 섹션 추가
      dialog.attachTo(this.dialogRoot); // 완성된 dialog를 body에 추가

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });

      dialog.setOnSubmitListener(() => {
        // 👉 submit 버튼 클릭 : getter 호출
        // 👉 사용자가 textSection에 입력한 정보를 getter로 가져와서, NoteComponent로 전달한다
        const item = makeSection(input); // 3
        this.list.addChild(item);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
