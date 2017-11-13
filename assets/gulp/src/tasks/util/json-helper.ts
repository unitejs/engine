/**
 * Gulp utils for client packages.
 */

export function codify(object: any): string {
    if (object === undefined) {
        return object;
    } else {
        let json = JSON.stringify(object, undefined, "\t");
        // First substitue embedded double quotes with FFFF
        json = json.replace(/\\"/g, "\uFFFF");
        // Now replace all property name quotes
        json = json.replace(/"([a-zA-Z_$][a-zA-Z0-9_$]+)":/g, "$1:");
        // Now replace all other double quotes with single ones
        json = json.replace(/"/g, "'");
        // And finally replace the FFFF with embedded double quotes
        json = json.replace(/\uFFFF/g, "\\\"");
        // Now remove quotes for known code variables
        json = json.replace(/'__dirname'/g, "__dirname");
        return json;
    }
}

export function parseCode(text: string): any {
    if (text === undefined || text === null) {
        return text;
    } else {
        // First substitue embedded single quotes with FFFF`
        let jsonText = text.replace(/\\'/g, "\uFFFF");
        // Add double quotes to property names
        jsonText = jsonText.replace(/\n(?:\s*)([a-zA-Z_$][a-zA-Z0-9_$]+):\s/g, "\"$1\":");
        // Now replace all other single quotes with double ones
        jsonText = jsonText.replace(/'/g, "\"");
        // And finally replace the FFFF with embedded single quotes
        jsonText = jsonText.replace(/\uFFFF/g, "'");
        // Now add quotes to known variables
        jsonText = jsonText.replace(/__dirname/g, "\"__dirname\"");

        return JSON.parse(jsonText);
    }
}

// Generated by UniteJS
