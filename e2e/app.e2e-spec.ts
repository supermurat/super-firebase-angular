import { AppPage } from './app.po';

describe('super-firebase-angular App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Browser side rendering with Firebase 🔥 Build Test #1');
  });
});
