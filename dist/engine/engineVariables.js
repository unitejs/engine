"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EngineVariables {
    constructor() {
        this._requiredDevDependencies = [];
        this._removedDevDependencies = [];
        this._requiredDependencies = [];
        this._removedDependencies = [];
    }
    toggleDependencies(dependencies, required, isDev) {
        if (isDev) {
            if (required) {
                this._requiredDevDependencies = this._requiredDevDependencies.concat(dependencies);
            }
            else {
                this._removedDevDependencies = this._removedDevDependencies.concat(dependencies);
            }
        }
        else {
            if (required) {
                this._requiredDependencies = this._requiredDependencies.concat(dependencies);
            }
            else {
                this._removedDependencies = this._removedDependencies.concat(dependencies);
            }
        }
    }
    optimiseDependencies() {
        this._requiredDependencies.forEach(requiredDependency => {
            const idx = this._requiredDevDependencies.indexOf(requiredDependency);
            if (idx > 0) {
                this._requiredDevDependencies.splice(idx, 1);
            }
        });
    }
    buildDependencies(dependencies, isDev) {
        const srcRemove = isDev ? this._removedDevDependencies : this._removedDependencies;
        srcRemove.forEach(dependency => {
            if (dependencies[dependency]) {
                delete dependencies[dependency];
            }
        });
        if (this.corePackageJson.peerDependencies) {
            const srcRequire = isDev ? this._requiredDevDependencies : this._requiredDependencies;
            srcRequire.sort();
            srcRequire.forEach(requiredDependency => {
                if (this.corePackageJson.peerDependencies[requiredDependency]) {
                    dependencies[requiredDependency] = this.corePackageJson.peerDependencies[requiredDependency];
                }
                else {
                    throw new Error("Missing Dependency '" + requiredDependency + "'");
                }
            });
        }
        else {
            throw new Error("Dependency Versions missing");
        }
    }
    findDependencyVersion(requiredDependency) {
        if (this.corePackageJson.peerDependencies) {
            if (this.corePackageJson.peerDependencies[requiredDependency]) {
                return this.corePackageJson.peerDependencies[requiredDependency];
            }
            else {
                throw new Error("Missing Dependency '" + requiredDependency + "'");
            }
        }
        else {
            throw new Error("Dependency Versions missing");
        }
    }
}
exports.EngineVariables = EngineVariables;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUE7SUF3Q0k7UUFDSSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFTSxrQkFBa0IsQ0FBQyxZQUFzQixFQUFFLFFBQWlCLEVBQUUsS0FBYztRQUMvRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1IsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2RixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckYsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakYsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQy9FLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVNLG9CQUFvQjtRQUN2QixJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLGtCQUFrQjtZQUNqRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDdEUsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakQsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLGlCQUFpQixDQUFDLFlBQXFDLEVBQUUsS0FBYztRQUMxRSxNQUFNLFNBQVMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztRQUNuRixTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDeEIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUM7WUFFdEYsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWxCLFVBQVUsQ0FBQyxPQUFPLENBQUMsa0JBQWtCO2dCQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxZQUFZLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ2pHLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDdkUsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ25ELENBQUM7SUFDTCxDQUFDO0lBRU0scUJBQXFCLENBQUMsa0JBQTBCO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDckUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLEdBQUcsa0JBQWtCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdkUsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUNuRCxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBNUdELDBDQTRHQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lVmFyaWFibGVzLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
