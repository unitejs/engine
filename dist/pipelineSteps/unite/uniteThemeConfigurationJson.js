"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pipeline step to generate unite-theme.json.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const uniteThemeConfiguration_1 = require("../../configuration/models/uniteTheme/uniteThemeConfiguration");
const engineVariablesMeta_1 = require("../../engine/engineVariablesMeta");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class UniteThemeConfigurationJson extends pipelineStepBase_1.PipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileReadJson").call(this, logger, fileSystem, fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/"), UniteThemeConfigurationJson.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                this._configuration = obj;
                this.configDefaults(uniteConfiguration, engineVariables);
                return 0;
            }));
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = engineVariables.meta || new engineVariablesMeta_1.EngineVariablesMeta();
            this._configuration.title = meta.title || this._configuration.title || uniteConfiguration.packageName || "";
            this._configuration.shortName = meta.shortName || this._configuration.shortName || this._configuration.title;
            this._configuration.metaDescription = meta.description || this._configuration.metaDescription || this._configuration.title;
            this._configuration.metaKeywords = meta.keywords || this._configuration.metaKeywords || this._configuration.title.split(" ");
            this._configuration.metaAuthor = meta.author || this._configuration.metaAuthor;
            this._configuration.metaAuthorEmail = meta.authorEmail || this._configuration.metaAuthorEmail;
            this._configuration.metaAuthorWebSite = meta.authorWebSite || this._configuration.metaAuthorWebSite;
            this._configuration.namespace = meta.namespace || this._configuration.namespace;
            this._configuration.organization = meta.organization || this._configuration.organization;
            this._configuration.copyright = meta.copyright || this._configuration.copyright;
            this._configuration.webSite = meta.webSite || this._configuration.webSite;
            meta.title = this._configuration.title;
            meta.shortName = this._configuration.shortName;
            meta.description = this._configuration.metaDescription;
            meta.keywords = this._configuration.metaKeywords;
            meta.author = this._configuration.metaAuthor;
            meta.authorEmail = this._configuration.metaAuthorEmail;
            meta.authorWebSite = this._configuration.metaAuthorWebSite;
            meta.namespace = this._configuration.namespace;
            meta.organization = this._configuration.organization;
            meta.copyright = this._configuration.copyright;
            meta.webSite = this._configuration.webSite;
            engineVariables.meta = meta;
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleJson").call(this, logger, fileSystem, fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/"), UniteThemeConfigurationJson.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
        });
    }
    configDefaults(uniteConfiguration, engineVariables) {
        const defaultConfiguration = new uniteThemeConfiguration_1.UniteThemeConfiguration();
        defaultConfiguration.themeHeaders = [];
        defaultConfiguration.customHeaders = [];
        defaultConfiguration.backgroundColor = "#339933";
        defaultConfiguration.themeColor = "#339933";
        defaultConfiguration.appLoaderStyle = [
            "<style>",
            "#app-loader",
            "{",
            "width:200px;",
            "height:200px;",
            "position:absolute;",
            "top:0;",
            "bottom:0;",
            "left:0;",
            "right:0;",
            "margin:auto;",
            "}",
            "</style>"
        ];
        defaultConfiguration.appLoader = [
            `<svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">`,
            `<circle cx="50" cy="50" fill="none" stroke="{THEME_COLOR}" stroke-width="2" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(330 50 50)">`,
            `<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite">`,
            `</animateTransform>`,
            `</circle>`,
            `</svg>`
        ];
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("UniteTheme", this._configuration);
    }
}
UniteThemeConfigurationJson.FILENAME = "unite-theme.json";
exports.UniteThemeConfigurationJson = UniteThemeConfigurationJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRlL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw4RUFBMkU7QUFJM0UsMkdBQXdHO0FBRXhHLDBFQUF1RTtBQUN2RSxvRUFBaUU7QUFFakUsaUNBQXlDLFNBQVEsbUNBQWdCO0lBS2hELFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDOUosTUFBTSxDQUFDLHNCQUFrQixZQUEwQixNQUFNLEVBQ04sVUFBVSxFQUNWLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLEVBQ3JFLDJCQUEyQixDQUFDLFFBQVEsRUFDcEMsZUFBZSxDQUFDLEtBQUssRUFDckIsQ0FBTyxHQUFHLEVBQUUsRUFBRTtnQkFDN0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7Z0JBRTFCLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRXpELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDLENBQUEsRUFBRTtRQUNQLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixNQUFNLElBQUksR0FBd0IsZUFBZSxDQUFDLElBQUksSUFBSSxJQUFJLHlDQUFtQixFQUFFLENBQUM7WUFFcEYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSSxrQkFBa0IsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1lBQzVHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxHQUFHLElBQUksQ0FB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bkpzb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgdW5pdGUtdGhlbWUuanNvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVUaGVtZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlc01ldGEgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc01ldGFcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbiBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInVuaXRlLXRoZW1lLmpzb25cIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkSnNvbjxVbml0ZVRoZW1lQ29uZmlndXJhdGlvbj4obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU3JjRm9sZGVyLCBcInRoZW1lL1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBvYmo7XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHModW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBtZXRhOiBFbmdpbmVWYXJpYWJsZXNNZXRhID0gZW5naW5lVmFyaWFibGVzLm1ldGEgfHwgbmV3IEVuZ2luZVZhcmlhYmxlc01ldGEoKTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLnRpdGxlID0gbWV0YS50aXRsZSB8fCB0aGlzLl9jb25maWd1cmF0aW9uLnRpdGxlIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTmFtZSB8fCBcIlwiO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLnNob3J0TmFtZSA9IG1ldGEuc2hvcnROYW1lIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24uc2hvcnROYW1lIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24udGl0bGU7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24ubWV0YURlc2NyaXB0aW9uID0gbWV0YS5kZXNjcmlwdGlvbiB8fCB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFEZXNjcmlwdGlvbiB8fCB0aGlzLl9jb25maWd1cmF0aW9uLnRpdGxlO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFLZXl3b3JkcyA9IG1ldGEua2V5d29yZHMgfHwgdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhS2V5d29yZHMgfHwgdGhpcy5fY29uZmlndXJhdGlvbi50aXRsZS5zcGxpdChcIiBcIik7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24ubWV0YUF1dGhvciA9IG1ldGEuYXV0aG9yIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24ubWV0YUF1dGhvcjtcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhQXV0aG9yRW1haWwgPSBtZXRhLmF1dGhvckVtYWlsIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24ubWV0YUF1dGhvckVtYWlsO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFBdXRob3JXZWJTaXRlID0gbWV0YS5hdXRob3JXZWJTaXRlIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24ubWV0YUF1dGhvcldlYlNpdGU7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24ubmFtZXNwYWNlID0gbWV0YS5uYW1lc3BhY2UgfHwgdGhpcy5fY29uZmlndXJhdGlvbi5uYW1lc3BhY2U7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24ub3JnYW5pemF0aW9uID0gbWV0YS5vcmdhbml6YXRpb24gfHwgdGhpcy5fY29uZmlndXJhdGlvbi5vcmdhbml6YXRpb247XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24uY29weXJpZ2h0ID0gbWV0YS5jb3B5cmlnaHQgfHwgdGhpcy5fY29uZmlndXJhdGlvbi5jb3B5cmlnaHQ7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24ud2ViU2l0ZSA9IG1ldGEud2ViU2l0ZSB8fCB0aGlzLl9jb25maWd1cmF0aW9uLndlYlNpdGU7XG5cbiAgICAgICAgbWV0YS50aXRsZSA9IHRoaXMuX2NvbmZpZ3VyYXRpb24udGl0bGU7XG4gICAgICAgIG1ldGEuc2hvcnROYW1lID0gdGhpcy5fY29uZmlndXJhdGlvbi5zaG9ydE5hbWU7XG4gICAgICAgIG1ldGEuZGVzY3JpcHRpb24gPSB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFEZXNjcmlwdGlvbjtcbiAgICAgICAgbWV0YS5rZXl3b3JkcyA9ICB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFLZXl3b3JkcztcbiAgICAgICAgbWV0YS5hdXRob3IgPSB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFBdXRob3I7XG4gICAgICAgIG1ldGEuYXV0aG9yRW1haWwgPSB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFBdXRob3JFbWFpbDtcbiAgICAgICAgbWV0YS5hdXRob3JXZWJTaXRlID0gdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhQXV0aG9yV2ViU2l0ZTtcbiAgICAgICAgbWV0YS5uYW1lc3BhY2UgPSB0aGlzLl9jb25maWd1cmF0aW9uLm5hbWVzcGFjZTtcbiAgICAgICAgbWV0YS5vcmdhbml6YXRpb24gPSB0aGlzLl9jb25maWd1cmF0aW9uLm9yZ2FuaXphdGlvbjtcbiAgICAgICAgbWV0YS5jb3B5cmlnaHQgPSB0aGlzLl9jb25maWd1cmF0aW9uLmNvcHlyaWdodDtcbiAgICAgICAgbWV0YS53ZWJTaXRlID0gdGhpcy5fY29uZmlndXJhdGlvbi53ZWJTaXRlO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy5tZXRhID0gbWV0YTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVUb2dnbGVKc29uKGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU3JjRm9sZGVyLCBcInRoZW1lL1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db25kaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYygpID0+IHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZmlnRGVmYXVsdHModW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWd1cmF0aW9uID0gbmV3IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24udGhlbWVIZWFkZXJzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmN1c3RvbUhlYWRlcnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFja2dyb3VuZENvbG9yID0gXCIjMzM5OTMzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnRoZW1lQ29sb3IgPSBcIiMzMzk5MzNcIjtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYXBwTG9hZGVyU3R5bGUgPSBbXG4gICAgICAgICAgICBcIjxzdHlsZT5cIixcbiAgICAgICAgICAgIFwiI2FwcC1sb2FkZXJcIixcbiAgICAgICAgICAgIFwie1wiLFxuICAgICAgICAgICAgXCJ3aWR0aDoyMDBweDtcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0OjIwMHB4O1wiLFxuICAgICAgICAgICAgXCJwb3NpdGlvbjphYnNvbHV0ZTtcIixcbiAgICAgICAgICAgIFwidG9wOjA7XCIsXG4gICAgICAgICAgICBcImJvdHRvbTowO1wiLFxuICAgICAgICAgICAgXCJsZWZ0OjA7XCIsXG4gICAgICAgICAgICBcInJpZ2h0OjA7XCIsXG4gICAgICAgICAgICBcIm1hcmdpbjphdXRvO1wiLFxuICAgICAgICAgICAgXCJ9XCIsXG4gICAgICAgICAgICBcIjwvc3R5bGU+XCJcbiAgICAgICAgXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24uYXBwTG9hZGVyID0gW1xuICAgICAgICAgICAgYDxzdmcgd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZFwiPmAsXG4gICAgICAgICAgICBgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwie1RIRU1FX0NPTE9SfVwiIHN0cm9rZS13aWR0aD1cIjJcIiByPVwiMzVcIiBzdHJva2UtZGFzaGFycmF5PVwiMTY0LjkzMzYxNDMxMzQ2NDE1IDU2Ljk3Nzg3MTQzNzgyMTM4XCIgdHJhbnNmb3JtPVwicm90YXRlKDMzMCA1MCA1MClcIj5gLFxuICAgICAgICAgICAgYDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9XCJ0cmFuc2Zvcm1cIiB0eXBlPVwicm90YXRlXCIgY2FsY01vZGU9XCJsaW5lYXJcIiB2YWx1ZXM9XCIwIDUwIDUwOzM2MCA1MCA1MFwiIGtleVRpbWVzPVwiMDsxXCIgZHVyPVwiMXNcIiBiZWdpbj1cIjBzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCI+YCxcbiAgICAgICAgICAgIGA8L2FuaW1hdGVUcmFuc2Zvcm0+YCxcbiAgICAgICAgICAgIGA8L2NpcmNsZT5gLFxuICAgICAgICAgICAgYDwvc3ZnPmBcbiAgICAgICAgXTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRDb25maWd1cmF0aW9uLCB0aGlzLl9jb25maWd1cmF0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIlVuaXRlVGhlbWVcIiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG4gICAgfVxufVxuIl19
