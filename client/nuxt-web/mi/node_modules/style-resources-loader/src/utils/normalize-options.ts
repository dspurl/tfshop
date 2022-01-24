import {EOL} from 'os';

import {getOptions} from 'loader-utils';

import type {
    LoaderContext,
    StyleResource,
    StyleResourcesNormalizedInjector,
    StyleResourcesLoaderOptions,
    StyleResourcesLoaderNormalizedOptions,
} from '..';

import {validateOptions} from './validate-options';

const normalizePatterns = (patterns: StyleResourcesLoaderOptions['patterns']) =>
    Array.isArray(patterns) ? patterns : [patterns];

const coerceContentEOL = (content: string) => (content.endsWith(EOL) ? content : `${content}${EOL}`);
const getResourceContent = ({content}: StyleResource) => coerceContentEOL(content);

const normalizeInjector = (injector: StyleResourcesLoaderOptions['injector']): StyleResourcesNormalizedInjector => {
    if (typeof injector === 'undefined' || injector === 'prepend') {
        return (source, resources) => resources.map(getResourceContent).join('') + source;
    }

    if (injector === 'append') {
        return (source, resources) => source + resources.map(getResourceContent).join('');
    }

    return injector;
};

export const normalizeOptions = (ctx: LoaderContext): StyleResourcesLoaderNormalizedOptions => {
    const options = getOptions(ctx);

    validateOptions<StyleResourcesLoaderOptions>(options);

    const {patterns, injector, globOptions = {}, resolveUrl = true} = options;

    return {
        patterns: normalizePatterns(patterns),
        injector: normalizeInjector(injector),
        globOptions,
        resolveUrl,
    };
};
