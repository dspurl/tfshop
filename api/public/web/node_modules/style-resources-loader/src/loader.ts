import {errorMessage, isFunction, loadResources} from './utils';

import type {Loader, LoaderCallback} from '.';

/* eslint-disable no-invalid-this */
const loader: Loader = function (source) {
    this.cacheable();

    const callback = this.async();

    if (!isFunction<LoaderCallback>(callback)) {
        throw new Error(errorMessage.syncCompilation);
    }

    /* istanbul ignore if: not possible to test */
    if (typeof source !== 'string') {
        throw new Error(errorMessage.impossible);
    }

    /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
    loadResources(this, source, callback);
};
/* eslint-enable no-invalid-this */

export default loader;
