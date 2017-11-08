/**
 * Model of Unite Theme Configuration (unite-theme.json) file.
 */
export class UniteThemeConfiguration {
    public title: string;
    public shortName: string;
    public namespace: string;
    public organization: string;
    public copyright: string;
    public webSite: string;
    public metaAuthor: string;
    public metaAuthorEmail: string;
    public metaAuthorWebSite: string;
    public metaDescription: string;
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
