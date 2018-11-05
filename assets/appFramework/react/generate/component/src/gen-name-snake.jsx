/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascal
 */
import React from "react";
import "./gen-name-snake.css";

export class GenNamePascal extends React.Component {
    /**
     * Creates an instance of GenNamePascal.
     */
    constructor(props, context) {
        super(props, context);
        this.state = {message: "Hello Gen Name Human"};
    }

    /**
     * Render the component.
     * @returns {JSX.Element}
     */
    render() {
        return <span className="gen-name-snake">{this.state.message}</span>;
    }
}
