/**
 * {GEN_NAME_HUMAN} component class.
 */
import { Component, OnInit } from "@angular/core";

@Component({
    moduleId: __moduleName || module.id,
    templateUrl: "./{GEN_NAME_SNAKE}.component.html",
    styleUrls: ["./{GEN_NAME_SNAKE}.component.css"]
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
