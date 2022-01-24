import {validate} from 'schema-utils';

import {schema} from '../schema';

import {LOADER_NAME, VALIDATION_BASE_DATA_PATH} from './constants';

export const validateOptions: <T>(options: any) => asserts options is T = options =>
    validate(schema, options, {
        name: LOADER_NAME,
        baseDataPath: VALIDATION_BASE_DATA_PATH,
    });
