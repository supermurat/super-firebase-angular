import { BlockModel } from './block-model';
import { ConfigSeoModel } from './config-seo-model';
import { CustomHtmlModel } from './custom-html-model';
import { MenuItemModel } from './menu-item-model';

/**
 * Config Class
 */
export class ConfigModel {
    /** main menu items */
    mainMenuItems: Array<MenuItemModel>;
    /** primary custom html widget */
    primaryCustomHtmlWidget: CustomHtmlModel;
    /** config for SEO */
    configSEO: ConfigSeoModel;
    /** footer blocks */
    footerBlocks: Array<BlockModel>;
}
