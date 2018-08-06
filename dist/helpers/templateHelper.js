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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3RlbXBsYXRlSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsTUFBYSxjQUFjO0lBQ2hCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFZO1FBQzVDLE1BQU0sYUFBYSxHQUE2QixFQUFFLENBQUM7UUFFbkQsTUFBTSxLQUFLLEdBQWEsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEUsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEUsYUFBYSxDQUFDLGVBQWUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEUsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2RTtRQUVELE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVk7UUFDcEMsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBRTNCLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3JDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDO2lCQUMvQixJQUFJLEVBQUUsQ0FBQztZQUVoQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDMUMsMEJB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QUFpQixFQUFFLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQztTQUNoRCxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBMUhELHdDQTBIQyIsImZpbGUiOiJoZWxwZXJzL3RlbXBsYXRlSGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZW1wbGF0ZSBoZWxwZXJcbiAqL1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlSGVscGVyIHtcbiAgICBwdWJsaWMgc3RhdGljIGdlbmVyYXRlU3Vic3RpdHV0aW9ucyhuYW1lOiBzdHJpbmcpOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgICBjb25zdCBzdWJzdGl0dXRpb25zOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICAgICAgICBjb25zdCB3b3Jkczogc3RyaW5nW10gPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVdvcmRzKG5hbWUpO1xuXG4gICAgICAgIGlmICh3b3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzdWJzdGl0dXRpb25zW2BnZW4tbmFtZS1zbmFrZWBdID0gVGVtcGxhdGVIZWxwZXIuY3JlYXRlU25ha2Uod29yZHMpO1xuICAgICAgICAgICAgc3Vic3RpdHV0aW9uc1tgZ2VuTmFtZUNhbWVsYF0gPSBUZW1wbGF0ZUhlbHBlci5jcmVhdGVDYW1lbCh3b3Jkcyk7XG4gICAgICAgICAgICBzdWJzdGl0dXRpb25zW2BHZW5OYW1lUGFzY2FsYF0gPSBUZW1wbGF0ZUhlbHBlci5jcmVhdGVQYXNjYWwod29yZHMpO1xuICAgICAgICAgICAgc3Vic3RpdHV0aW9uc1tgR2VuIE5hbWUgSHVtYW5gXSA9IFRlbXBsYXRlSGVscGVyLmNyZWF0ZUh1bWFuKHdvcmRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRpb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2VuZXJhdGVXb3JkcyhuYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IHdvcmRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIGlmIChuYW1lICE9PSB1bmRlZmluZWQgJiYgbmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QganVzdEFscGhhTnVtID0gbmFtZS5yZXBsYWNlKC9bXmEtekEtWjAtOSBdL2csIFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcblxuICAgICAgICAgICAgaWYgKGp1c3RBbHBoYU51bS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBqdXN0QWxwaGFOdW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSXMgdGhpcyBsb3dlciBvciBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9bYS16MC05XS8udGVzdChqdXN0QWxwaGFOdW1baV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gd29yZHMgc28gcHVzaCBuZXcgd29yZCB1cHBlciBjYXNlIG9mIGNoYXJhY3RlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRzLnB1c2goanVzdEFscGhhTnVtW2ldLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2VzIHRoZSBjdXJyZW50IHdvcmQgaGF2ZSBhbnkgbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaZXJvIGxlbmd0aCBzbyBhcHBlbmQgdXBwZXIgY2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXSArPSBqdXN0QWxwaGFOdW1baV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHJlYWR5IGluIHdvcmQgc28ganVzdCBhcHBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHNbd29yZHMubGVuZ3RoIC0gMV0gKz0ganVzdEFscGhhTnVtW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElzIHRoaXMgdXBwZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvW0EtWl0vLnRlc3QoanVzdEFscGhhTnVtW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFyZSB3ZSBhbHJlYWR5IGluIGEgd29yZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHMubGVuZ3RoID4gMCAmJiB3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFllcywgaWYgaXQgaXMgYWxyZWFkeSBhbGwgY2FwcyBqdXN0IGFwcGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL15bXmEtel0qJC8udGVzdCh3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEN1cnJlbnQgd29yZCBhbGwgY2Fwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHNbd29yZHMubGVuZ3RoIC0gMV0gKz0ganVzdEFscGhhTnVtW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3VycmVudCB3b3JkIGlzIG5vdCBhbGwgY2FwcyBzbyBzdGFydCBhIG5ldyBvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRzLnB1c2goanVzdEFscGhhTnVtW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDdXJyZW50IHdvcmQgaXMgZW1wdHkgc28ganVzdCBhcHBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdICs9IGp1c3RBbHBoYU51bVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIHdvcmRzIHNvIHN0YXJ0IGEgbmV3IG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHMucHVzaChqdXN0QWxwaGFOdW1baV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNdXN0IGJlIGEgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZHMubGVuZ3RoID4gMCAmJiB3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFscmVhZHkgaW4gYSB3b3JkIHNvIHN0YXJ0IGEgbmV3IG9uZSBhcyBsb25nIGFzIGl0IGlzIG5vdCBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jkcy5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3b3JkcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVNuYWtlKHdvcmRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB3b3Jkcy5qb2luKFwiLVwiKVxuICAgICAgICAgICAgICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVBhc2NhbCh3b3Jkczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gd29yZHMuam9pbihcIlwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUh1bWFuKHdvcmRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB3b3Jkcy5qb2luKFwiIFwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUNhbWVsKHdvcmRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB3b3Jkc1swXVswXS50b0xvd2VyQ2FzZSgpICtcbiAgICAgICAgICAgICAgIHdvcmRzWzBdLnN1YnN0cmluZygxKSArXG4gICAgICAgICAgICAgICB3b3Jkcy5zbGljZSgxKVxuICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VTdWJzdGl0dXRpb25zKHN1YnN0aXR1dGlvbnM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfCBzdHJpbmdbXSB9LCBpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG91dHB1dCA9IGlucHV0O1xuXG4gICAgICAgIGlmIChpbnB1dCAhPT0gbnVsbCAmJiBpbnB1dCAhPT0gdW5kZWZpbmVkICYmIHN1YnN0aXR1dGlvbnMgIT09IHVuZGVmaW5lZCAmJiBzdWJzdGl0dXRpb25zICE9PSBudWxsKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzdWJzdGl0dXRpb25zKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXA6IHN0cmluZ1tdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb25zW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXAgPSA8c3RyaW5nW10+c3Vic3RpdHV0aW9uc1trZXldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwID0gWzxzdHJpbmc+c3Vic3RpdHV0aW9uc1trZXldXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKGAke2tleX1gLCBcImdtXCIpLCByZXAuam9pbihcIlxcclxcblwiKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlQ29kZVN1YnN0aXR1dGlvbnMoZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nW10gfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcIi9cXFxcKiBTeW50aGV0aWMgSW1wb3J0IFxcXFwqLyBcIjogW2VuZ2luZVZhcmlhYmxlcy5zeW50aGV0aWNJbXBvcnRdLFxuICAgICAgICAgICAgXCJcXFwiZ2VuTW9kdWxlSWRcXFwiXCI6IFtlbmdpbmVWYXJpYWJsZXMubW9kdWxlSWRdXG4gICAgICAgIH07XG4gICAgfVxufVxuIl19
