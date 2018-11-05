"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TemplateHelper {
    static generateSubstitutions(name) {
        const substitutions = {};
        const words = TemplateHelper.generateWords(name);
        if (words.length > 0) {
            substitutions[`gen-name-snake`] = TemplateHelper.createSnake(words);
            substitutions[`genNameCamel`] = TemplateHelper.createCamel(words);
            substitutions[`GenNamePascal`] = TemplateHelper.createPascal(words);
            substitutions[`Gen Name Human`] = TemplateHelper.createHuman(words);
        }
        return substitutions;
    }
    static generateWords(name) {
        const words = [];
        if (name !== undefined && name !== null) {
            const justAlphaNum = name.replace(/[^a-zA-Z0-9 ]/g, " ")
                .trim();
            if (justAlphaNum.length > 0) {
                for (let i = 0; i < justAlphaNum.length; i++) {
                    // Is this lower or number
                    if (/[a-z0-9]/.test(justAlphaNum[i])) {
                        if (words.length === 0) {
                            // No words so push new word upper case of character
                            words.push(justAlphaNum[i].toUpperCase());
                        }
                        else {
                            // Does the current word have any length
                            if (words[words.length - 1].length === 0) {
                                // Zero length so append upper case
                                words[words.length - 1] += justAlphaNum[i].toUpperCase();
                            }
                            else {
                                // Already in word so just append
                                words[words.length - 1] += justAlphaNum[i];
                            }
                        }
                    }
                    else {
                        // Is this upper
                        if (/[A-Z]/.test(justAlphaNum[i])) {
                            // Are we already in a word?
                            if (words.length > 0 && words[words.length - 1].length > 0) {
                                // Yes, if it is already all caps just append
                                if (/^[^a-z]*$/.test(words[words.length - 1])) {
                                    // Current word all caps
                                    words[words.length - 1] += justAlphaNum[i];
                                }
                                else {
                                    // Current word is not all caps so start a new one
                                    words.push(justAlphaNum[i]);
                                }
                            }
                            else {
                                if (words.length > 0) {
                                    // Current word is empty so just append
                                    words[words.length - 1] += justAlphaNum[i];
                                }
                                else {
                                    // No words so start a new one
                                    words.push(justAlphaNum[i]);
                                }
                            }
                        }
                        else {
                            // Must be a space
                            if (words.length > 0 && words[words.length - 1].length > 0) {
                                // Already in a word so start a new one as long as it is not empty
                                words.push("");
                            }
                        }
                    }
                }
            }
        }
        return words;
    }
    static createSnake(words) {
        return words.join("-")
            .toLowerCase();
    }
    static createPascal(words) {
        return words.join("");
    }
    static createHuman(words) {
        return words.join(" ");
    }
    static createCamel(words) {
        return words[0][0].toLowerCase() +
            words[0].substring(1) +
            words.slice(1)
                .join("");
    }
    static replaceSubstitutions(substitutions, input) {
        let output = input;
        if (input !== null && input !== undefined && substitutions !== undefined && substitutions !== null) {
            Object.keys(substitutions)
                .forEach(key => {
                let rep;
                if (Array.isArray(substitutions[key])) {
                    rep = substitutions[key];
                }
                else {
                    rep = [substitutions[key]];
                }
                output = output.replace(new RegExp(`${key}`, "gm"), rep.join("\r\n"));
            });
        }
        return output;
    }
    static createCodeSubstitutions(engineVariables) {
        return {
            "\"genModuleId\"": [engineVariables.moduleId]
        };
    }
}
exports.TemplateHelper = TemplateHelper;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3RlbXBsYXRlSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsTUFBYSxjQUFjO0lBQ2hCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFZO1FBQzVDLE1BQU0sYUFBYSxHQUE2QixFQUFFLENBQUM7UUFFbkQsTUFBTSxLQUFLLEdBQWEsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEUsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEUsYUFBYSxDQUFDLGVBQWUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEUsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2RTtRQUVELE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVk7UUFDcEMsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBRTNCLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3JDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDO2lCQUMvQixJQUFJLEVBQUUsQ0FBQztZQUVoQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDMUMsMEJB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QUM7SUFDTixDQUFDO0NBQ0o7QUF6SEQsd0NBeUhDIiwiZmlsZSI6ImhlbHBlcnMvdGVtcGxhdGVIZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlbXBsYXRlIGhlbHBlclxuICovXG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVIZWxwZXIge1xuICAgIHB1YmxpYyBzdGF0aWMgZ2VuZXJhdGVTdWJzdGl0dXRpb25zKG5hbWU6IHN0cmluZyk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIGNvbnN0IHN1YnN0aXR1dGlvbnM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gICAgICAgIGNvbnN0IHdvcmRzOiBzdHJpbmdbXSA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlV29yZHMobmFtZSk7XG5cbiAgICAgICAgaWYgKHdvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHN1YnN0aXR1dGlvbnNbYGdlbi1uYW1lLXNuYWtlYF0gPSBUZW1wbGF0ZUhlbHBlci5jcmVhdGVTbmFrZSh3b3Jkcyk7XG4gICAgICAgICAgICBzdWJzdGl0dXRpb25zW2BnZW5OYW1lQ2FtZWxgXSA9IFRlbXBsYXRlSGVscGVyLmNyZWF0ZUNhbWVsKHdvcmRzKTtcbiAgICAgICAgICAgIHN1YnN0aXR1dGlvbnNbYEdlbk5hbWVQYXNjYWxgXSA9IFRlbXBsYXRlSGVscGVyLmNyZWF0ZVBhc2NhbCh3b3Jkcyk7XG4gICAgICAgICAgICBzdWJzdGl0dXRpb25zW2BHZW4gTmFtZSBIdW1hbmBdID0gVGVtcGxhdGVIZWxwZXIuY3JlYXRlSHVtYW4od29yZHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGlvbnM7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZW5lcmF0ZVdvcmRzKG5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3Qgd29yZHM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgaWYgKG5hbWUgIT09IHVuZGVmaW5lZCAmJiBuYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBqdXN0QWxwaGFOdW0gPSBuYW1lLnJlcGxhY2UoL1teYS16QS1aMC05IF0vZywgXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICBpZiAoanVzdEFscGhhTnVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGp1c3RBbHBoYU51bS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBJcyB0aGlzIGxvd2VyIG9yIG51bWJlclxuICAgICAgICAgICAgICAgICAgICBpZiAoL1thLXowLTldLy50ZXN0KGp1c3RBbHBoYU51bVtpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBObyB3b3JkcyBzbyBwdXNoIG5ldyB3b3JkIHVwcGVyIGNhc2Ugb2YgY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHMucHVzaChqdXN0QWxwaGFOdW1baV0udG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXMgdGhlIGN1cnJlbnQgd29yZCBoYXZlIGFueSBsZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHNbd29yZHMubGVuZ3RoIC0gMV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFplcm8gbGVuZ3RoIHNvIGFwcGVuZCB1cHBlciBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdICs9IGp1c3RBbHBoYU51bVtpXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFscmVhZHkgaW4gd29yZCBzbyBqdXN0IGFwcGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXSArPSBqdXN0QWxwaGFOdW1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXMgdGhpcyB1cHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9bQS1aXS8udGVzdChqdXN0QWxwaGFOdW1baV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJlIHdlIGFscmVhZHkgaW4gYSB3b3JkP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkcy5sZW5ndGggPiAwICYmIHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWWVzLCBpZiBpdCBpcyBhbHJlYWR5IGFsbCBjYXBzIGp1c3QgYXBwZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXlteYS16XSokLy50ZXN0KHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3VycmVudCB3b3JkIGFsbCBjYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXSArPSBqdXN0QWxwaGFOdW1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDdXJyZW50IHdvcmQgaXMgbm90IGFsbCBjYXBzIHNvIHN0YXJ0IGEgbmV3IG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHMucHVzaChqdXN0QWxwaGFOdW1baV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEN1cnJlbnQgd29yZCBpcyBlbXB0eSBzbyBqdXN0IGFwcGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHNbd29yZHMubGVuZ3RoIC0gMV0gKz0ganVzdEFscGhhTnVtW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gd29yZHMgc28gc3RhcnQgYSBuZXcgb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jkcy5wdXNoKGp1c3RBbHBoYU51bVtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE11c3QgYmUgYSBzcGFjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkcy5sZW5ndGggPiAwICYmIHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxyZWFkeSBpbiBhIHdvcmQgc28gc3RhcnQgYSBuZXcgb25lIGFzIGxvbmcgYXMgaXQgaXMgbm90IGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRzLnB1c2goXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdvcmRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlU25ha2Uod29yZHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHdvcmRzLmpvaW4oXCItXCIpXG4gICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUGFzY2FsKHdvcmRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB3b3Jkcy5qb2luKFwiXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlSHVtYW4od29yZHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHdvcmRzLmpvaW4oXCIgXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlQ2FtZWwod29yZHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHdvcmRzWzBdWzBdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgd29yZHNbMF0uc3Vic3RyaW5nKDEpICtcbiAgICAgICAgICAgICAgIHdvcmRzLnNsaWNlKDEpXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZVN1YnN0aXR1dGlvbnMoc3Vic3RpdHV0aW9uczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB8IHN0cmluZ1tdIH0sIGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgb3V0cHV0ID0gaW5wdXQ7XG5cbiAgICAgICAgaWYgKGlucHV0ICE9PSBudWxsICYmIGlucHV0ICE9PSB1bmRlZmluZWQgJiYgc3Vic3RpdHV0aW9ucyAhPT0gdW5kZWZpbmVkICYmIHN1YnN0aXR1dGlvbnMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHN1YnN0aXR1dGlvbnMpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlcDogc3RyaW5nW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHN1YnN0aXR1dGlvbnNba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcCA9IDxzdHJpbmdbXT5zdWJzdGl0dXRpb25zW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXAgPSBbPHN0cmluZz5zdWJzdGl0dXRpb25zW2tleV1dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoYCR7a2V5fWAsIFwiZ21cIiksIHJlcC5qb2luKFwiXFxyXFxuXCIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVDb2RlU3Vic3RpdHV0aW9ucyhlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmdbXSB9IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiXFxcImdlbk1vZHVsZUlkXFxcIlwiOiBbZW5naW5lVmFyaWFibGVzLm1vZHVsZUlkXVxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==
