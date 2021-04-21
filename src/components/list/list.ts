import { BaseComponent, Component } from '../component.js';

// 다양한 요소들을 조립할 수 있는 interface
export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;
type DragState = 'start' | 'end' | 'enter' | 'leave'; // 드래그 시 발생하는 이벤트
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

// SectionContainer 는 무조건 Component와 Composable를 구현하고 setOnCloseListener API를 가진다
interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBountdingRect(): DOMRect;
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
  private dragStateListener?: OnDragStateListener<ListItem>;

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
    this.element.addEventListener('dragenter', (event: DragEvent) => {
      this.onDragEnter(event);
    });
    this.element.addEventListener('dragleave', (event: DragEvent) => {
      this.onDragLeave(event);
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

  // 드래그 이벤트 발생할 때마다 리스너 호출
  setOnDragStateListener(listener: OnDragStateListener<ListItem>) {
    this.dragStateListener = listener;
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObservers('start');
  }

  onDragEnd(_: DragEvent) {
    this.notifyDragObservers('end');
  }

  onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
  }

  onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
  }

  // 드래그 되는 요소가 무엇인지, 어떤 상태로 드래그 되는지 알려줌
  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }

  // 드래그 이벤트 발생 중에는 자식 요소의 pointer이벤트 없애기 (->에러 최소화)
  muteChildren(state: 'mute' | 'unmute') {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }

  getBountdingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class List extends BaseComponent<HTMLDivElement> implements Composable {
  private children = new Set<SectionContainer>(); // 중복된 자료구조 x
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;

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
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        // 드래그 상태가 변화되면 실행
        switch (state) {
          case 'start':
            this.dragTarget = target;
            this.updateSections('mute');
            break;
          case 'end':
            this.dragTarget = undefined;
            this.updateSections('unmute');
            break;
          case 'enter':
            console.log('enter', target);
            this.dropTarget = target;
            break;
          case 'leave':
            console.log('leave', target);
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
      }
    );
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log('onDragOver');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log('onDrop');
    // 여기에서 위치를 변경
    if (!this.dropTarget) {
      // drop target이 없으면 리턴
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY; // 드롭되는 위치
      const srcElement = this.dragTarget.getBountdingRect(); // 드래그 시작 위치

      this.dragTarget.removeFrom(this.element); // 드래그 타겟 원래 위치에서 삭제
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? 'beforebegin' : 'afterend'
        // 위에서 아래로 드래그 시 (dropY < srcElement) 드롭타겟 뒤에 위치
        // 아래에서 위로 드래그 시 (dropY > srcElement) 드롭타겟 앞에 위치
      );
    }
  }

  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
