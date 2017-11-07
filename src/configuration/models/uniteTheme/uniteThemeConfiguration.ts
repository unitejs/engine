/**
 * Model of Unite Theme Configuration (unite-theme.json) file.
 */
export class UniteThemeConfiguration {
    public shortName: string;
    public metaAuthor: string;
    public metaAuthorEmail: string;
    public metaAuthorWeb: string;
    public metaDescription: string;
    public metaNamespace: string;
    public metaKeywords: string[];
    public customHeaders: string[];
    public themeHeaders: string[];
    public backgroundColor: string;
    public themeColor: string;
    public appLoaderStyle: string[];
    public appLoader: string[];
    public cordova: {
        headers: string[];
        scriptInclude: string[];
        scriptStart: string[];
        scriptEnd: string[];
    };
}
