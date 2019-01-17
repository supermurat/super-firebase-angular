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
}
