"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var layer_1 = tslib_1.__importDefault(require("../../base/layer"));
var word_cloud_tooltips_1 = tslib_1.__importDefault(require("./word-cloud-tooltips"));
var wordcloud2_1 = tslib_1.__importDefault(require("./wordcloud2"));
var WordCloudLayer = /** @class */ (function (_super) {
    tslib_1.__extends(WordCloudLayer, _super);
    function WordCloudLayer(props) {
        var _this = _super.call(this, props) || this;
        _this._toolTipsAction = function (item, dimension, evt, start) {
            if (dimension) {
                _this._toolTips.update({
                    items: [
                        {
                            color: item.color || 'red',
                            name: item.word,
                            value: item.weight,
                        },
                    ],
                    x: evt.offsetX,
                    y: evt.offsetY,
                });
                _this._toolTips.show();
            }
            else {
                _this._toolTips.hide();
            }
            _this._toolTips.render();
            _this._configHoverAction && _this._configHoverAction(item, dimension, evt, start);
        };
        _this._configHoverAction = props.onWordCloudHover;
        _this._enableToolTips = util_1.get(props, 'tooltip.visible', true);
        _this.options = util_1.deepMix({}, {
            width: 400,
            height: 400,
            enableToolTips: true,
        }, props, 
        // replace use config's hover action if needed, and trigger later
        {
            onWordCloudHover: _this._enableToolTips ? _this._toolTipsAction : _this._configHoverAction,
        });
        return _this;
    }
    WordCloudLayer.prototype.init = function () {
        _super.prototype.init.call(this);
        this._initToolTips();
    };
    WordCloudLayer.prototype.render = function () {
        _super.prototype.render.call(this);
        this._render();
    };
    WordCloudLayer.prototype._initToolTips = function () {
        this._toolTips = new word_cloud_tooltips_1.default({
            showTitle: false,
            visible: false,
            parent: this.options.container,
            follow: true,
            inPanel: false,
            items: [],
        });
        this._toolTips.init();
    };
    WordCloudLayer.prototype._render = function () {
        this._targetCanvas = this.canvas.get('el');
        if (this.options.maskImage) {
            this._handleMaskImage();
        }
        else {
            // mask image not exist
            this._start();
        }
    };
    WordCloudLayer.prototype._handleMaskImage = function () {
        var _this = this;
        var image = new Image();
        image.src = this.options.maskImage + '?' + new Date().getTime();
        image.crossOrigin = 'Anonymous';
        image.onload = function () {
            if (image.naturalHeight + image.naturalWidth === 0 || image.width + image.height === 0) {
                _this._start();
            }
            else {
                // handle no-zero image silhouette
                _this._startWithMaskImage(image);
            }
        };
        image.onerror = function () {
            console.error('image %s load failed !!!', _this.options.maskImage);
            // load image error, ignore this mask
            _this._start();
        };
    };
    WordCloudLayer.prototype._start = function () {
        this._handleG2PlotConfig();
        var targetCtx = this._targetCanvas.getContext('2d');
        // it's a trick, because 「g」 use context to scale canvas by pixelRatio,
        // but here i need scale it back
        var pixelRatio = this.canvas.get('width') / this.canvas.get('el').width;
        targetCtx.scale(pixelRatio, pixelRatio);
        wordcloud2_1.default(this._targetCanvas, this.options);
    };
    WordCloudLayer.prototype._handleG2PlotConfig = function () {
        var fontSize = this.options.wordStyle.fontSize || [10, 60];
        var rotation = this.options.wordStyle.rotation || [-Math.PI / 2, Math.PI / 2];
        var active, shadowColor, shadowBlur;
        if (this.options.wordStyle.active) {
            active = true;
            shadowColor = this.options.wordStyle.active.shadowColor || '#333';
            shadowBlur = this.options.wordStyle.active.shadowBlur || 10;
        }
        else {
            active = false;
        }
        this.options = util_1.deepMix({}, this.options, {
            minFontSize: fontSize[0],
            maxFontSize: fontSize[1],
            minRotation: rotation[0],
            maxRotation: rotation[1],
            active: active,
            shadowColor: shadowColor,
            shadowBlur: shadowBlur,
        });
    };
    WordCloudLayer.prototype._startWithMaskImage = function (image) {
        var _a = this._scaleMaskImageCanvas(this._transformWhite2BlackPixels(image)), maskImageCanvas = _a.maskImageCanvas, maskImageContext = _a.maskImageContext;
        /* Determine bgPixel by creating
         another canvas and fill the specified background color. */
        var bctx = document.createElement('canvas').getContext('2d');
        bctx.fillStyle = this.options.backgroundColor || '#fff';
        bctx.fillRect(0, 0, 1, 1);
        var bgPixel = bctx.getImageData(0, 0, 1, 1).data;
        var imageData = maskImageContext.getImageData(0, 0, maskImageCanvas.width, maskImageCanvas.height);
        var newImageData = maskImageContext.createImageData(imageData);
        for (var i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] > 128) {
                // keep this area's data the same as pixel color
                newImageData.data[i] = bgPixel[0];
                newImageData.data[i + 1] = bgPixel[1];
                newImageData.data[i + 2] = bgPixel[2];
                newImageData.data[i + 3] = bgPixel[3];
            }
            else {
                // This color must not be the same as the bgPixel.
                // check wordcloud2.js#1192 's condition
                newImageData.data[i] = bgPixel[0];
                newImageData.data[i + 1] = bgPixel[1];
                newImageData.data[i + 2] = bgPixel[2];
                newImageData.data[i + 3] = 254; // just for not same as the bg color
            }
        }
        maskImageContext.putImageData(newImageData, 0, 0);
        var targetCtx = this._targetCanvas.getContext('2d');
        targetCtx.drawImage(maskImageCanvas, 0, 0);
        this.options = util_1.deepMix({}, this.options, { clearCanvas: false });
        this._start();
    };
    WordCloudLayer.prototype._scaleMaskImageCanvas = function (maskImageCanvas) {
        var maskCanvasScaled = document.createElement('canvas');
        // get real canvas determined by pixelRatio
        maskCanvasScaled.width = this.canvas.get('width');
        maskCanvasScaled.height = this.canvas.get('height');
        var ctx = maskCanvasScaled.getContext('2d');
        // keep scale smooth
        ctx.imageSmoothingEnabled = true;
        // ctx.mozImageSmoothingEnabled = true;
        // ctx.webkitImageSmoothingEnabled = true;
        // ctx.msImageSmoothingEnabled = true;
        ctx.drawImage(maskImageCanvas, 0, 0, maskImageCanvas.width, maskImageCanvas.height, 0, 0, maskCanvasScaled.width, maskCanvasScaled.height);
        return {
            maskImageCanvas: maskCanvasScaled,
            maskImageContext: ctx,
        };
    };
    WordCloudLayer.prototype._transformWhite2BlackPixels = function (image) {
        var maskImageCanvas = document.createElement('canvas');
        maskImageCanvas.width = image.width;
        maskImageCanvas.height = image.height;
        var ctx = maskImageCanvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        var imageData = ctx.getImageData(0, 0, maskImageCanvas.width, maskImageCanvas.height);
        var SINGLE_COMPONENT_SIZE = 4;
        var BLACK_PIXEL = 0;
        var FULL_PIXEL = 255;
        // R - G - B - A
        for (var i = 0; i < imageData.data.length; i += SINGLE_COMPONENT_SIZE) {
            var rgb = imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2];
            var alpha = imageData.data[i + 3];
            if (alpha < 128 || rgb > 250 * 3) {
                // white area(not to draw)
                imageData.data[i] = FULL_PIXEL;
                imageData.data[i + 1] = FULL_PIXEL;
                imageData.data[i + 2] = FULL_PIXEL;
                imageData.data[i + 3] = BLACK_PIXEL;
            }
            else {
                // black area wait to draw(image black silhouette)
                imageData.data[i] = BLACK_PIXEL;
                imageData.data[i + 1] = BLACK_PIXEL;
                imageData.data[i + 2] = BLACK_PIXEL;
                imageData.data[i + 3] = FULL_PIXEL;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return maskImageCanvas;
    };
    return WordCloudLayer;
}(layer_1.default));
exports.default = WordCloudLayer;
//# sourceMappingURL=layer.js.map