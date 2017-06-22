/**
 * Model of Post Css Configuration (postcssrc.json) file.
 */
export declare class PostCssConfiguration {
    parser: string;
    map: boolean;
    from: string;
    to: string;
    plugins: {
        [id: string]: any;
    };
}
