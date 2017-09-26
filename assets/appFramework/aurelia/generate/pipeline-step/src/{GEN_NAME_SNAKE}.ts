/**
 * {GEN_NAME_HUMAN} Pipeline Step class.
 */
import { NavigationInstruction, Next } from "aurelia-router";

export class {GEN_NAME_PASCAL}PipelineStep {
    public run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        return next();
    }
}
