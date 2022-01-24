import Document from '../Document';
import Property from '../Property';
import Matrix from './Matrix';
export default class Skew extends Matrix {
    type: string;
    protected readonly angle: Property;
    constructor(document: Document, skew: string);
}
//# sourceMappingURL=Skew.d.ts.map