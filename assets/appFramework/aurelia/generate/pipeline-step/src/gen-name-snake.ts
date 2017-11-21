/**
 * Gen Name Human pipeline step class.
 *
 * @export
 * @class GenNamePascalPipelineStep
 */
import { NavigationInstruction, Next } from "aurelia-router";

export class GenNamePascalPipelineStep {
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
