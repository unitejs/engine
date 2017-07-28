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
 * NPM Package Manager class.
 */
const npm = require("npm");
class NpmPackageManager {
    constructor(logger, display, fileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }
    info(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            this._display.info("Looking up package info...");
            return new Promise((resolve, reject) => {
                npm.load({ json: true }, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        npm.commands.view([packageName, "version", "main"], (err2, result2, result3, result4, result5) => {
                            if (err2) {
                                reject(err2);
                            }
                            else {
                                const keys = Object.keys(result2);
                                if (keys.length > 0) {
                                    resolve(result2[keys[0]]);
                                }
                                else {
                                    reject(new Error("No package information found."));
                                }
                            }
                        });
                    }
                });
            });
        });
    }
    add(workingDirectory, packageName, version, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            this._display.info("Adding package...");
            return new Promise((resolve, reject) => {
                const config = {};
                config.prefix = this._fileSystem.pathFormat(workingDirectory);
                if (isDev) {
                    config["save-dev"] = true;
                }
                else {
                    config["save-prod"] = true;
                }
                npm.load(config, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        npm.commands.install([`${packageName}@${version}`], (err2, result2, result3, result4, result5) => {
                            if (err2) {
                                reject(err2);
                            }
                            else {
                                resolve();
                            }
                        });
                    }
                });
            });
        });
    }
    remove(workingDirectory, packageName, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            this._display.info("Removing package...");
            return new Promise((resolve, reject) => {
                const config = {};
                config.prefix = this._fileSystem.pathFormat(workingDirectory);
                if (isDev) {
                    config["save-dev"] = true;
                }
                else {
                    config.save = true;
                }
                npm.load(config, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        npm.commands.uninstall([packageName], (err2, result2, result3, result4, result5) => {
                            if (err2) {
                                reject(err2);
                            }
                            else {
                                resolve();
                            }
                        });
                    }
                });
            });
        });
    }
}
exports.NpmPackageManager = NpmPackageManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrYWdlTWFuYWdlcnMvbnBtUGFja2FnZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsMkJBQTJCO0FBTzNCO0lBS0ksWUFBWSxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QjtRQUNuRSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksSUFBSSxDQUFDLFdBQW1COztZQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBdUIsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNO29CQUMvQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTzs0QkFDekYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDUCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2pCLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ0osTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQ0FDbEMsRUFB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QyxDQUFDO29CQUNoQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTzs0QkFDM0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDUCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2pCLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ0osT0FBTyxFQUFFLENBQUM7NEJBQ2QsQ0FBQzt3QkFDTCxDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7Q0FDSjtBQXRGRCw4Q0FzRkMiLCJmaWxlIjoicGFja2FnZU1hbmFnZXJzL25wbVBhY2thZ2VNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
