import { IncomingMessage } from 'http';

declare function isHTTPS(req: IncomingMessage, trustProxy?: Boolean): Boolean | undefined;

export default isHTTPS;
