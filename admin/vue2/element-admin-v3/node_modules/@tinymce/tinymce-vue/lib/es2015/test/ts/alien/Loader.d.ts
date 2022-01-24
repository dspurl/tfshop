import { Chain } from '@ephox/agar';
export interface Context {
    editor: any;
    vm: any;
}
declare const cRender: (data?: Record<string, any>, template?: string) => Chain<Context, Context>;
declare const cRemove: Chain<Context, Context>;
export { cRender, cRemove };
