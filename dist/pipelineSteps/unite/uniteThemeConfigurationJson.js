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
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleJson").call(this, logger, fileSystem, fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/"), UniteThemeConfigurationJson.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
        });
    }
    configDefaults(uniteConfiguration, engineVariables) {
        const defaultConfiguration = new uniteThemeConfiguration_1.UniteThemeConfiguration();
        if (uniteConfiguration.title) {
            defaultConfiguration.metaDescription = uniteConfiguration.title;
            defaultConfiguration.metaKeywords = uniteConfiguration.title.split(" ");
            defaultConfiguration.shortName = uniteConfiguration.title;
        }
        defaultConfiguration.metaAuthor = "";
        defaultConfiguration.customHeaders = [];
        defaultConfiguration.themeHeaders = [];
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRlL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw4RUFBMkU7QUFJM0UsMkdBQXdHO0FBRXhHLG9FQUFpRTtBQUVqRSxpQ0FBeUMsU0FBUSxtQ0FBZ0I7SUFLaEQsVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM5SixNQUFNLENBQUMsc0JBQWtCLFlBQTBCLE1BQU0sRUFDTixVQUFVLEVBQ1YsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsRUFDckUsMkJBQTJCLENBQUMsUUFBUSxFQUNwQyxlQUFlLENBQUMsS0FBSyxFQUNyQixDQUFPLEdBQUcsRUFBRSxFQUFFO2dCQUM3RCxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztnQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFekQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQSxFQUFFO1FBQ1AsQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM1SixNQUFNLENBQUMsd0JBQW9CLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxFQUNyRSwyQkFBMkIsQ0FBQyxRQUFRLEVBQ3BDLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLGFBQWEsRUFDYixHQUFRLEVBQUUsZ0RBQUMsTUFBTSxDQUFOLElBQUksQ0FBQyxjQUFjLENBQUEsR0FBQSxFQUFFO1FBQ2hFLENBQUM7S0FBQTtJQUVPLGNBQWMsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUMzRixNQUFNLG9CQUFvQixHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztRQUUzRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNCLG9CQUFvQixDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7WUFDaEUsb0JBQW9CLENBQUMsWUFBWSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEUsb0JBQW9CLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQztRQUM5RCxDQUFDO1FBQ0Qsb0JBQW9CLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQyxvQkFBb0IsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLG9CQUFvQixDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkMsb0JBQW9CLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztRQUNqRCxvQkFBb0IsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVDLG9CQUFvQixDQUFDLGNBQWMsR0FBRztZQUNsQyxTQUFTO1lBQ1QsYUFBYTtZQUNiLEdBQUc7WUFDSCxjQUFjO1lBQ2QsZUFBZTtZQUNmLG9CQUFvQjtZQUNwQixRQUFRO1lBQ1IsV0FBVztZQUNYLFNBQVM7WUFDVCxVQUFVO1lBQ1YsY0FBYztZQUNkLEdBQUc7WUFDSCxVQUFVO1NBQ2IsQ0FBQztRQUNGLG9CQUFvQixDQUFDLFNBQVMsR0FBRztZQUM3Qiw0SEFBNEg7WUFDNUgsMktBQTJLO1lBQzNLLHFLQUFxSztZQUNySyxxQkFBcUI7WUFDckIsV0FBVztZQUNYLFFBQVE7U0FDWCxDQUFDO1FBRUYsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7QUFyRWMsb0NBQVEsR0FBVyxrQkFBa0IsQ0FBQztBQUR6RCxrRUF1RUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy91bml0ZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgdW5pdGUtdGhlbWUuanNvbi5cbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGVUaGVtZS91bml0ZVRoZW1lQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbiBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcInVuaXRlLXRoZW1lLmpzb25cIjtcblxuICAgIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZpbGVSZWFkSnNvbjxVbml0ZVRoZW1lQ29uZmlndXJhdGlvbj4obG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cuYXNzZXRzU3JjRm9sZGVyLCBcInRoZW1lL1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIChvYmopID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBvYmo7XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGVmYXVsdHModW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlVG9nZ2xlSnNvbihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyY0ZvbGRlciwgXCJ0aGVtZS9cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMoKSA9PiB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm1ldGFEZXNjcmlwdGlvbiA9IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZTtcbiAgICAgICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLm1ldGFLZXl3b3JkcyA9IHVuaXRlQ29uZmlndXJhdGlvbi50aXRsZS5zcGxpdChcIiBcIik7XG4gICAgICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5zaG9ydE5hbWUgPSB1bml0ZUNvbmZpZ3VyYXRpb24udGl0bGU7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24ubWV0YUF1dGhvciA9IFwiXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmN1c3RvbUhlYWRlcnMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvbmZpZ3VyYXRpb24udGhlbWVIZWFkZXJzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJhY2tncm91bmRDb2xvciA9IFwiIzMzOTkzM1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50aGVtZUNvbG9yID0gXCIjMzM5OTMzXCI7XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmFwcExvYWRlclN0eWxlID0gW1xuICAgICAgICAgICAgXCI8c3R5bGU+XCIsXG4gICAgICAgICAgICBcIiNhcHAtbG9hZGVyXCIsXG4gICAgICAgICAgICBcIntcIixcbiAgICAgICAgICAgIFwid2lkdGg6MjAwcHg7XCIsXG4gICAgICAgICAgICBcImhlaWdodDoyMDBweDtcIixcbiAgICAgICAgICAgIFwicG9zaXRpb246YWJzb2x1dGU7XCIsXG4gICAgICAgICAgICBcInRvcDowO1wiLFxuICAgICAgICAgICAgXCJib3R0b206MDtcIixcbiAgICAgICAgICAgIFwibGVmdDowO1wiLFxuICAgICAgICAgICAgXCJyaWdodDowO1wiLFxuICAgICAgICAgICAgXCJtYXJnaW46YXV0bztcIixcbiAgICAgICAgICAgIFwifVwiLFxuICAgICAgICAgICAgXCI8L3N0eWxlPlwiXG4gICAgICAgIF07XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmFwcExvYWRlciA9IFtcbiAgICAgICAgICAgIGA8c3ZnIHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWRcIj5gLFxuICAgICAgICAgICAgYDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIntUSEVNRV9DT0xPUn1cIiBzdHJva2Utd2lkdGg9XCIyXCIgcj1cIjM1XCIgc3Ryb2tlLWRhc2hhcnJheT1cIjE2NC45MzM2MTQzMTM0NjQxNSA1Ni45Nzc4NzE0Mzc4MjEzOFwiIHRyYW5zZm9ybT1cInJvdGF0ZSgzMzAgNTAgNTApXCI+YCxcbiAgICAgICAgICAgIGA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPVwidHJhbnNmb3JtXCIgdHlwZT1cInJvdGF0ZVwiIGNhbGNNb2RlPVwibGluZWFyXCIgdmFsdWVzPVwiMCA1MCA1MDszNjAgNTAgNTBcIiBrZXlUaW1lcz1cIjA7MVwiIGR1cj1cIjFzXCIgYmVnaW49XCIwc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiPmAsXG4gICAgICAgICAgICBgPC9hbmltYXRlVHJhbnNmb3JtPmAsXG4gICAgICAgICAgICBgPC9jaXJjbGU+YCxcbiAgICAgICAgICAgIGA8L3N2Zz5gXG4gICAgICAgIF07XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJVbml0ZVRoZW1lXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
