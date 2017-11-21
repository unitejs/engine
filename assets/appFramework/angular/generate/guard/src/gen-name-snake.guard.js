/**
 * Gen Name Human guard class.
 *
 * @export
 * @class GenNamePascalGuard
 */
import {Injectable} from "@angular/core";

@Injectable()
export class GenNamePascalGuard {
    /**
     * Can the guard be activated
     * @param {ActivatedRouteSnapshot} next
     * @param {RouterStateSnapshot} state
     * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
     */
    canActivate(next, state) {
        return true;
    }
}
