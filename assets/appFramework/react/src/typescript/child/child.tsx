/**
 * Child class.
 *
 * @export
 * @class Child
 */
import React from "react";
import "./child.css";

export class Child extends React.Component<any, { message: string }> {
    /**
     * Creates an instance of Child.
     */
    constructor(props?: any, context?: any) {
        super(props, context);
        this.state = { message: "Hello UniteJS World!"};
    }

    /**
     * Render the component.
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <span className="child">{this.state.message}</span>;
    }
}

// Generated by UniteJS
