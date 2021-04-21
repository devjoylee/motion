export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void; // 요소를 부모에 추가
  removeFrom(parent: HTMLElement): void; // 부모로부터 요소를 제거
  attach(component: Component, position?: InsertPosition): void; // 형제 요소 앞에 붙이기
}

/**
 * Encapsulate the HTML element creation
 */

export class BaseComponent<T extends HTMLElement> implements Component {
  protected readonly element: T; // only child element can read
  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as T;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }

  removeFrom(parent: HTMLElement) {
    parent.removeChild(this.element);
  }

  attach(component: Component, position?: InsertPosition) {
    component.attachTo(this.element, position);
  }
}
