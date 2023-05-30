import { DronesTemplatePage } from './app.po';

describe('Drones App', function() {
  let page: DronesTemplatePage;

  beforeEach(() => {
    page = new DronesTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
