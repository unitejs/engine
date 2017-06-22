/**
 * Model of Post Css Configuration (postcssrc.json) file.
 */
export class PostCssConfiguration {
    public parser: string;
    public map: boolean;
    public from: string;
    public to: string;
    public plugins: { [id: string]: any };
}