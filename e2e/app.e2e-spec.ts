import { AppPage } from './app.po';

describe('super-firebase-angular App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display footer', async () => {
        page.navigateTo()
            .catch(reason => {
                console.error(reason);
            });

        return expect(page.getFooterCopyrightText())
            .toContain('Copyright');
    });
});
