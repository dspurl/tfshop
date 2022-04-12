import _app from './app.js';
import QRCodeAlg from './QRCodeAlg.js';
import { base64ToPath } from './image-tools.js';
const ShreUserPosterBackgroundKey = 'ShrePosterBackground_'; // 背景图片缓存名称前缀
const idKey = 'QSSHAREPOSTER_IDKEY'; //drawArray自动生成的idkey
var isMp = false;
// #ifdef MP
isMp = true;
// #endif

var nbgScale = 1;
// export default 
function getSharePoster(obj) {
	return new Promise(async (resolve, reject) => {
		try {
			const result1 = await returnPromise(obj);
			resolve(result1);
		} catch (e) {
			//TODO handle the exception
			try {
				if(obj.bgScale) {
					obj.bgScale = Number(obj.bgScale) - 0.1
				}else{
					nbgScale = nbgScale - 0.1
				}
				console.log('------------清除缓存后, 开始第二次尝试------------');
				const result2 = await returnPromise(obj);
				resolve(result2);
			} catch (e) {
				//TODO handle the exception
				reject(e);
			}
		}
	})

}

function returnPromise(obj) {
	let {
		type,
		formData,
		background,
		posterCanvasId,
		backgroundImage,
		reserve,
		textArray,
		drawArray,
		qrCodeArray,
		imagesArray,
		setCanvasWH,
		setCanvasToTempFilePath,
		setDraw,
		bgScale,
		Context,
		_this,
		delayTimeScale,
		drawDelayTime
	} = obj;
	return new Promise(async (rs, rj) => {
		try {
			_app.showLoading('正在准备海报数据');
			if (!Context) {
				Context = uni.createCanvasContext(posterCanvasId, (_this || null));
			}
			let bgObj;
			if (background && background.width && background.height) {
				bgObj = background;
			} else {
				bgObj = await getShreUserPosterBackground({
					backgroundImage,
					type,
					formData
				});
			}
			bgScale = bgScale || nbgScale;
			bgObj.width = bgObj.width * bgScale;
			bgObj.height = bgObj.height * bgScale;

			const params = {
				bgObj,
				type,
				bgScale,
				getBgObj: function() {
					return params.bgObj;
				},
				setBgObj: function(newBgObj){
					const n = {...params.bgObj, ...newBgObj};
					params.bgObj = n;
					bgObj = n;
				}
			};
			if (imagesArray) {
				if (typeof(imagesArray) == 'function')
					imagesArray = imagesArray(params);
				_app.showLoading('正在生成需绘制图片的临时路径');
				imagesArray = await setImage(imagesArray);
				_app.hideLoading();
			}
			if (textArray) {
				if (typeof(textArray) == 'function')
					textArray = textArray(params);
				textArray = setText(Context, textArray);

			}
			if (qrCodeArray) {
				if (typeof(qrCodeArray) == 'function')
					qrCodeArray = qrCodeArray(params);
				_app.showLoading('正在生成需绘制图片的临时路径');
				for (let i = 0; i < qrCodeArray.length; i++) {
					if (qrCodeArray[i].image)
						qrCodeArray[i].image = await _app.downloadFile_PromiseFc(qrCodeArray[i].image);
				}
				_app.hideLoading();
			}
			if (drawArray) {
				if (typeof(drawArray) == 'function') {
					drawArray = drawArray(params);
				}
				if (_app.isPromise(drawArray)) {
					drawArray = await drawArray;
				}

				if (_app.isArray(drawArray) && drawArray.length > 0) {
					let hasAllInfoCallback = false;
					for (let i = 0; i < drawArray.length; i++) {
						const drawArrayItem = drawArray[i];
						if (_app.isFn(drawArrayItem.allInfoCallback) && !hasAllInfoCallback) hasAllInfoCallback = true;
						drawArrayItem[idKey] = i;
						let newData;
						switch (drawArrayItem.type) {
							case 'image':
								newData = await setImage(drawArrayItem);
								break;
							case 'text':
								newData = setText(Context, drawArrayItem);
								break;
							case 'qrcode':
								if (drawArrayItem.image)
									newData = {
										image: await _app.downloadFile_PromiseFc(drawArrayItem.image)
									};
								break;
							case 'custom':
								break;
							case 'fillrect':
								break;
							case 'strokeRect':
								break;
							case 'roundStrokeRect':
								break;
							case 'roundFillRect':
								break;
							default:
								_app.log('未识别的类型');
								break;
						}
						if (newData && _app.isObject(newData)) {
							drawArray[i] = { ...drawArrayItem,
								...newData
							}
						};
					}

					if (hasAllInfoCallback) {
						const drawArray_copy = [...drawArray];
						drawArray_copy.sort((a, b) => {
							const a_serialNum = !_app.isUndef(a.serialNum) && !_app.isNull(a.serialNum) ? Number(a.serialNum) : Number.NEGATIVE_INFINITY;
							const b_serialNum = !_app.isUndef(b.serialNum) && !_app.isNull(b.serialNum) ? Number(b.serialNum) : Number.NEGATIVE_INFINITY;
							return a_serialNum - b_serialNum;
						})
						for (let i = 0; i < drawArray_copy.length; i++) {
							const item = { ...drawArray_copy[i]
							};
							if (_app.isFn(item.allInfoCallback)) {
								let newData = item.allInfoCallback({
									drawArray
								});
								if (_app.isPromise(newData)) newData = await newData;
								const item_idKey = item[idKey];
								if (!_app.isUndef(item_idKey)) {
									drawArray[item[idKey]] = { ...item,
										...newData
									};
								} else {
									console.log('程序错误 找不到idKey!!!	...这不应该啊');
								}
							}
						}
					}
				}
			}
			if (setCanvasWH && typeof(setCanvasWH) == 'function') {
				await new Promise((resolve, reject)=>{
					setCanvasWH(params);
					setTimeout(()=>{
						resolve();
					}, 50)
				})
			}
			const poster = await drawShareImage({
				Context,
				type,
				posterCanvasId,
				reserve,
				drawArray,
				textArray,
				imagesArray,
				bgObj,
				qrCodeArray,
				setCanvasToTempFilePath,
				setDraw,
				bgScale,
				_this,
				delayTimeScale,
				drawDelayTime
			});
			_app.hideLoading();
			rs({
				bgObj,
				poster,
				type
			});
		} catch (e) {
			//TODO handle the exception
			rj(e);
		}
	});
}

function drawShareImage(obj) { //绘制海报方法
	let {
		Context,
		type,
		posterCanvasId,
		reserve,
		bgObj,
		drawArray,
		textArray,
		qrCodeArray,
		imagesArray,
		setCanvasToTempFilePath,
		setDraw,
		bgScale,
		_this,
		delayTimeScale,
		drawDelayTime
	} = obj;
	const params = {
		Context,
		bgObj,
		type,
		bgScale
	};
	delayTimeScale = delayTimeScale !== undefined ? delayTimeScale : 15;
	drawDelayTime = drawDelayTime !== undefined ? drawDelayTime : 100;
	return new Promise((rs, rj) => {
		try {
			_app.showLoading('正在绘制海报');
			if (bgObj && bgObj.path) {
				Context.drawImage(bgObj.path, 0, 0, bgObj.width, bgObj.height);
			} else {
				if (bgObj.backgroundColor) {
					Context.setFillStyle(bgObj.backgroundColor);
					Context.fillRect(0, 0, bgObj.width, bgObj.height);
				} else {
				}
			}

			if (imagesArray && imagesArray.length > 0)
				drawImage(Context, imagesArray);

			if (setDraw && typeof(setDraw) == 'function') setDraw(params);

			if (textArray && textArray.length > 0)
				drawText(Context, textArray, bgObj);

			if (qrCodeArray && qrCodeArray.length > 0) {
				for (let i = 0; i < qrCodeArray.length; i++) {
					drawQrCode(Context, qrCodeArray[i]);
				}
			}

			if (drawArray && drawArray.length > 0) {
				for (let i = 0; i < drawArray.length; i++) {
					const drawArrayItem = drawArray[i];
					switch (drawArrayItem.type) {
						case 'image':
							drawImage(Context, drawArrayItem);
							break;
						case 'text':
							drawText(Context, drawArrayItem, bgObj);
							break;
						case 'qrcode':
							drawQrCode(Context, drawArrayItem);
							break;
						case 'custom':
							if (drawArrayItem.setDraw && typeof drawArrayItem.setDraw === 'function')
								drawArrayItem.setDraw(Context);
							break;drawRoundStrokeRect, drawStrokeRect
						case 'fillRect':
							drawFillRect(Context, drawArrayItem);
							break;
						case 'strokeRect':
							drawStrokeRect(Context, drawArrayItem);
							break;
						case 'roundStrokeRect':
							drawRoundStrokeRect(Context, drawArrayItem);
							break;
						case 'roundFillRect':
							drawRoundFillRect(Context, drawArrayItem);
							break;
						default:
							_app.log('未识别的类型');
							break;
					}
				}
			}
			_app.showLoading('绘制中')
			setTimeout(() => {
				const fn = function(){
					_app.showLoading('正在输出图片');
					let setObj = setCanvasToTempFilePath || {};
					if (setObj && typeof(setObj) == 'function')
						setObj = setCanvasToTempFilePath(bgObj, type);
					let canvasToTempFilePathFn;
					const data = {
						x: 0,
						y: 0,
						width: Number(bgObj.width),
						height: Number(bgObj.height),
						destWidth: Number(bgObj.width), // 若H5使用这里请不要乘以二
						destHeight: Number(bgObj.height), // 若H5使用这里请不要乘以二
						quality: .8,
						fileType: 'jpg',
						...setObj
					};
					canvasToTempFilePathFn = function() {
						const toTempFilePathObj = { //输出为图片
							...data,
							canvasId: posterCanvasId,
							success(res) {
								_app.hideLoading();
								rs(res);
							},
							fail(err) {
								_app.hideLoading();
								rj('输出图片失败:' + JSON.stringify(err))
							}
						}
						uni.canvasToTempFilePath(toTempFilePathObj, _this || null);
					}
					let delayTime = 0;
					if (qrCodeArray) {
						qrCodeArray.forEach(item => {
							if (item.text) {
								delayTime += Number(item.text.length);
							}
						})
					}
					if (imagesArray) {
						imagesArray.forEach(() => {
							delayTime += delayTimeScale;
						})
					}
					if (textArray) {
						textArray.forEach(() => {
							delayTime += delayTimeScale;
						})
					}
					if (drawArray) {
						drawArray.forEach(item => {
							switch (item.type) {
								case 'text':
									if (item.text) {
										delayTime += item.text.length;
									}
									break;
								default:
									delayTime += delayTimeScale;
									break;
							}
						})
					}
					setTimeout(canvasToTempFilePathFn, delayTime);
				}
				Context.draw((typeof(reserve) == 'boolean' ? reserve : false), fn);
			}, drawDelayTime);
		} catch (e) {
			//TODO handle the exception
			_app.hideLoading();
			rj(e);
		}
	});
}

// export
function drawFillRect(Context, drawArrayItem = {}) {	//填充矩形
	Context.setFillStyle(drawArrayItem.backgroundColor || 'black');
	Context.setGlobalAlpha(drawArrayItem.alpha || 1);
	Context.fillRect(drawArrayItem.dx || 0, drawArrayItem.dy || 0, drawArrayItem.width || 0, drawArrayItem.height || 0);
	Context.setGlobalAlpha(1);
}

// export
function drawStrokeRect(Context, drawArrayItem = {}) {	//线条矩形
	Context.setStrokeStyle(drawArrayItem.color||'black');
	Context.setLineWidth(drawArrayItem.lineWidth || 1);
	Context.strokeRect(drawArrayItem.dx, drawArrayItem.dy, drawArrayItem.width, drawArrayItem.height);
}

// export
function drawRoundStrokeRect(Context, drawArrayItem = {}) {
	let { dx, dy, width, height, r, lineWidth, color } = drawArrayItem;
	r = r || width * .1;

	if (width < 2 * r) {
		r = width / 2;
	}
	if (width < 2 * r) {
		r = width / 2;
	}
	Context.beginPath();
	Context.moveTo(dx + r, dy);
	Context.arcTo(dx + width, dy, dx + width, dy + height, r);
	Context.arcTo(dx + width, dy + height, dx, dy + height, r);
	Context.arcTo(dx, dy + height, dx, dy, r);
	Context.arcTo(dx, dy, dx + width, dy, r);
	Context.closePath();
	Context.setLineWidth(lineWidth || 1);
	Context.setStrokeStyle(color || 'black');
	Context.stroke();
}

// export
function drawRoundFillRect(Context, drawArrayItem = {}) {
	let { dx, dy, width, height, r, backgroundColor } = drawArrayItem;
	r = r || width * .1;

	if (width < 2 * r) {
		r = width / 2;
	}
	if (width < 2 * r) {
		r = width / 2;
	}
	Context.beginPath();
	Context.moveTo(dx + r, dy);
	Context.arcTo(dx + width, dy, dx + width, dy + height, r);
	Context.arcTo(dx + width, dy + height, dx, dy + height, r);
	Context.arcTo(dx, dy + height, dx, dy, r);
	Context.arcTo(dx, dy, dx + width, dy, r);
	Context.closePath();
	Context.setFillStyle(backgroundColor);
	Context.fill();
}

// export 
function setText(Context, texts) { // 设置文本数据
	if (texts && _app.isArray(texts)) {
		if (texts.length > 0) {
			for (let i = 0; i < texts.length; i++) {
				texts[i] = setTextFn(Context, texts[i]);
			}
		}
	} else {
		texts = setTextFn(Context, texts);
	}
	return texts;
}

function setTextFn(Context, textItem) {
	if (_app.isNotNull_string(textItem.text)) {
		textItem.text = String(textItem.text);
		textItem.alpha = textItem.alpha !== undefined ? Number(textItem.alpha) : 1;
		textItem.color = textItem.color || 'black';
		textItem.size = textItem.size !== undefined ? Number(textItem.size) : 10;
		textItem.textAlign = textItem.textAlign || 'left';
		textItem.textBaseline = textItem.textBaseline || 'middle';
		textItem.dx = Number(textItem.dx) || 0;
		textItem.dy = Number(textItem.dy) || 0;
		textItem.size = Math.ceil(Number(textItem.size));
		const textLength = countTextLength(Context, {
			text: textItem.text,
			size: textItem.size
		});
		let infoCallBackObj = {};
		if (textItem.infoCallBack && typeof(textItem.infoCallBack) === 'function') {
			infoCallBackObj = textItem.infoCallBack(textLength);
		}
		textItem = {
			...textItem,
			textLength,
			...infoCallBackObj
		}
	}
	return textItem;
}

function countTextLength(Context, obj) {
	const {
		text,
		size
	} = obj;
	Context.setFontSize(size);
	let textLength;
	try{
		textLength = Context.measureText(text); // 官方文档说 App端自定义组件编译模式暂时不可用measureText方法
	}catch(e){
		//TODO handle the exception
		textLength = {};
	}
	textLength = {};
	textLength = textLength && textLength.width ? textLength.width : 0;
	if (!textLength) {
		let l = 0;
		for (let j = 0; j < text.length; j++) {
			let t = text.substr(j, 1);
			const countL = countStrLength(t);
			l += countL;
		}
		textLength = l * size;
	}
	return textLength;
}

//计算字符长度系数
function countStrLength(t) {
	let l;
	if (/a/.test(t)) {
		l = 0.552734375
	} else if (/b/.test(t)) {
		l = 0.638671875
	} else if (/c/.test(t)) {
		l = 0.50146484375
	} else if (/d/.test(t)) {
		l = 0.6396484375
	} else if (/e/.test(t)) {
		l = 0.5673828125
	} else if (/f/.test(t)) {
		l = 0.3466796875
	} else if (/g/.test(t)) {
		l = 0.6396484375
	} else if (/h/.test(t)) {
		l = 0.61572265625
	} else if (/i/.test(t)) {
		l = 0.26611328125
	} else if (/j/.test(t)) {
		l = 0.26708984375
	} else if (/k/.test(t)) {
		l = 0.54443359375
	} else if (/l/.test(t)) {
		l = 0.26611328125
	} else if (/m/.test(t)) {
		l = 0.93701171875
	} else if (/n/.test(t)) {
		l = 0.6162109375
	} else if (/o/.test(t)) {
		l = 0.6357421875
	} else if (/p/.test(t)) {
		l = 0.638671875
	} else if (/q/.test(t)) {
		l = 0.6396484375
	} else if (/r/.test(t)) {
		l = 0.3818359375
	} else if (/s/.test(t)) {
		l = 0.462890625
	} else if (/t/.test(t)) {
		l = 0.37255859375
	} else if (/u/.test(t)) {
		l = 0.6162109375
	} else if (/v/.test(t)) {
		l = 0.52490234375
	} else if (/w/.test(t)) {
		l = 0.78955078125
	} else if (/x/.test(t)) {
		l = 0.5068359375
	} else if (/y/.test(t)) {
		l = 0.529296875
	} else if (/z/.test(t)) {
		l = 0.49169921875
	} else if (/A/.test(t)) {
		l = 0.70361328125
	} else if (/B/.test(t)) {
		l = 0.62744140625
	} else if (/C/.test(t)) {
		l = 0.6689453125
	} else if (/D/.test(t)) {
		l = 0.76171875
	} else if (/E/.test(t)) {
		l = 0.5498046875
	} else if (/F/.test(t)) {
		l = 0.53125
	} else if (/G/.test(t)) {
		l = 0.74365234375
	} else if (/H/.test(t)) {
		l = 0.7734375
	} else if (/I/.test(t)) {
		l = 0.2939453125
	} else if (/J/.test(t)) {
		l = 0.39599609375
	} else if (/K/.test(t)) {
		l = 0.634765625
	} else if (/L/.test(t)) {
		l = 0.51318359375
	} else if (/M/.test(t)) {
		l = 0.97705078125
	} else if (/N/.test(t)) {
		l = 0.81298828125
	} else if (/O/.test(t)) {
		l = 0.81494140625
	} else if (/P/.test(t)) {
		l = 0.61181640625
	} else if (/Q/.test(t)) {
		l = 0.81494140625
	} else if (/R/.test(t)) {
		l = 0.65283203125
	} else if (/S/.test(t)) {
		l = 0.5771484375
	} else if (/T/.test(t)) {
		l = 0.5732421875
	} else if (/U/.test(t)) {
		l = 0.74658203125
	} else if (/V/.test(t)) {
		l = 0.67626953125
	} else if (/W/.test(t)) {
		l = 1.017578125
	} else if (/X/.test(t)) {
		l = 0.64501953125
	} else if (/Y/.test(t)) {
		l = 0.603515625
	} else if (/Z/.test(t)) {
		l = 0.6201171875
	} else if (/[0-9]/.test(t)) {
		l = 0.58642578125
	} else if (/[\u4e00-\u9fa5]/.test(t)) {
		l = 1
	} else if (/ /.test(t)) {
		l = 0.2958984375
	} else if (/\`/.test(t)) {
		l = 0.294921875
	} else if (/\~/.test(t)) {
		l = 0.74169921875
	} else if (/\!/.test(t)) {
		l = 0.3125
	} else if (/\@/.test(t)) {
		l = 1.03125
	} else if (/\#/.test(t)) {
		l = 0.63818359375
	} else if (/\$/.test(t)) {
		l = 0.58642578125
	} else if (/\%/.test(t)) {
		l = 0.8896484375
	} else if (/\^/.test(t)) {
		l = 0.74169921875
	} else if (/\&/.test(t)) {
		l = 0.8701171875
	} else if (/\*/.test(t)) {
		l = 0.455078125
	} else if (/\(/.test(t)) {
		l = 0.333984375
	} else if (/\)/.test(t)) {
		l = 0.333984375
	} else if (/\_/.test(t)) {
		l = 0.4482421875
	} else if (/\-/.test(t)) {
		l = 0.4326171875
	} else if (/\+/.test(t)) {
		l = 0.74169921875
	} else if (/\=/.test(t)) {
		l = 0.74169921875
	} else if (/\|/.test(t)) {
		l = 0.26904296875
	} else if (/\\/.test(t)) {
		l = 0.416015625
	} else if (/\[/.test(t)) {
		l = 0.333984375
	} else if (/\]/.test(t)) {
		l = 0.333984375
	} else if (/\;/.test(t)) {
		l = 0.24072265625
	} else if (/\'/.test(t)) {
		l = 0.25634765625
	} else if (/\,/.test(t)) {
		l = 0.24072265625
	} else if (/\./.test(t)) {
		l = 0.24072265625
	} else if (/\//.test(t)) {
		l = 0.42724609375
	} else if (/\{/.test(t)) {
		l = 0.333984375
	} else if (/\}/.test(t)) {
		l = 0.333984375
	} else if (/\:/.test(t)) {
		l = 0.24072265625
	} else if (/\"/.test(t)) {
		l = 0.435546875
	} else if (/\</.test(t)) {
		l = 0.74169921875
	} else if (/\>/.test(t)) {
		l = 0.74169921875
	} else if (/\?/.test(t)) {
		l = 0.48291015625
	} else {
		l = 1
	}
	return l;
}

// export 
function setImage(images) { // 设置图片数据
	return new Promise(async (resolve, rejcet) => {
		try {
			if (images && _app.isArray(images)) {
				for (let i = 0; i < images.length; i++) {
					images[i] = await setImageFn(images[i]);
				}
			} else {
				images = await setImageFn(images);
			}
			resolve(images);
		} catch (e) {
			//TODO handle the exception
			rejcet(e);
		}
	})
}

function base64ToPathFn(path) {
	var reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
	if(!reg.test(path)){
	  return Promise.resolve(path);
	}
	return base64ToPath(path);
}

function setImageFn(image) {
	return new Promise(async (resolve, reject) => {
		if (image.url) {
			image.url = (await base64ToPathFn(image.url));
			let imgUrl = image.url;
			imgUrl = await _app.downloadFile_PromiseFc(imgUrl);
			image.url = imgUrl;
			const hasinfoCallBack = image.infoCallBack && typeof(image.infoCallBack) === 'function';
			let imageInfo = {};
			imageInfo = await _app.getImageInfo_PromiseFc(imgUrl);
			if (hasinfoCallBack) {
				image = {
					...image,
					...image.infoCallBack(imageInfo)
				};
			}
			image.dx = Number(image.dx) || 0;
			image.dy = Number(image.dy) || 0;
			image.dWidth = Number(image.dWidth || imageInfo.width);
			image.dHeight = Number(image.dHeight || imageInfo.height);
			image = {
				...image,
				imageInfo
			}
		}
		resolve(image);
	})
}

// export 
function drawText(Context, textArray, bgObj) { // 先遍历换行再绘制
	if (!_app.isArray(textArray)) {
		textArray = [textArray];
	} else {
	}
	const newArr = [];
	if (textArray && textArray.length > 0) {
		for (let j = 0; j < textArray.length; j++) {
			const textItem = textArray[j];
			if (textItem.text && textItem.lineFeed) {
				let lineNum = -1,
					maxWidth = bgObj.width,
					lineHeight = textItem.size,
					dx = textItem.dx;
				if (_app.isObject(textItem.lineFeed)) {
					const lineFeed = textItem.lineFeed;
					lineNum = (lineFeed.lineNum !== undefined && typeof(lineFeed.lineNum) === 'number') && lineFeed.lineNum >= 0 ?
						lineFeed.lineNum : lineNum;
					maxWidth = (lineFeed.maxWidth !== undefined && typeof(lineFeed.maxWidth) === 'number') ? lineFeed.maxWidth :
						maxWidth;
					lineHeight = (lineFeed.lineHeight !== undefined && typeof(lineFeed.lineHeight) === 'number') ? lineFeed.lineHeight :
						lineHeight;
					dx = (lineFeed.dx !== undefined && typeof(lineFeed.dx) === 'number') ? lineFeed.dx : dx;
				}
				const chr = (textItem.text).split("");
				let temp = "";
				const row = [];
				//循环出几行文字组成数组
				for (let a = 0, len = chr.length; a < len; a++) {
					if (countTextLength(Context, {
							text: temp,
							size: textItem.size
						}) <= maxWidth && countTextLength(Context, {
							text: (temp + chr[a]),
							size: textItem.size
						}) <= maxWidth) {
						temp += chr[a];
						if (a == (chr.length - 1)) {
							row.push(temp);
						}
					} else {
						row.push(temp);
						temp = chr[a];
					}
				}
				//只显示几行 变量间距lineHeight  变量行数lineNum
				let allNum = (lineNum >= 0 && lineNum < row.length) ? lineNum : row.length;

				for (let i = 0; i < allNum; i++) {
					let str = row[i];
					if (i == (allNum - 1) && allNum < row.length) {
						str = str.substring(0, str.length - 1) + '...';
					}
					const obj = { ...textItem,
						text: str,
						dx: i === 0 ? textItem.dx : (dx >= 0 ? dx : textItem.dx),
						dy: textItem.dy + (i * lineHeight),
						textLength: countTextLength(Context, {
							text: str,
							size: textItem.size
						})
					};
					newArr.push(obj);
				}
			} else {
				newArr.push(textItem);
			}
		}
	}
	drawTexts(Context, newArr);
}

function setFont(textItem = {}) {
	if (textItem.font && typeof(textItem.font) === 'string') {
		return textItem.font;
	} else {
		let fontStyle = 'normal';
		let fontVariant = 'normal';
		let fontWeight = 'normal';
		let fontSize = textItem.size || 10;
		let fontFamily = 'sans-serif';
		fontSize = Math.ceil(Number(fontSize));
		if (textItem.fontStyle && typeof(textItem.fontStyle) === 'string')
			fontStyle = textItem.fontStyle.trim();
		if (textItem.fontVariant && typeof(textItem.fontVariant) === 'string')
			fontVariant = textItem.fontVariant.trim();
		if (textItem.fontWeight && (typeof(textItem.fontWeight) === 'string' || typeof(textItem.fontWeight) === 'number'))
			fontWeight = textItem.fontWeight.trim();
		if (textItem.fontFamily && typeof(textItem.fontFamily) === 'string')
			fontFamily = textItem.fontFamily.trim();
		return fontStyle + ' ' +
			fontVariant + ' ' +
			fontWeight + ' ' +
			fontSize + 'px' + ' ' +
			fontFamily;
	}
}

function drawTexts(Context, texts) { // 绘制文本
	if (texts && _app.isArray(texts)) {
		if (texts.length > 0) {
			for (let i = 0; i < texts.length; i++) {
				drawTextFn(Context, texts[i]);
			}
		}
	} else {
		drawTextFn(Context, texts);
	}
}

function drawTextFn(Context, textItem) {
	if (textItem && _app.isObject(textItem) && textItem.text) {
		Context.font = setFont(textItem);
		Context.setFillStyle(textItem.color);
		Context.setGlobalAlpha(textItem.alpha);
		Context.setTextAlign(textItem.textAlign);
		Context.setTextBaseline(textItem.textBaseline);
		Context.fillText(textItem.text, textItem.dx, textItem.dy);
		if (textItem.lineThrough && _app.isObject(textItem.lineThrough)) {
			let lineThrough = textItem.lineThrough;
			lineThrough.alpha = lineThrough.alpha !== undefined ? lineThrough.alpha : textItem.alpha;
			lineThrough.style = lineThrough.style || textItem.color;
			lineThrough.width = lineThrough.width !== undefined ? lineThrough.width : textItem.size / 10;
			lineThrough.cap = lineThrough.cap !== undefined ? lineThrough.cap : 'butt';
			Context.setGlobalAlpha(lineThrough.alpha);
			Context.setStrokeStyle(lineThrough.style);
			Context.setLineWidth(lineThrough.width);
			Context.setLineCap(lineThrough.cap);
			let mx, my;
			switch (textItem.textAlign) {
				case 'left':
					mx = textItem.dx;
					break;
				case 'center':
					mx = textItem.dx - (textItem.textLength) / 2;
					break;
				default:
					mx = textItem.dx - (textItem.textLength);
					break;
			}
			switch (textItem.textBaseline) {
				case 'top':
					my = textItem.dy + (textItem.size * .5);
					break;
				case 'middle':
					my = textItem.dy;
					break;
				default:
					my = textItem.dy - (textItem.size * .5);
					break;
			}
			Context.beginPath();
			Context.moveTo(mx, my);
			Context.lineTo(mx + textItem.textLength, my);
			Context.stroke();
			Context.closePath();
		}
		Context.setGlobalAlpha(1);
		Context.font = '10px sans-serif';
	}
}
// export 
function drawImage(Context, images) { // 绘制图片
	if (images && _app.isArray(images)) {
		if (images.length > 0) {
			for (let i = 0; i < images.length; i++) {
				readyDrawImageFn(Context, images[i]);
			}
		}
	} else {
		readyDrawImageFn(Context, images);
	}

}

function readyDrawImageFn(Context, img) {
	if (img.url) {
		if (img.circleSet) {
			drawCircleImage(Context, img);
		} else if (img.roundRectSet) {
			drawRoundRectImage(Context, img);
		} else {
			drawImageFn(Context, img);
		}
	}
}

function drawImageFn(Context, img) {
	if (img.url) {
		const hasAlpha = !_app.isUndef(img.alpha);
		img.alpha = Number(!_app.isUndef(img.alpha) ? img.alpha : 1);
		Context.setGlobalAlpha(img.alpha);
		if (img.dWidth && img.dHeight && img.sx && img.sy && img.sWidth && img.sHeight) {
			Context.drawImage(img.url, 
			Number(img.sx) || false, Number(img.sy) || false, 
			Number(img.sWidth) || false, Number(img.sHeight) || false,
			Number(img.dx || 0), Number(img.dy || 0),
			Number(img.dWidth) || false, Number(img.dHeight) || false,);
		} else if (img.dWidth && img.dHeight) {
			Context.drawImage(img.url, Number(img.dx || 0), Number(img.dy || 0),
				Number(img.dWidth) || false, Number(img.dHeight) || false);
		} else {
			Context.drawImage(img.url, Number(img.dx || 0), Number(img.dy || 0));
		}
		if (hasAlpha) {
			Context.setGlobalAlpha(1);
		}
	}
}

function drawCircleImage(Context, obj) {
	let {
		dx,
		dy,
		dWidth,
		dHeight,
		circleSet,
		imageInfo
	} = obj;
	let x, y, r;
	if (typeof circleSet === 'object') {
		x = circleSet.x;
		y = circleSet.y;
		r = circleSet.r;
	}
	if (!r) {
		let d;
		d = dWidth > dHeight ? dHeight : dWidth;
		r = d / 2;
	}

	x = x ? dx + x : (dx || 0) + r;
	y = y ? dy + y : (dy || 0) + r;
	Context.save();
	Context.beginPath();
	Context.arc(x, y, r, 0, 2 * Math.PI, false);
	Context.closePath();
	Context.setGlobalAlpha(0);
	Context.fillStyle = '#FFFFFF';
	Context.fill();
	Context.setGlobalAlpha(1);
	Context.clip();
	drawImageFn(Context, obj);
	Context.restore();
}

function drawRoundRectImage(Context, obj) { // 绘制矩形
	Context.save();
	let {
		dx,
		dy,
		dWidth,
		dHeight,
		roundRectSet,
		imageInfo
	} = obj;
	let r;
	if (typeof roundRectSet === 'object') {
		r = roundRectSet.r;
	}
	r = r || dWidth * .1;

	if (dWidth < 2 * r) {
		r = dWidth / 2;
	}
	if (dHeight < 2 * r) {
		r = dHeight / 2;
	}
	Context.beginPath();
	Context.moveTo(dx + r, dy);
	Context.arcTo(dx + dWidth, dy, dx + dWidth, dy + dHeight, r);
	Context.arcTo(dx + dWidth, dy + dHeight, dx, dy + dHeight, r);
	Context.arcTo(dx, dy + dHeight, dx, dy, r);
	Context.arcTo(dx, dy, dx + dWidth, dy, r);
	Context.closePath();
	Context.setGlobalAlpha(0);
	Context.fillStyle = '#FFFFFF';
	Context.fill();
	Context.setGlobalAlpha(1);
	Context.clip();
	drawImageFn(Context, obj);
	Context.restore();
}

// export 
function drawQrCode(Context, qrCodeObj) { //生成二维码方法， 参考了 诗小柒 的二维码生成器代码
	_app.showLoading('正在生成二维码');
	let qrcodeAlgObjCache = [];
	let options = {
		text: String(qrCodeObj.text || '') || '', // 生成内容
		size: Number(qrCodeObj.size || 0) || 200, // 二维码大小
		background: String(qrCodeObj.background || '') || '#ffffff', // 背景色
		foreground: String(qrCodeObj.foreground || '') || '#000000', // 前景色
		pdground: String(qrCodeObj.pdground || '') || '#000000', // 定位角点颜色
		correctLevel: Number(qrCodeObj.correctLevel || 0) || 3, // 容错级别
		image: String(qrCodeObj.image || '') || '', // 二维码图标
		imageSize: Number(qrCodeObj.imageSize || 0) || 40, // 二维码图标大小
		dx: Number(qrCodeObj.dx || 0) || 0, // x轴距离
		dy: Number(qrCodeObj.dy || 0) || 0 // y轴距离
	}
	let qrCodeAlg = null;
	let d = 0;
	for (var i = 0, l = qrcodeAlgObjCache.length; i < l; i++) {
		d = i;
		if (qrcodeAlgObjCache[i].text == options.text && qrcodeAlgObjCache[i].text.correctLevel == options.correctLevel) {
			qrCodeAlg = qrcodeAlgObjCache[i].obj;
			break;
		}
	}
	if (d == l) {
		qrCodeAlg = new QRCodeAlg(options.text, options.correctLevel);
		qrcodeAlgObjCache.push({
			text: options.text,
			correctLevel: options.correctLevel,
			obj: qrCodeAlg
		});
	}
	let getForeGround = function(config) {
		let options = config.options;
		if (options.pdground && (
				(config.row > 1 && config.row < 5 && config.col > 1 && config.col < 5) ||
				(config.row > (config.count - 6) && config.row < (config.count - 2) && config.col > 1 && config.col < 5) ||
				(config.row > 1 && config.row < 5 && config.col > (config.count - 6) && config.col < (config.count - 2))
			)) {
			return options.pdground;
		}
		return options.foreground;
	}
	let count = qrCodeAlg.getModuleCount();
	let ratioSize = options.size;
	let ratioImgSize = options.imageSize;
	//计算每个点的长宽
	let tileW = (ratioSize / count).toPrecision(4);
	let tileH = (ratioSize / count).toPrecision(4);
	//绘制
	for (let row = 0; row < count; row++) {
		for (let col = 0; col < count; col++) {
			let w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
			let h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
			let foreground = getForeGround({
				row: row,
				col: col,
				count: count,
				options: options
			});
			Context.setFillStyle(qrCodeAlg.modules[row][col] ? foreground : options.background);
			Context.fillRect(options.dx + Math.round(col * tileW), options.dy + Math.round(row * tileH), w, h);
		}
	}
	if (options.image) {
		let x = options.dx + Number(((ratioSize - ratioImgSize) / 2).toFixed(2));
		let y = options.dy + Number(((ratioSize - ratioImgSize) / 2).toFixed(2));
		drawRoundedRect(Context, x, y, ratioImgSize, ratioImgSize, 2, 6, true, true)
		Context.drawImage(options.image, x, y, ratioImgSize, ratioImgSize);
		// 画圆角矩形
		function drawRoundedRect(ctxi, x, y, width, height, r, lineWidth, fill, stroke) {
			ctxi.setLineWidth(lineWidth);
			ctxi.setFillStyle(options.background);
			ctxi.setStrokeStyle(options.background);
			ctxi.beginPath(); // draw top and top right corner 
			ctxi.moveTo(x + r, y);
			ctxi.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner 
			ctxi.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner 
			ctxi.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner 
			ctxi.arcTo(x, y, x + r, y, r);
			ctxi.closePath();
			if (fill) {
				ctxi.fill();
			}
			if (stroke) {
				ctxi.stroke();
			}
		}
	}
	_app.hideLoading();
}


function getShreUserPosterBackground(objs) { //检查背景图是否存在于本地， 若存在直接返回， 否则调用getShreUserPosterBackgroundFc方法
	let {
		backgroundImage,
		type
	} = objs;
	return new Promise(async (resolve, reject) => {
		try {
			_app.showLoading('正在获取海报背景图');
			const savedFilePath = await getShreUserPosterBackgroundFc(objs)
			_app.hideLoading();
			resolve(savedFilePath);
		} catch (e) {
			_app.hideLoading();
			_app.showToast('获取分享用户背景图失败:' + JSON.stringify(e));
			reject(e);
		}
	})
}

function getPosterStorage(type) {
	return _app.getStorageSync(getStorageKey(type));
}

function removePosterStorage(type) {
	const ShreUserPosterBackgroundKey = getStorageKey(type);
	const pbg = _app.getStorageSync(ShreUserPosterBackgroundKey);
	if (pbg && pbg.path) {
		_app.removeStorageSync(ShreUserPosterBackgroundKey);
	}
}

function setPosterStorage(type, data) {
	_app.setStorage(getStorageKey(type), data);
}

function getStorageKey(type) {
	return ShreUserPosterBackgroundKey + (type || 'default');
}

function getShreUserPosterBackgroundFc(objs, upimage) { //下载并保存背景图方法
	let {
		backgroundImage,
		type
	} = objs;
	return new Promise(async (resolve, reject) => {
		try {
			_app.showLoading('正在下载海报背景图');
			let image = backgroundImage?backgroundImage:(await _app.getPosterUrl(objs));
			image = (await base64ToPathFn(image));
			const savedFilePath = await _app.downLoadAndSaveFile_PromiseFc(image);
			if (savedFilePath) {
				const imageObj = await _app.getImageInfo_PromiseFc(savedFilePath);
				const returnObj = {
					path: savedFilePath,
					width: imageObj.width,
					height: imageObj.height,
					name: _app.fileNameInPath(image)
				}

				// #ifndef H5
				setPosterStorage(type, { ...returnObj
				});
				// #endif

				_app.hideLoading();
				resolve({ ...returnObj
				});
			} else {
				_app.hideLoading();
				reject('not find savedFilePath');
			}
		} catch (e) {
			//TODO handle the exception
			reject(e);
		}
	});
}


module.exports = {
	getSharePoster,
	setText,
	setImage,
	drawText,
	drawImage,
	drawQrCode,
	drawFillRect,
	drawStrokeRect,
	drawRoundStrokeRect,
	drawRoundFillRect
}
