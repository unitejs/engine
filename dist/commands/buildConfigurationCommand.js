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
                return yield this.buildConfigurationAdd(args, uniteConfiguration);
            }
            else {
                return yield this.buildConfigurationRemove(args, uniteConfiguration);
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
            uniteConfiguration.buildConfigurations[args.configurationName].variables = uniteConfiguration.buildConfigurations[args.configurationName].variables || {};
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9idWlsZENvbmZpZ3VyYXRpb25Db21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDRGQUF5RjtBQUN6RixtR0FBZ0c7QUFFaEcsbUVBQWdFO0FBQ2hFLCtEQUE0RDtBQUs1RCwrQkFBdUMsU0FBUSxxQ0FBaUI7SUFDL0MsR0FBRyxDQUFDLElBQXNDOztZQUNuRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUzRyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixrQkFBa0IsQ0FBQyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQyxtQkFBbUIsSUFBSSxFQUFFLENBQUM7WUFDMUYsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsVUFBVSxDQUE4QixJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3SCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUks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LElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBRXRELE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFMUUsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUNuRCxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNKO0FBckVELDhEQXFFQyIsImZpbGUiOiJjb21tYW5kcy9idWlsZENvbmZpZ3VyYXRpb25Db21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCdWlsZCBDb25maWd1cmF0aW9uIENvbW1hbmRcbiAqL1xuaW1wb3J0IHsgUGFyYW1ldGVyVmFsaWRhdGlvbiB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvcGFyYW1ldGVyVmFsaWRhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVCdWlsZENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZUNvbW1hbmRCYXNlIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVDb21tYW5kQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IEJ1aWxkQ29uZmlndXJhdGlvbk9wZXJhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2J1aWxkQ29uZmlndXJhdGlvbk9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSUJ1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JQnVpbGRDb25maWd1cmF0aW9uQ29tbWFuZFBhcmFtc1wiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuXG5leHBvcnQgY2xhc3MgQnVpbGRDb25maWd1cmF0aW9uQ29tbWFuZCBleHRlbmRzIEVuZ2luZUNvbW1hbmRCYXNlIGltcGxlbWVudHMgSUVuZ2luZUNvbW1hbmQ8SUJ1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmRQYXJhbXM+IHtcbiAgICBwdWJsaWMgYXN5bmMgcnVuKGFyZ3M6IElCdWlsZENvbmZpZ3VyYXRpb25Db21tYW5kUGFyYW1zKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgdW5pdGVDb25maWd1cmF0aW9uID0gYXdhaXQgdGhpcy5sb2FkQ29uZmlndXJhdGlvbihhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcblxuICAgICAgICBpZiAoIXVuaXRlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiVGhlcmUgaXMgbm8gdW5pdGUuanNvbiB0byBjb25maWd1cmUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zIHx8IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8QnVpbGRDb25maWd1cmF0aW9uT3BlcmF0aW9uPih0aGlzLl9sb2dnZXIsIFwib3BlcmF0aW9uXCIsIGFyZ3Mub3BlcmF0aW9uLCBbXCJhZGRcIiwgXCJyZW1vdmVcIl0pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVBhcmFtZXRlclZhbGlkYXRpb24ubm90RW1wdHkodGhpcy5fbG9nZ2VyLCBcImNvbmZpZ3VyYXRpb25OYW1lXCIsIGFyZ3MuY29uZmlndXJhdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiXCIpO1xuXG4gICAgICAgIGlmIChhcmdzLm9wZXJhdGlvbiA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYnVpbGRDb25maWd1cmF0aW9uQWRkKGFyZ3MsIHVuaXRlQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5idWlsZENvbmZpZ3VyYXRpb25SZW1vdmUoYXJncywgdW5pdGVDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgYnVpbGRDb25maWd1cmF0aW9uQWRkKGFyZ3M6IElCdWlsZENvbmZpZ3VyYXRpb25Db21tYW5kUGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgZW5naW5lVmFyaWFibGVzID0gbmV3IEVuZ2luZVZhcmlhYmxlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhhcmdzLm91dHB1dERpcmVjdG9yeSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1thcmdzLmNvbmZpZ3VyYXRpb25OYW1lXSA9IHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2FyZ3MuY29uZmlndXJhdGlvbk5hbWVdIHx8IG5ldyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5idWlsZENvbmZpZ3VyYXRpb25zW2FyZ3MuY29uZmlndXJhdGlvbk5hbWVdLmJ1bmRsZSA9IGFyZ3MuYnVuZGxlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3MuYnVuZGxlO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1thcmdzLmNvbmZpZ3VyYXRpb25OYW1lXS5taW5pZnkgPSBhcmdzLm1pbmlmeSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmdzLm1pbmlmeTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbYXJncy5jb25maWd1cmF0aW9uTmFtZV0uc291cmNlbWFwcyA9IGFyZ3Muc291cmNlbWFwcyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGFyZ3Muc291cmNlbWFwcztcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbYXJncy5jb25maWd1cmF0aW9uTmFtZV0udmFyaWFibGVzID0gdW5pdGVDb25maWd1cmF0aW9uLmJ1aWxkQ29uZmlndXJhdGlvbnNbYXJncy5jb25maWd1cmF0aW9uTmFtZV0udmFyaWFibGVzIHx8IHt9O1xuXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmFkZChcInVuaXRlXCIsIFwidW5pdGVDb25maWd1cmF0aW9uSnNvblwiKTtcblxuICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLl9waXBlbGluZS5ydW4odW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5iYW5uZXIoXCJTdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBidWlsZENvbmZpZ3VyYXRpb25SZW1vdmUoYXJnczogSUJ1aWxkQ29uZmlndXJhdGlvbkNvbW1hbmRQYXJhbXMsIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCF1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1thcmdzLmNvbmZpZ3VyYXRpb25OYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiQnVpbGQgY29uZmlndXJhdGlvbiBoYXMgbm90IGJlZW4gYWRkZWQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRW5naW5lVmFyaWFibGVzKGFyZ3Mub3V0cHV0RGlyZWN0b3J5LCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgIGRlbGV0ZSB1bml0ZUNvbmZpZ3VyYXRpb24uYnVpbGRDb25maWd1cmF0aW9uc1thcmdzLmNvbmZpZ3VyYXRpb25OYW1lXTtcblxuICAgICAgICB0aGlzLl9waXBlbGluZS5hZGQoXCJ1bml0ZVwiLCBcInVuaXRlQ29uZmlndXJhdGlvbkpzb25cIik7XG5cbiAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5fcGlwZWxpbmUucnVuKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuYmFubmVyKFwiU3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
