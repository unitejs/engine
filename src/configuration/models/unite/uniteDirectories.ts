/**
 * Model of Unite Configuration directories element.
 */
import { UniteWwwDirectories } from "./uniteWwwDirectories";

export class UniteDirectories {
    public wwwRoot: string;
    public packagedRoot: string;

    public www: UniteWwwDirectories;
}
