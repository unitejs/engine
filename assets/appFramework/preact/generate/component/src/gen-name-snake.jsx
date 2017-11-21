/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascal
 */
import {Component, h} from "preact";
import "./gen-name-snake.css";

export class GenNamePascal extends Component {
    /**
     * Render the component.
     * @returns {JSX.Element}
     */
    render () {
        return (<span className="gen-name-snake">Hello Gen Name Human</span>);
    }
}
