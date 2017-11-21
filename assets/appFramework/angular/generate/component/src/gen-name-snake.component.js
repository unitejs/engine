/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascalComponent
 */
import {Component} from "@angular/core";

@Component({
    moduleId: "genModuleId",
    templateUrl: "./gen-name-snake.component.html",
    styleUrls: ["./gen-name-snake.component.css"]
})
export class GenNamePascalComponent {
    /**
     * Message displayed in the view.
     * @type {string}
     */
    message;

    /**
     * Creates an instance of GenNamePascalComponent.
     */
    constructor() {
        this.message = "Hello Gen Name Human";
    }

    /**
     * The component was initialized.
     * @returns {void}
     */
    ngOnInit() {
        this.message += " - onInit called";
    }
}
