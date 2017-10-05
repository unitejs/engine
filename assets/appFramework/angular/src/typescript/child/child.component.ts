/**
 * Child component class.
 */
import { Component } from "@angular/core";

@Component({
    moduleId: {MODULE_ID},
    templateUrl: "./child.component.html",
    styleUrls: ["./child.component.css"]
})
export class ChildComponent {
  public message: string;

  constructor() {
    this.message = "Hello UniteJS World!";
  }
}

// Generated by UniteJS
