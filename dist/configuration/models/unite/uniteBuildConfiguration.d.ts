/**
 * Model of Unite Configuration (unite.json) file.
 */
export declare class UniteBuildConfiguration {
    bundle: boolean;
    minify: boolean;
    sourcemaps: boolean;
    variables: {
        [id: string]: any;
    };
}
