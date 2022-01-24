"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessage = void 0;
const constants_1 = require("./constants");
const formatErrorMessage = (message) => `[${constants_1.PACKAGE_NAME}] ${message}`;
const messageByType = {
    impossible: `This error is caused by a bug. Please file an issue: ${constants_1.ISSUES_URL}.`,
    syncCompilation: 'Synchronous compilation is not supported.',
    invalidInjectorReturn: 'Expected options.injector(...) returns a string. Instead received number.',
};
exports.errorMessage = Object.entries(messageByType).reduce((errorMessage, [type, message]) => ({
    ...errorMessage,
    [type]: formatErrorMessage(message),
}), messageByType);
//# sourceMappingURL=error-message.js.map