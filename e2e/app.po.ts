import { browser, by, element, promise as wdpromise } from 'protractor';

/**
 * App Page for E2E Test
 */
export class AppPage {
    /**
     * go to home page
     */
    async navigateTo(): wdpromise.Promise<any> {
        return browser.get('/');
    }

    /**
     * get text of first h1 element in app-root
     */
    async getParagraphText(): wdpromise.Promise<string> {
        return element(by.css('app-root h1'))
            .getText();
    }
}
