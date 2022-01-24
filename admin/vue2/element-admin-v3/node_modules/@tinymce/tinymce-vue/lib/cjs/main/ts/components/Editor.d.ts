/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { Vue } from 'vue/types/vue';
import { IPropTypes } from './EditorPropTypes';
declare module 'vue/types/vue' {
    interface Vue {
        elementId: string;
        element: Element | null;
        editor: any;
        inlineEditor: boolean;
        initialized: boolean;
        cache: string;
    }
}
export interface IEditor extends Vue {
    $props: Partial<IPropTypes>;
}
export declare const Editor: ThisTypedComponentOptionsWithRecordProps<Vue, {}, {}, {}, IPropTypes>;
