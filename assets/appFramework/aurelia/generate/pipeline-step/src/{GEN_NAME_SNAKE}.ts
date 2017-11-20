/**
 * {GEN_NAME_HUMAN} pipeline step class.
 *
 * @export
 * @class {GEN_NAME_PASCAL}
 */
import { NavigationInstruction, Next } from "aurelia-router";

export class {GEN_NAME_PASCAL}PipelineStep {
    /**
     * Run the pipeline step.
     * @param {NavigationInstruction} navigationInstruction
     * @param {Next} next
     * @returns {Promise<void>}
     */
    public run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        return next();
    }
}
