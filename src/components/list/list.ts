import { BaseComponent, Component } from '../component.js';

// 다양한 요소들을 조립할 수 있는 interface
export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

// SectionContainer 는 무조건 Component와 Composable를 구현하고 setOnCloseListener API를 가진다
interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
}

// 생성자를 정의하는 타입
type SectionContainerConstructor = {
  // 생성자가 호출이 되면, SectionContainer를 규격을 따르는 클래스로 만든다
  new (): SectionContainer;
};

// ListItem : 전달받은 이미지나 텍스트 요소를 어떤 UI 형태로 만들지 정해놓은 것
export class ListItem
  extends BaseComponent<HTMLElement>
  implements SectionContainer {
  private closeListener?: OnCloseListener; // 외부에서 전달받은 콜백함수
  constructor() {
    super(`
      <section class="list-item" draggable="true">
        <div class="list-item__body"></div>
        <div class="list-item__controls">
          <button class="close">&times;</button>
        </div>
      </section>
    `);

    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener(); // 클릭 시 콜백함수 실행
    };

    this.element.addEventListener('dragstart', (event: DragEvent) => {
      this.onDragStart(event);
    });
    this.element.addEventListener('dragend', (event: DragEvent) => {
      this.onDragEnd(event);
    });
  }

  // 전달받은 item을 html에 추가
  addChild(child: Component) {
    const container = this.element.querySelector(
      '.list-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }

  // 전달받은 콜백함수를 멤버변수에 저장
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }

  onDragStart(event: DragEvent) {
    console.log('dragstart', event);
  }

  onDragEnd(event: DragEvent) {
    console.log('dragend', event);
  }
}

export class List extends BaseComponent<HTMLDivElement> implements Composable {
  // 데이터(SectionContainerConstructor)를 외부로 부터 받아서, new 클래스 생성
  constructor(private listItemConstructor: SectionContainerConstructor) {
    super(`<div class="list"></div>`);

    this.element.addEventListener('dragover', (event: DragEvent) => {
      this.onDragOver(event);
    });
    this.element.addEventListener('drop', (event: DragEvent) => {
      this.onDrop(event);
    });
  }

  addChild(section: Component) {
    // const item = new ListItem(); 내부에서 클래스를 직접 생성하는 것은 위험하다.
    // 👉 dependency injection을 통해 외부로 부터 주입받는 것이 더 확장가능하고 unit test에도 유리

    const item = new this.listItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      // close버튼 클릭 시 실행할 콜백함수 정의
      item.removeFrom(this.element);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log('onDragOver');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log('onDrop');
  }
}
