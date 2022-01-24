import type {StyleResources, StyleResourcesLoaderNormalizedOptions} from '..';

import {errorMessage} from './error-message';

export const injectResources = async (
    options: StyleResourcesLoaderNormalizedOptions,
    source: string,
    resources: StyleResources,
) => {
    const {injector} = options;

    const dist: unknown = injector(source, resources);

    const content = await dist;

    if (typeof content !== 'string') {
        throw new Error(errorMessage.invalidInjectorReturn);
    }

    return content;
};
