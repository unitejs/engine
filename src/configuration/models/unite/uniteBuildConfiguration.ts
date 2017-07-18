/**
 * Model of Unite Configuration (unite.json) file.
 */
export class UniteBuildConfiguration {
    public bundle: boolean;
    public minify: boolean;
    public sourcemaps: boolean;
    public variables: { [id: string]: any};
}