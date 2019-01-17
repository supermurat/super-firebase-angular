import { Component, Input } from '@angular/core';
import { CustomHtmlModel } from '../../models';

/**
 * Custom Html Component
 */
@Component({
    selector: 'app-custom-html',
    templateUrl: './custom-html.component.html'
})
export class CustomHtmlComponent {
    /** widget title */
    @Input() readonly customHtml: CustomHtmlModel;
    /** css class of header */
    @Input() readonly headerCssClass = '';
}
