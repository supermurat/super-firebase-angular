import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { ConfigModel } from '../models';

/**
 * Config Service
 */
@Injectable()
export class ConfigService {
    /** collection of config */
    private readonly subject = new Subject<ConfigModel>();

    /** last config to keep live and use it many many times */
    private lastConfig: ConfigModel;

    /**
     * init config
     * @param configModel: ConfigModel
     */
    init(configModel: ConfigModel): void {
        this.subject.next(configModel);
    }

    /**
     * get current config
     */
    getConfig(): Observable<ConfigModel> {
        return this.subject.asObservable()
            .pipe(tap(config => {
                    this.lastConfig = config;
                }),
                startWith(this.lastConfig ? this.lastConfig : {
                    mainMenuItems: [],
                    primaryCustomHtmlWidget: undefined,
                    configSEO: {}
                })
            );
    }
}
