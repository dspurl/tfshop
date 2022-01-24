/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare type callbackFn = () => void;
export interface IStateObj {
    listeners: callbackFn[];
    scriptId: string;
    scriptLoaded: boolean;
}
interface ScriptLoader {
    load: (doc: Document, url: string, callback: callbackFn) => void;
    reinitialize: () => void;
}
declare const ScriptLoader: ScriptLoader;
export { ScriptLoader };
