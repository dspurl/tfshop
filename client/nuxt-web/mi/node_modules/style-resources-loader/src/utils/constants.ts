import type {StyleResourcesFileFormat} from '..';

export const PACKAGE_NAME = 'style-resources-loader';

export const ISSUES_URL = `https://github.com/yenshih/${PACKAGE_NAME}/issues`;

export const LOADER_NAME = PACKAGE_NAME.split('-')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

export const VALIDATION_BASE_DATA_PATH = 'options';

export const SUPPORTED_FILE_FORMATS: StyleResourcesFileFormat[] = ['css', 'sass', 'scss', 'less', 'styl'];

export const SUPPORTED_FILE_EXTS = SUPPORTED_FILE_FORMATS.map(type => `.${type}`);
