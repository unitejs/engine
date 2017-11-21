/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascalComponent
 */
import { Component, OnInit } from "@angular/core";

@Component({
    moduleId: "genModuleId",
    templateUrl: "./gen-name-snake.component.html",
    styleUrls: ["./gen-name-snake.component.css"]
})
export class GenNamePascalComponent implements OnInit {
    /**
     * Message displayed in the view.
     * @type {string}
     */
    public message: string;

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
    public ngOnInit(): void {
        this.message += " - onInit called";
    }
}
