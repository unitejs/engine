/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascal
 */
import { Component, h } from "preact";
import "./gen-name-snake.css";

export class GenNamePascal extends Component<any, any> {
    /**
     * Render the component.
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<span className="gen-name-snake">Hello Gen Name Human</span>);
    }
}
