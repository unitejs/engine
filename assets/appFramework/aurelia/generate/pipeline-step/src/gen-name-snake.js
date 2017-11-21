/**
 * Gen Name Human pipeline step class.
 *
 * @export
 * @class GenNamePascalPipelineStep
 */
export class GenNamePascalPipelineStep {
    /**
     * Run the pipeline step.
     * @param {NavigationInstruction} navigationInstruction
     * @param {Next} next
     * @returns {Promise<void>}
     */
    run(navigationInstruction, next) {
        return next();
    }
}
