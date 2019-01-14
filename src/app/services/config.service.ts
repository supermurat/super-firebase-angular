import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfigModel } from '../models';

/**
 * Config Service
 */
@Injectable()
export class ConfigService {
    /** collection of config */
    private readonly subject = new Subject<ConfigModel>();

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
        return this.subject.asObservable();
    }
}
