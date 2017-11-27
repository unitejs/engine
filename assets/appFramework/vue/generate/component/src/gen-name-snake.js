/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascal
 */
import Vue from "vue";
import Component from "vue-class-component";
import "./gen-name-snake.css";

@Component({
    "template": "./gen-name-snake.vue"
})
export class GenNamePascal extends Vue {
    /**
     * Message to be displayed in the view.
     * @type {string}
     */
    message;

    /**
     * Creates an instance of GenNamePascal.
     */
    constructor() {
        super();
        this.message = "Hello UniteJS World!";
    }
}
