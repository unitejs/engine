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
    buildDependencies(dependencies, peerDependencies, isDev) {
        const srcRemove = isDev ? this._removedDevDependencies : this._removedDependencies;
        srcRemove.forEach(dependency => {
            if (dependencies[dependency]) {
                delete dependencies[dependency];
            }
        });
        if (peerDependencies) {
            const srcRequire = isDev ? this._requiredDevDependencies : this._requiredDependencies;
            srcRequire.sort();
            srcRequire.forEach(requiredDependency => {
                if (peerDependencies[requiredDependency]) {
                    dependencies[requiredDependency] = peerDependencies[requiredDependency];
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
}
exports.EngineVariables = EngineVariables;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmVWYXJpYWJsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQTtJQXVDSTtRQUNJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVNLGtCQUFrQixDQUFDLFlBQXNCLEVBQUUsUUFBaUIsRUFBRSxLQUFjO1FBQy9FLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDUixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZGLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRixDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqRixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDL0UsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0sb0JBQW9CO1FBQ3ZCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsa0JBQWtCO1lBQ2pELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN0RSxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0saUJBQWlCLENBQUMsWUFBcUMsRUFBRSxnQkFBeUMsRUFBRSxLQUFjO1FBQ3JILE1BQU0sU0FBUyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1FBQ25GLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUN4QixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixPQUFPLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxVQUFVLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUM7WUFFdEYsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWxCLFVBQVUsQ0FBQyxPQUFPLENBQUMsa0JBQWtCO2dCQUNqQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDNUUsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixHQUFHLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN2RSxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQS9GRCwwQ0ErRkMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
