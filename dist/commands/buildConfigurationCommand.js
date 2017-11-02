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
 * Build Configuration Command
 */
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
const uniteBuildConfiguration_1 = require("../configuration/models/unite/uniteBuildConfiguration");
const engineCommandBase_1 = require("../engine/engineCommandBase");
const engineVariables_1 = require("../engine/engineVariables");
class BuildConfigurationCommand extends engineCommandBase_1.EngineCommandBase {
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniteConfiguration = yield this.loadConfiguration(args.outputDirectory, undefined, undefined, false);
            if (!uniteConfiguration) {
                this._logger.error("There is no unite.json to configure.");
                return 1;
            }
            else {
                uniteConfiguration.buildConfigurations = uniteConfiguration.buildConfigurations || {};
            }
            if (!parameterValidation_1.ParameterValidation.checkOneOf(this._logger, "operation", args.operation, ["add", "remove"])) {
                return 1;
            }
            if (!parameterValidation_1.ParameterValidation.notEmpty(this._logger, "configurationName", args.configurationName)) {
                return 1;
            }
            this._logger.info("");
            if (args.operation === "add") {
                return this.buildConfigurationAdd(args, uniteConfiguration);
            }
            else {
                return this.buildConfigurationRemove(args, uniteConfiguration);
            }
        });
    }
    buildConfigurationAdd(args, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
            uniteConfiguration.buildConfigurations[args.configurationName] = uniteConfiguration.buildConfigurations[args.configurationName] || new uniteBuildConfiguration_1.UniteBuildConfiguration();
            uniteConfiguration.buildConfigurations[args.configurationName].bundle = args.bundle === undefined ? false : args.bundle;
            uniteConfiguration.buildConfigurations[args.configurationName].minify = args.minify === undefined ? false : args.minify;
            uniteConfiguration.buildConfigurations[args.configurationName].sourcemaps = args.sourcemaps === undefined ? true : args.sourcemaps;
            uniteConfiguration.buildConfigurations[args.configurationName].pwa = args.pwa === undefined ? false : args.pwa;
            this._pipeline.add("content", "buildConfiguration");
            this._pipeline.add("unite", "uniteConfigurationJson");
            const ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
            }
            return ret;
        });
    }
    buildConfigurationRemove(args, uniteConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uniteConfiguration.buildConfigurations[args.configurationName]) {
                this._logger.error("Build configuration has not been added.");
                return 1;
            }
            const engineVariables = new engineVariables_1.EngineVariables();
            this.createEngineVariables(args.outputDirectory, uniteConfiguration, engineVariables);
            delete uniteConfiguration.buildConfigurations[args.configurationName];
            this._pipeline.add("unite", "uniteConfigurationJson");
            const ret = yield this._pipeline.run(uniteConfiguration, engineVariables);
            if (ret === 0) {
                this._logger.banner("Successfully Completed.");
            }
            return ret;
        });
    }
}
exports.BuildConfigurationCommand = BuildConfigurationCommand;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9idWlsZENvbmZpZ3VyYXRpb25Db21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUN6RixtR0FBZ0c7QUFFaEcsbUVBQWdFO0FBQ2hFLCtEQUE0RDtBQUs1RCwrQkFBdUMsU0FBUSxxQ0FBaUI7SUFDL0MsR0FBRyxDQUFDLElBQXNDOztZQUNuRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUzRyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixrQkFBa0IsQ0FBQyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQyxtQkFBbUIsSUFBSSxFQUFFLENBQUM7WUFDMUYsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsVUFBVSxDQUE4QixJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUks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cUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3RGLE9BQU8sa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFdEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFFdEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUUxRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0NBQ0o7QUF0RUQsOERBc0VDIiwiZmlsZSI6ImNvbW1hbmRzL2J1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEJ1aWxkIENvbmZpZ3VyYXRpb24gQ29tbWFuZFxuICovXG5pbXBvcnQgeyBQYXJhbWV0ZXJWYWxpZGF0aW9uIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9wYXJhbWV0ZXJWYWxpZGF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUJ1aWxkQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lQ29tbWFuZEJhc2UgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgQnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJQnVpbGRDb25maWd1cmF0aW9uQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lCdWlsZENvbmZpZ3VyYXRpb25Db21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBJRW5naW5lQ29tbWFuZCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVDb21tYW5kXCI7XG5cbmV4cG9ydCBjbGFzcyBCdWlsZENvbmZpZ3VyYXRpb25Db21tYW5kIGV4dGVuZHMgRW5naW5lQ29tbWFuZEJhc2UgaW1wbGVtZW50cyBJRW5naW5lQ29tbWFuZDxJQnVpbGRDb25maWd1cmF0aW9uQ29tbWFuZFBhcmFtcz4ge1xuICAgIHB1YmxpYyBhc3luYyBydW4oYXJnczogSUJ1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmRQYXJhbXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBhd2FpdCB0aGlzLmxvYWRDb25maWd1cmF0aW9uKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJUaGVyZSBpcyBubyB1bml0ZS5qc29uIHRvIGNvbmZpZ3VyZS5cIik7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zID0gdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnMgfHwge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24uY2hlY2tPbmVPZjxCdWlsZENvbmZpZ3VyYXRpb25PcGVyYXRpb24+KHRoaXMuX2xvZ2dlciwgXCJvcGVyYXRpb25cIiwgYXJncy5vcGVyYXRpb24sIFtcImFkZFwiLCBcInJlbW92ZVwiXSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICghUGFyYW1ldGVyVmFsaWRhdGlvbi5ub3RFbXB0eSh0aGlzLl9sb2dnZXIsIFwiY29uZmlndXJhdGlvbk5hbWVcIiwgYXJncy5jb25maWd1cmF0aW9uTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJcIik7XG5cbiAgICAgICAgaWYgKGFyZ3Mub3BlcmF0aW9uID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5idWlsZENvbmZpZ3VyYXRpb25BZGQoYXJncywgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkQ29uZmlndXJhdGlvblJlbW92ZShhcmdzLCB1bml0ZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBidWlsZENvbmZpZ3VyYXRpb25BZGQoYXJnczogSUJ1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmRQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2FyZ3MuY29uZmlndXJhdGlvbk5hbWVdID0gdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbYXJncy5jb25maWd1cmF0aW9uTmFtZV0gfHwgbmV3IFVuaXRlQnVpbGRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbYXJncy5jb25maWd1cmF0aW9uTmFtZV0uYnVuZGxlID0gYXJncy5idW5kbGUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJncy5idW5kbGU7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2FyZ3MuY29uZmlndXJhdGlvbk5hbWVdLm1pbmlmeSA9IGFyZ3MubWluaWZ5ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3MubWluaWZ5O1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1thcmdzLmNvbmZpZ3VyYXRpb25OYW1lXS5zb3VyY2VtYXBzID0gYXJncy5zb3VyY2VtYXBzID09PSB1bmRlZmluZWQgPyB0cnVlIDogYXJncy5zb3VyY2VtYXBzO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1thcmdzLmNvbmZpZ3VyYXRpb25OYW1lXS5wd2EgPSBhcmdzLnB3YSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmdzLnB3YTtcblxuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJjb250ZW50XCIsIFwiYnVpbGRDb25maWd1cmF0aW9uXCIpO1xuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIik7XG5cbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5fcGlwZWxpbmUucnVuKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYnVpbGRDb25maWd1cmF0aW9uUmVtb3ZlKGFyZ3M6IElCdWlsZENvbmZpZ3VyYXRpb25Db21tYW5kUGFyYW1zLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICghdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbYXJncy5jb25maWd1cmF0aW9uTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkJ1aWxkIGNvbmZpZ3VyYXRpb24gaGFzIG5vdCBiZWVuIGFkZGVkLlwiKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICBkZWxldGUgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbYXJncy5jb25maWd1cmF0aW9uTmFtZV07XG5cbiAgICAgICAgdGhpcy5fcGlwZWxpbmUuYWRkKFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpO1xuXG4gICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuX3BpcGVsaW5lLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmJhbm5lcihcIlN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iXX0=
