"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * HTML template generator.
 */
const templateConstants_1 = require("./templateConstants");
class HtmlTemplate {
    generateTemplate() {
        const lines = [];
        lines.push("<!doctype html>");
        lines.push("<html>");
        lines.push("<head>");
        lines.push("<meta charset=\"utf-8\"/>");
        lines.push("<title>{" + templateConstants_1.TemplateConstants.APP_NAME + "}</title>");
        lines.push("</head>");
        lines.push("<body>");
        lines.push("</body>");
        lines.push("</html>");
        return lines;
    }
}
exports.HtmlTemplate = HtmlTemplate;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0bWwvaHRtbFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCwyREFBd0Q7QUFFeEQ7SUFDVyxnQkFBZ0I7UUFDbkIsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBRTNCLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ3hDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLHFDQUFpQixDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsQ0FBQztRQUNsRSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXRCLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKO0FBaEJELG9DQWdCQyIsImZpbGUiOiJodG1sL2h0bWxUZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
