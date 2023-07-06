import { MMUUIPage } from './app.po';

describe('mmu-ui App', () => {
  let page: MMUUIPage;

  beforeEach(() => {
    page = new MMUUIPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
