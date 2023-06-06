import path from 'path';

import {SUPPORTED_FILE_EXTS} from './constants';

export const isFunction = <T extends (...args: any[]) => any>(arg: any): arg is T => typeof arg === 'function';

export const isStyleFile = (file: string) => SUPPORTED_FILE_EXTS.includes(path.extname(file));
