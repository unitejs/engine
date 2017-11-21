/**
 * Gen Name Human guard class.
 *
 * @export
 * @class GenNamePascalGuard
 */
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Injectable()
export class GenNamePascalGuard implements CanActivate {
    /**
     * Can the guard be activated
     * @param {ActivatedRouteSnapshot} next
     * @param {RouterStateSnapshot} state
     * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
     */
    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }
}
