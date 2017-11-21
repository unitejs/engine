/**
 * Child class.
 *
 * @export
 * @class Child
 */
import /* Synthetic Import */ Vue from "vue";
import Component from "vue-class-component";
import "./child.css";

@Component({
    template: "./child.vue"
})
export class Child extends Vue {
    /**
     * Message to be displayed in the view.
     * @type {string}
     */
    public message: string;

    /**
     * Creates an instance of Child.
     */
    constructor() {
        super();
        this.message = "Hello UniteJS World!";
    }
}

// Generated by UniteJS
