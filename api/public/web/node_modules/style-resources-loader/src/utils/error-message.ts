import {PACKAGE_NAME, ISSUES_URL} from './constants';

const formatErrorMessage = (message: string) => `[${PACKAGE_NAME}] ${message}`;

const messageByType = {
    impossible: `This error is caused by a bug. Please file an issue: ${ISSUES_URL}.`,
    syncCompilation: 'Synchronous compilation is not supported.',
    invalidInjectorReturn: 'Expected options.injector(...) returns a string. Instead received number.',
};

export const errorMessage = Object.entries(messageByType).reduce(
    (errorMessage, [type, message]) => ({
        ...errorMessage,
        [type]: formatErrorMessage(message),
    }),
    messageByType,
);
