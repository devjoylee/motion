import { ListComponent } from './components/list/list.js';

class App {
  private readonly page: ListComponent;
  constructor(appRoot: HTMLElement) {
    this.page = new ListComponent();
    this.page.attachTo(appRoot);
  }
}

new App(document.querySelector('.document')! as HTMLElement);
