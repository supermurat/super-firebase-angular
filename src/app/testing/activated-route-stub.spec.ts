// export for convenience.
export { ActivatedRoute } from '@angular/router';

import { ComponentFixture, tick } from '@angular/core/testing';
import { convertToParamMap, NavigationEnd, ParamMap, Params, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/internal/operators';

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

    /**
     * init Navigation in order to handle redirections
     * @param fixture: ComponentFixture<any>
     * @param routeForPageNoParam: in oder to use 'pageNo' parameter, url need to contains this
     * @param routeForIdParam: in oder to use 'id' parameter, url need to contains this
     */
    initNavigation(fixture: ComponentFixture<any>, routeForPageNoParam: string, routeForIdParam: string): Subscription {
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        let lastUrl = '';

        return router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (lastUrl !== router.url) {
                    lastUrl = router.url;
                    if (router.url.startsWith(`/${routeForPageNoParam}/`)) {
                        this.setParamMap({pageNo: router.url.replace(`/${routeForPageNoParam}/`, '')});
                    } else if (router.url.startsWith(`/${routeForIdParam}/`)) {
                        this.setParamMap({id: router.url.replace(`/${routeForIdParam}/`, '')});
                    }
                    fixture.detectChanges();
                    tick();
                }
            });
    }

}
