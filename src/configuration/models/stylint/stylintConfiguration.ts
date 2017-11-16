/**
 * Model of Stylint Configuration (.stylintrc) file.
 */
import { StylintConfigurationRule } from "./stylintConfigurationRule";

export class StylintConfiguration {
    public exclude?: string[];
    public maxErrors?: StylintConfigurationRule<number>;
    public maxWarnings?: StylintConfigurationRule<number>;

    public customProperties?: string[];
    public mixins?: string[];
    public reporterOptions?: {
        columns?: ("lineData" | "severity" | "description" | "rule")[];
        columnSplitter?: string;
        showHeaders?: boolean;
        truncate?: boolean;
    };

    public blocks?: StylintConfigurationRule<"always" | "never">;
    public brackets?: StylintConfigurationRule<"always" | "never">;
    public colons?: StylintConfigurationRule<"always" | "never">;
    public colors?: StylintConfigurationRule<"always">;
    public commaSpace?: StylintConfigurationRule<"always" | "never">;
    public commentSpace?: StylintConfigurationRule<"always" | "never">;
    public cssLiteral?: StylintConfigurationRule<"never">;
    public depthLimit?: StylintConfigurationRule<number>;
    public duplicates?: StylintConfigurationRule<boolean>;
    public efficient?: StylintConfigurationRule<"always" | "never">;
    public extendPref?: StylintConfigurationRule<"@extend" | "@extends">;
    public globalDupe?: StylintConfigurationRule<boolean>;
    public groupOutputByFile?: StylintConfigurationRule<boolean>;
    public indentPref?: StylintConfigurationRule<boolean>;
    public leadingZero?: StylintConfigurationRule<"always" | "never">;
    public mixed?: StylintConfigurationRule<boolean>;
    public namingConvention?: StylintConfigurationRule<"lowercase-dash" | "lowercase_underscore" | "camelCase" | "BEM">;
    public namingConventionStrict?: StylintConfigurationRule<boolean>;
    public none?: StylintConfigurationRule<"always" | "never">;
    public noImportant?: StylintConfigurationRule<boolean>;
    public parenSpace?: StylintConfigurationRule<"always" | "never">;
    public placeholders?: StylintConfigurationRule<"always" | "never">;
    public prefixVarsWithDollar?: StylintConfigurationRule<"always" | "never">;
    public quotePref?: StylintConfigurationRule<"single" | "double">;
    public semicolons?: StylintConfigurationRule<"always" | "never">;
    public sortOrder?: StylintConfigurationRule<"alphabetical" | "grouped">;
    public stackedProperties?: StylintConfigurationRule<"never">;
    public trailingWhitespace?: StylintConfigurationRule<"never">;
    public universal?: StylintConfigurationRule<"never">;
    public valid?: StylintConfigurationRule<"never">;
    public zeroUnits?: StylintConfigurationRule<"always" | "never">;
    public zIndexNormalize?: StylintConfigurationRule<number>;
}
