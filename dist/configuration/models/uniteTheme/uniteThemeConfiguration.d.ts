/**
 * Model of Unite Theme Configuration (unite-theme.json) file.
 */
export declare class UniteThemeConfiguration {
    shortName: string;
    metaAuthor: string;
    metaAuthorEmail: string;
    metaAuthorWeb: string;
    metaDescription: string;
    metaKeywords: string[];
    customHeaders: string[];
    themeHeaders: string[];
    backgroundColor: string;
    themeColor: string;
    appLoaderStyle: string[];
    appLoader: string[];
    cordova: {
        headers: string[];
        scriptInclude: string[];
        scriptStart: string[];
        scriptEnd: string[];
    };
}
