exports.ids = [9,8];
exports.modules = {

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatIds", function() { return creatIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLevels", function() { return getLevels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEqual", function() { return isEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "combInArray", function() { return combInArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCombFlags", function() { return getCombFlags; });
// skus: [{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}],
// output：1-11_2-22
const creatIds = skus => skus.reduce((total, prev, index) => `${total}${prev.k_id}-${prev.v_id}${index === skus.length - 1 ? '' : '_'}`, ''); // 计算每个sku后面有多少项

function getLevels(tree) {
  const level = [];

  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].leaf) {
      level[i] = tree[i + 1].leaf.length * level[i + 1] || 1;
    } else {
      level[i] = 1;
    }
  }

  return level;
}
/**
 * 笛卡尔积运算
 * @param  {[type]} tree   [description]
 * @param  {Array}  stocks [description]
 * @return {[type]}        [description]
 */

function flatten(tree, stocks = [], options) {
  const {
    optionValue = 'id',
    optionText = 'value'
  } = options || {};
  const result = [];
  let skuLen = 0;
  const stockMap = {}; // 记录已存在的stock的数据

  const level = getLevels(tree);
  if (tree.length === 0) return result;
  tree.forEach(sku => {
    const {
      leaf
    } = sku;
    if (!leaf || leaf.length === 0) return true;
    skuLen = (skuLen || 1) * leaf.length;
  }); // 根据已有的stocks生成一个map

  stocks.forEach(stock => {
    const {
      skus,
      ...attr
    } = stock;
    stockMap[skus.map(item => `${item.k_id}_${item.v_id}`).join('|')] = attr;
  });

  for (let i = 0; i < skuLen; i++) {
    const skus = [];
    const mapKey = [];
    tree.forEach((sku, column) => {
      const {
        leaf
      } = sku;
      let item = {};
      if (!leaf || leaf.length === 0) return true;

      if (leaf.length > 1) {
        const row = parseInt(i / level[column], 10) % leaf.length;
        item = tree[column].leaf[row];
      } else {
        item = tree[column].leaf[0];
      }

      if (!sku[optionValue] || !item[optionValue]) return;
      mapKey.push(`${sku[optionValue]}_${item[optionValue]}`);
      skus.push({
        k_id: sku[optionValue],
        k: sku[optionText],
        v_id: item[optionValue],
        v: item[optionText]
      });
    });
    const { ...data
    } = stockMap[mapKey.join('|')] || {}; // 从map中找出存在的sku并保留其值

    result.push({ ...data,
      skus
    });
  }

  return result;
}
/**
 * 判断两个sku是否相同
 * @param  {[type]}  prevSKU [description]
 * @param  {[type]}  nextSKU [description]
 * @return {Boolean}         [description]
 */

function isEqual(prevSKU, nextSKU, options) {
  const {
    optionValue = 'id'
  } = options || {};
  return nextSKU.length === prevSKU.length && nextSKU.every(({
    leaf = []
  }, index) => {
    const prevLeaf = prevSKU[index].leaf || [];
    return prevSKU[index][optionValue] === nextSKU[index][optionValue] && leaf.length === prevLeaf.length && leaf.map(item => item[optionValue]).join(',') === prevLeaf.map(item => item[optionValue]).join(',');
  });
}
/**
 * 从数组中生成指定长度的组合
 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
 */

function combInArray(aData) {
  if (!aData || !aData.length) {
    return [];
  }

  var len = aData.length;
  var aResult = [];
  var ids = [];

  for (var n = 1; n < len; n++) {
    var aaFlags = getCombFlags(len, n);

    while (aaFlags.length) {
      var aFlag = aaFlags.shift();
      var aComb = [];

      for (var i = 0; i < len; i++) {
        aFlag[i] && aComb.push(aData[i]['v_id']);
      }

      aResult.push(aComb);
    }
  }

  for (var n = 0; n < len; n++) {
    ids.push(aData[n].v_id);
  }

  aResult.push(ids);
  return aResult;
}
/**
 * 得到从 m 元素中取 n 元素的所有组合
 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
 */

function getCombFlags(m, n) {
  if (!n || n < 1) {
    return [];
  }

  var aResult = [];
  var aFlag = [];
  var bNext = true;
  var i, j, iCnt1;

  for (i = 0; i < m; i++) {
    aFlag[i] = i < n ? 1 : 0;
  }

  aResult.push(aFlag.concat());

  while (bNext) {
    iCnt1 = 0;

    for (i = 0; i < m - 1; i++) {
      if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
        for (j = 0; j < i; j++) {
          aFlag[j] = j < iCnt1 ? 1 : 0;
        }

        aFlag[i] = 0;
        aFlag[i + 1] = 1;
        var aTmp = aFlag.concat();
        aResult.push(aTmp);

        if (aTmp.slice(-n).join("").indexOf('0') == -1) {
          bNext = false;
        }

        break;
      }

      aFlag[i] == 1 && iCnt1++;
    }
  }

  return aResult;
}

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "param2Data", function() { return /* binding */ param2Data; });

// CONCATENATED MODULE: ./plugins/index.js
/**
 * @returns {string}
 */
function createUniqueString() {
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return randomNum + new Date().getMilliseconds();
}
// EXTERNAL MODULE: ./components/Sku/utils.js
var utils = __webpack_require__(191);

// CONCATENATED MODULE: ./components/Sku/sku2param.js



function objectValues(obj) {
  var res = [];

  for (var i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      res.push(obj[i]);
    }
  }

  return res;
}

function param2Data(product_skus_data) {
  // product_skus_data 数据结构请参考 `/src/components/mock.js`
  if (!product_skus_data || !product_skus_data.length) return;
  const specificationObj = {}; // 储存所有 spec 的随机生成的 id

  const spec_id_dict = {// '颜色': 'xxxid',
    // '皮质': 'xxxid',
  }; // 储存所有 option 的随机生成的 id

  const option_id_dict = {// '红色': 'xxxid',
    // '绿色': 'xxxid',
    // '蓝色': 'xxxid',
    // '一级皮': 'xxxid',
    // '二级皮': 'xxxid',
    // '三级皮': 'xxxid',
  };
  const productSkus = product_skus_data.map(item => {
    const skusObj = { ...item,
      product_sku_id: item.id,
      skus: item.product_sku.map((sku, index) => {
        // const spec_random_id = createUniqueString() + '_id'
        // const option_random_id = createUniqueString() + '_id'
        const spec_random_id = 'sku' + createUniqueString();
        const option_random_id = 'sku' + createUniqueString(); // 加上 if ，防止 dict 里的 id 被覆盖，每次只记录第一次生成的 id

        if (!spec_id_dict[sku.key]) spec_id_dict[sku.key] = spec_random_id;
        if (!option_id_dict[sku.value]) option_id_dict[sku.value] = option_random_id;
        const sepc_id = spec_id_dict[sku.key];
        const option_id = option_id_dict[sku.value];
        specificationObj[sku.key] = {
          value: sku.key,
          id: sepc_id,
          leaf: { ...(specificationObj[sku.key] ? specificationObj[sku.key].leaf : {}),
            [sku.value]: {
              value: sku.value,
              id: option_id,
              selected: false,
              disabled: false
            }
          }
        };
        return {
          k_id: sepc_id,
          k: sku.key,
          v_id: option_id,
          v: sku.value
        };
      })
    };
    return { ...skusObj,
      ids: Object(utils["creatIds"])(skusObj.skus),
      data: Object(utils["combInArray"])(skusObj.skus)
    };
  });
  const specification = objectValues(specificationObj).map(item => ({ ...item,
    leaf: objectValues(item.leaf)
  }));
  return {
    productSkus,
    specification
  };
}

/***/ })

};;
//# sourceMappingURL=sku2param.js.map