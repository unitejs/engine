/**
 * Child class.
 */
import { Component, h } from "preact";
import "./child.css";

export class Child extends Component<any, any> {
    public render(): JSX.Element {
        return (<span className="child">Hello UniteJS World!</span>);
    }
}

// Generated by UniteJS