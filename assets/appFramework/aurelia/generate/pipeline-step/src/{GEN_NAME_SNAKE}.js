/**
 * {GEN_NAME_HUMAN} pipeline step class.
 *
 * @export
 * @class {GEN_NAME_PASCAL}
 */
export class {GEN_NAME_PASCAL}PipelineStep {
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
