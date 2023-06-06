import { Module } from '@nuxt/types';
import { Options, Filter } from 'http-proxy-middleware';

declare type ProxyContext = Filter | Options;
declare type ProxyOptionsObject = {
    [target: string]: Options;
};
declare type ProxyOptionsArray = Array<[ProxyContext, Options?] | Options | string>;
declare type NuxtProxyOptions = ProxyOptionsObject | ProxyOptionsArray;

declare module '@nuxt/types' {
    interface Configuration {
        proxy?: NuxtProxyOptions;
    }
}
declare const proxyModule: Module<Options>;

export default proxyModule;
