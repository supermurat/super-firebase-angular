import { CustomHtmlModel } from './custom-html-model';
import { MenuItemModel } from './menu-item-model';
/**
 * Block Class
 */
export class BlockModel extends CustomHtmlModel {
    /** menu items */
    menuItems?: Array<MenuItemModel>;
}
