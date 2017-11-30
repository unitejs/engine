/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascal
 */
import /* Synthetic Import */ React from "react";
import "./gen-name-snake.css";

export class GenNamePascal extends React.Component<any, { message: string }> {
    /**
     * Creates an instance of GenNamePascal.
     */
    constructor(props?: any, context?: any) {
        super(props, context);
        this.state = { message: "Hello Gen Name Human" };
    }

    /**
     * Render the component.
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <span className="gen-name-snake">{this.state.message}</span>;
    }
}
