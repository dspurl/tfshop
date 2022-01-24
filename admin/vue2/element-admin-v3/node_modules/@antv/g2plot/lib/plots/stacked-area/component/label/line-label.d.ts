import LineLabel from '../../../line/component/label/line-label';
/**
 * 复用扎线图的 label，并修改取值方式
 */
export default class AreaLineLabel extends LineLabel {
    protected getShapeInfo(shape: any): {
        x: any;
        y: number;
        color: any;
        name: any;
    };
}
