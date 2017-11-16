/**
 * Model of Stylint Configuration (.stylintrc) file.
 */
import { StylintConfigurationRule } from "./stylintConfigurationRule";
export declare class StylintConfiguration {
    exclude?: string[];
    maxErrors?: StylintConfigurationRule<number>;
    maxWarnings?: StylintConfigurationRule<number>;
    customProperties?: string[];
    mixins?: string[];
    reporterOptions?: {
        columns?: ("lineData" | "severity" | "description" | "rule")[];
        columnSplitter?: string;
        showHeaders?: boolean;
        truncate?: boolean;
    };
    blocks?: StylintConfigurationRule<"always" | "never">;
    brackets?: StylintConfigurationRule<"always" | "never">;
    colons?: StylintConfigurationRule<"always" | "never">;
    colors?: StylintConfigurationRule<"always">;
    commaSpace?: StylintConfigurationRule<"always" | "never">;
    commentSpace?: StylintConfigurationRule<"always" | "never">;
    cssLiteral?: StylintConfigurationRule<"never">;
    depthLimit?: StylintConfigurationRule<number>;
    duplicates?: StylintConfigurationRule<boolean>;
    efficient?: StylintConfigurationRule<"always" | "never">;
    extendPref?: StylintConfigurationRule<"@extend" | "@extends">;
    globalDupe?: StylintConfigurationRule<boolean>;
    groupOutputByFile?: StylintConfigurationRule<boolean>;
    indentPref?: StylintConfigurationRule<boolean>;
    leadingZero?: StylintConfigurationRule<"always" | "never">;
    mixed?: StylintConfigurationRule<boolean>;
    namingConvention?: StylintConfigurationRule<"lowercase-dash" | "lowercase_underscore" | "camelCase" | "BEM">;
    namingConventionStrict?: StylintConfigurationRule<boolean>;
    none?: StylintConfigurationRule<"always" | "never">;
    noImportant?: StylintConfigurationRule<boolean>;
    parenSpace?: StylintConfigurationRule<"always" | "never">;
    placeholders?: StylintConfigurationRule<"always" | "never">;
    prefixVarsWithDollar?: StylintConfigurationRule<"always" | "never">;
    quotePref?: StylintConfigurationRule<"single" | "double">;
    semicolons?: StylintConfigurationRule<"always" | "never">;
    sortOrder?: StylintConfigurationRule<"alphabetical" | "grouped">;
    stackedProperties?: StylintConfigurationRule<"never">;
    trailingWhitespace?: StylintConfigurationRule<"never">;
    universal?: StylintConfigurationRule<"never">;
    valid?: StylintConfigurationRule<"never">;
    zeroUnits?: StylintConfigurationRule<"always" | "never">;
    zIndexNormalize?: StylintConfigurationRule<number>;
}
