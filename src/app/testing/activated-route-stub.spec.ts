// export for convenience.
export { ActivatedRoute } from '@angular/router';

import { ComponentFixture, tick } from '@angular/core/testing';
import { convertToParamMap, NavigationEnd, NavigationExtras, ParamMap, Params, Router } from '@angular/router';
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
     * @param router: Router
     * @param routeForPageNoParam: in oder to use 'pageNo' parameter, url need to contains this
     * @param routeForIdParam: in oder to use 'id' parameter, url need to contains this
     */
    initNavigation(fixture: ComponentFixture<any>, router: Router, routeForPageNoParam: string, routeForIdParam: string): Subscription {
        router.initialNavigation();
        let lastUrl = '';

        return router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (lastUrl !== router.url && !router.url.endsWith('/http-404')) {
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

    /**
     * navigate to url
     * @param fixture: ComponentFixture<any>
     * @param router: Router
     * @param commands: Array<any>
     * @param extras: NavigationExtras
     */
    navigate(fixture: ComponentFixture<any>, router: Router, commands: Array<any>, extras?: NavigationExtras): void {
        router.initialNavigation();
        router.navigate(commands, extras)
            .catch(reason => {
                console.error(reason);
            });
    }

    /**
     * init Navigation and navigate to url
     * @param fixture: ComponentFixture<any>
     * @param router: Router
     * @param routeForPageNoParam: in oder to use 'pageNo' parameter, url need to contains this
     * @param routeForIdParam: in oder to use 'id' parameter, url need to contains this
     * @param commands: Array<any>
     * @param extras: NavigationExtras
     */
    initAndNavigate(fixture: ComponentFixture<any>, router: Router, routeForPageNoParam: string, routeForIdParam: string,
                    commands: Array<any>, extras?: NavigationExtras): void {
        const sNavEvent = this.initNavigation(fixture, router, routeForPageNoParam, routeForIdParam);
        router.navigate(commands, extras)
            .catch(reason => {
                console.error(reason);
            });
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        sNavEvent.unsubscribe();
    }

}
