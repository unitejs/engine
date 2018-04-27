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
            "/\\* Synthetic Import \\*/ ": [engineVariables.syntheticImport],
            "\"genModuleId\"": [engineVariables.moduleId]
        };
    }
}
exports.TemplateHelper = TemplateHelper;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3RlbXBsYXRlSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0E7SUFDVyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBWTtRQUM1QyxNQUFNLGFBQWEsR0FBNkIsRUFBRSxDQUFDO1FBRW5ELE1BQU0sS0FBSyxHQUFhLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsQixhQUFhLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BFLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xFLGFBQWEsQ0FBQyxlQUFlLENBQUMsR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BFLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkU7UUFFRCxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBRU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFZO1FBQ3BDLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUUzQixJQUFJLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtZQUNyQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQztpQkFDL0IsSUFBSSxFQUFFLENBQUM7WUFFaEMsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzFDLDBCQUEwQjtvQkFDMUIs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QUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7U0FDaEQsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQTFIRCx3Q0EwSEMiLCJmaWxlIjoiaGVscGVycy90ZW1wbGF0ZUhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVtcGxhdGUgaGVscGVyXG4gKi9cbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZUhlbHBlciB7XG4gICAgcHVibGljIHN0YXRpYyBnZW5lcmF0ZVN1YnN0aXR1dGlvbnMobmFtZTogc3RyaW5nKTogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICAgICAgY29uc3Qgc3Vic3RpdHV0aW9uczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cbiAgICAgICAgY29uc3Qgd29yZHM6IHN0cmluZ1tdID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVXb3JkcyhuYW1lKTtcblxuICAgICAgICBpZiAod29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3Vic3RpdHV0aW9uc1tgZ2VuLW5hbWUtc25ha2VgXSA9IFRlbXBsYXRlSGVscGVyLmNyZWF0ZVNuYWtlKHdvcmRzKTtcbiAgICAgICAgICAgIHN1YnN0aXR1dGlvbnNbYGdlbk5hbWVDYW1lbGBdID0gVGVtcGxhdGVIZWxwZXIuY3JlYXRlQ2FtZWwod29yZHMpO1xuICAgICAgICAgICAgc3Vic3RpdHV0aW9uc1tgR2VuTmFtZVBhc2NhbGBdID0gVGVtcGxhdGVIZWxwZXIuY3JlYXRlUGFzY2FsKHdvcmRzKTtcbiAgICAgICAgICAgIHN1YnN0aXR1dGlvbnNbYEdlbiBOYW1lIEh1bWFuYF0gPSBUZW1wbGF0ZUhlbHBlci5jcmVhdGVIdW1hbih3b3Jkcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3Vic3RpdHV0aW9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdlbmVyYXRlV29yZHMobmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCB3b3Jkczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICBpZiAobmFtZSAhPT0gdW5kZWZpbmVkICYmIG5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGp1c3RBbHBoYU51bSA9IG5hbWUucmVwbGFjZSgvW15hLXpBLVowLTkgXS9nLCBcIiBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG5cbiAgICAgICAgICAgIGlmIChqdXN0QWxwaGFOdW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwganVzdEFscGhhTnVtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElzIHRoaXMgbG93ZXIgb3IgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIGlmICgvW2EtejAtOV0vLnRlc3QoanVzdEFscGhhTnVtW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIHdvcmRzIHNvIHB1c2ggbmV3IHdvcmQgdXBwZXIgY2FzZSBvZiBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jkcy5wdXNoKGp1c3RBbHBoYU51bVtpXS50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9lcyB0aGUgY3VycmVudCB3b3JkIGhhdmUgYW55IGxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWmVybyBsZW5ndGggc28gYXBwZW5kIHVwcGVyIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHNbd29yZHMubGVuZ3RoIC0gMV0gKz0ganVzdEFscGhhTnVtW2ldLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxyZWFkeSBpbiB3b3JkIHNvIGp1c3QgYXBwZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdICs9IGp1c3RBbHBoYU51bVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJcyB0aGlzIHVwcGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1tBLVpdLy50ZXN0KGp1c3RBbHBoYU51bVtpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcmUgd2UgYWxyZWFkeSBpbiBhIHdvcmQ/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzLmxlbmd0aCA+IDAgJiYgd29yZHNbd29yZHMubGVuZ3RoIC0gMV0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBZZXMsIGlmIGl0IGlzIGFscmVhZHkgYWxsIGNhcHMganVzdCBhcHBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eW15hLXpdKiQvLnRlc3Qod29yZHNbd29yZHMubGVuZ3RoIC0gMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDdXJyZW50IHdvcmQgYWxsIGNhcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdICs9IGp1c3RBbHBoYU51bVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEN1cnJlbnQgd29yZCBpcyBub3QgYWxsIGNhcHMgc28gc3RhcnQgYSBuZXcgb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jkcy5wdXNoKGp1c3RBbHBoYU51bVtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3VycmVudCB3b3JkIGlzIGVtcHR5IHNvIGp1c3QgYXBwZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXSArPSBqdXN0QWxwaGFOdW1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBObyB3b3JkcyBzbyBzdGFydCBhIG5ldyBvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRzLnB1c2goanVzdEFscGhhTnVtW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTXVzdCBiZSBhIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzLmxlbmd0aCA+IDAgJiYgd29yZHNbd29yZHMubGVuZ3RoIC0gMV0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHJlYWR5IGluIGEgd29yZCBzbyBzdGFydCBhIG5ldyBvbmUgYXMgbG9uZyBhcyBpdCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHMucHVzaChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd29yZHM7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVTbmFrZSh3b3Jkczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gd29yZHMuam9pbihcIi1cIilcbiAgICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVQYXNjYWwod29yZHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHdvcmRzLmpvaW4oXCJcIik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVIdW1hbih3b3Jkczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gd29yZHMuam9pbihcIiBcIik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVDYW1lbCh3b3Jkczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gd29yZHNbMF1bMF0udG9Mb3dlckNhc2UoKSArXG4gICAgICAgICAgICAgICB3b3Jkc1swXS5zdWJzdHJpbmcoMSkgK1xuICAgICAgICAgICAgICAgd29yZHMuc2xpY2UoMSlcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcIik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZXBsYWNlU3Vic3RpdHV0aW9ucyhzdWJzdGl0dXRpb25zOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIHwgc3RyaW5nW10gfSwgaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBvdXRwdXQgPSBpbnB1dDtcblxuICAgICAgICBpZiAoaW5wdXQgIT09IG51bGwgJiYgaW5wdXQgIT09IHVuZGVmaW5lZCAmJiBzdWJzdGl0dXRpb25zICE9PSB1bmRlZmluZWQgJiYgc3Vic3RpdHV0aW9ucyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoc3Vic3RpdHV0aW9ucylcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVwOiBzdHJpbmdbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc3Vic3RpdHV0aW9uc1trZXldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwID0gPHN0cmluZ1tdPnN1YnN0aXR1dGlvbnNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcCA9IFs8c3RyaW5nPnN1YnN0aXR1dGlvbnNba2V5XV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChgJHtrZXl9YCwgXCJnbVwiKSwgcmVwLmpvaW4oXCJcXHJcXG5cIikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUNvZGVTdWJzdGl0dXRpb25zKGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogeyBbaWQ6IHN0cmluZ106IHN0cmluZ1tdIH0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCIvXFxcXCogU3ludGhldGljIEltcG9ydCBcXFxcKi8gXCI6IFtlbmdpbmVWYXJpYWJsZXMuc3ludGhldGljSW1wb3J0XSxcbiAgICAgICAgICAgIFwiXFxcImdlbk1vZHVsZUlkXFxcIlwiOiBbZW5naW5lVmFyaWFibGVzLm1vZHVsZUlkXVxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==
