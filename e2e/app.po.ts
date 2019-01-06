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
     * get text of footer-copyright element
     */
    async getFooterCopyrightText(): wdpromise.Promise<string> {
        return element(by.id('footer-copyright'))
            .getText();
    }
}
