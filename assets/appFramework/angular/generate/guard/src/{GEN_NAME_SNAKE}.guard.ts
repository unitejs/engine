/**
 * {GEN_NAME_HUMAN} guard class.
 */
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Injectable()
export class {GEN_NAME_PASCAL}Guard implements CanActivate {
    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }
}
