/**
 * {GEN_NAME_HUMAN} component class.
 */
import { Component, OnInit } from "@angular/core";

@Component({
    moduleId: {MODULE_ID},
    templateUrl: "./{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}.html",
    styleUrls: ["./{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}.css"]
})
export class {GEN_NAME_PASCAL}Component implements OnInit {
    public message: string;

    constructor() {
        this.message = "Hello {GEN_NAME_HUMAN}";
    }

    public ngOnInit(): void {
        this.message += " - onInit called";
    }
}
