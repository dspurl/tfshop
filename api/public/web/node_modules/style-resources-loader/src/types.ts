import type {loader} from 'webpack';
import type glob from 'glob';

export type Loader = loader.Loader;

export type LoaderContext = loader.LoaderContext;

export type LoaderCallback = loader.loaderCallback;

export type StyleResourcesFileFormat = 'css' | 'sass' | 'scss' | 'less' | 'styl';

export interface StyleResource {
    file: string;
    content: string;
}

export type StyleResources = StyleResource[];

export type StyleResourcesFunctionalInjector = (source: string, resources: StyleResources) => string | Promise<string>;

export type StyleResourcesInjector = 'prepend' | 'append' | StyleResourcesFunctionalInjector;

export type StyleResourcesNormalizedInjector = StyleResourcesFunctionalInjector;

export interface StyleResourcesLoaderOptions {
    patterns: string | string[];
    injector?: StyleResourcesInjector;
    globOptions?: glob.IOptions;
    resolveUrl?: boolean;
}

export interface StyleResourcesLoaderNormalizedOptions extends NonNullable<StyleResourcesLoaderOptions> {
    patterns: string[];
    injector: StyleResourcesNormalizedInjector;
}
