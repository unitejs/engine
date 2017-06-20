# UniteJS Core
Core of the UniteJS JavaScript framework management tool.

See [UniteJS CLI](https://github.com/unitejs/cli#readme) for usage.





# Quirks
## Tests code using TypeScript and Chai
The RequireJS loader would normally use the following syntax to import Chai as the module has no default export so we just treat the whole module as the class
    import * as Chai from "chai";
TypeScript calls the class methods with Chai.should etc

The SystemJS loader would normally use the following syntax to import Chai as it creates a synthetic default export
    import Chai from "chai";
TypeScript calls the class methods with chai_1.default.should etc

If we switch on the allowSyntheticDefaultImports option for RequireJS usage the SystemJS syntax code will compile but the generated code will try to access the .default variable which does not exist.

To keep the test code the same for both module loaders the following import syntax is used.
    import * as ChaiModule from "chai";
    const Chai = (<any>ChaiModule).default || ChaiModule;

The ES6 code always uses the same syntax
    import Chai from "chai"

and Babel introduces the following code for RequireJS

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

So the question is where does the fix go? At the moment I am leaning towards TypeScript which needs to introduce a similar interop to Babel. As well as the allowSyntheticDefaultImports which is a compile options only I think that a generateSyntheticDefaultImports might also be needed.

See https://github.com/Microsoft/TypeScript/issues/16093
and https://github.com/Microsoft/TypeScript/issues/16090