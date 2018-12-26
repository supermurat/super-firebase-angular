// export for convenience.
export { ActivatedRoute } from '@angular/router';

import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
    /**
     * Use a ReplaySubject to share previous values with subscribers
     * and pump new values into the `paramMap` observable
     */
    private readonly subject = new ReplaySubject<ParamMap>();

    /** The mock paramMap observable */
    // tslint:disable:member-ordering
    readonly paramMap = this.subject.asObservable();

    /**
     * constructor of ActivatedRouteStub
     * @param initialParams: Params
     */
    constructor(initialParams?: Params) {
        this.setParamMap(initialParams);
    }

    /** Set the paramMap observables's next value */
    setParamMap(params?: Params): void {
        this.subject.next(convertToParamMap(params));
    }
}
