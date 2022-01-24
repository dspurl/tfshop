import type {LoaderContext, LoaderCallback} from '..';

import {getResources} from './get-resources';
import {injectResources} from './inject-resources';
import {normalizeOptions} from './normalize-options';

export const loadResources = async (ctx: LoaderContext, source: string, callback: LoaderCallback) => {
    try {
        const options = normalizeOptions(ctx);

        const resources = await getResources(ctx, options);

        const content = await injectResources(options, source, resources);

        callback(null, content);
    } catch (err) {
        callback(err);
    }
};
