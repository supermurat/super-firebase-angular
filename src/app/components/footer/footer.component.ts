import { Component, OnInit } from '@angular/core';
import { BlockModel, ConfigModel } from '../../models';
import { ConfigService, PageService } from '../../services';

/**
 * Footer Component
 */
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

    /** footer blocks */
    footerBlocks: Array<BlockModel> = [];
    /**
     * constructor of FooterComponent
     * @param pageService: PageService
     * @param configService: ConfigService
     */
    constructor(public pageService: PageService,
                public configService: ConfigService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.configService.getConfig()
            .subscribe((config: ConfigModel) => {
                this.footerBlocks = config.footerBlocks;
            });
    }

}
