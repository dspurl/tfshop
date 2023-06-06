exports.ids = [6,7,8,9];
exports.modules = {

/***/ 185:
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
const creatIds = skus => skus.reduce((total, prev, index) => `${total}${prev.k_id}-${prev.v_id}${index === skus.length - 1 ? '' : '_'}`, '');

// 计算每个sku后面有多少项
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
  });
  // 根据已有的stocks生成一个map
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
    const {
      ...data
    } = stockMap[mapKey.join('|')] || {};
    // 从map中找出存在的sku并保留其值
    result.push({
      ...data,
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

/***/ 191:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(202);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("23af186a", content, true, context)
};

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "param2Data", function() { return /* binding */ param2Data; });

// CONCATENATED MODULE: ./plugins/index.js
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
function createUniqueString() {
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return randomNum + new Date().getMilliseconds();
}
// EXTERNAL MODULE: ./components/Sku/utils.js
var utils = __webpack_require__(185);

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
  const specificationObj = {};

  // 储存所有 spec 的随机生成的 id
  const spec_id_dict = {
    // '颜色': 'xxxid',
    // '皮质': 'xxxid',
  };

  // 储存所有 option 的随机生成的 id
  const option_id_dict = {
    // '红色': 'xxxid',
    // '绿色': 'xxxid',
    // '蓝色': 'xxxid',
    // '一级皮': 'xxxid',
    // '二级皮': 'xxxid',
    // '三级皮': 'xxxid',
  };
  const productSkus = product_skus_data.map(item => {
    const skusObj = {
      ...item,
      product_sku_id: item.id,
      skus: item.product_sku.map((sku, index) => {
        // const spec_random_id = createUniqueString() + '_id'
        // const option_random_id = createUniqueString() + '_id'
        const spec_random_id = 'sku' + createUniqueString();
        const option_random_id = 'sku' + createUniqueString();
        // 加上 if ，防止 dict 里的 id 被覆盖，每次只记录第一次生成的 id
        if (!spec_id_dict[sku.key]) spec_id_dict[sku.key] = spec_random_id;
        if (!option_id_dict[sku.value]) option_id_dict[sku.value] = option_random_id;
        const sepc_id = spec_id_dict[sku.key];
        const option_id = option_id_dict[sku.value];
        specificationObj[sku.key] = {
          value: sku.key,
          id: sepc_id,
          leaf: {
            ...(specificationObj[sku.key] ? specificationObj[sku.key].leaf : {}),
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
    return {
      ...skusObj,
      ids: Object(utils["creatIds"])(skusObj.skus),
      data: Object(utils["combInArray"])(skusObj.skus)
    };
  });
  const specification = objectValues(specificationObj).map(item => ({
    ...item,
    leaf: objectValues(item.leaf)
  }));
  return {
    productSkus,
    specification
  };
}

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_esnext_map_delete_all_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);
/* harmony import */ var core_js_modules_esnext_map_delete_all_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_delete_all_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_esnext_map_every_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84);
/* harmony import */ var core_js_modules_esnext_map_every_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_every_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_esnext_map_filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(85);
/* harmony import */ var core_js_modules_esnext_map_filter_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_filter_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_esnext_map_find_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(86);
/* harmony import */ var core_js_modules_esnext_map_find_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_find_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_esnext_map_find_key_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(87);
/* harmony import */ var core_js_modules_esnext_map_find_key_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_find_key_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_esnext_map_includes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(88);
/* harmony import */ var core_js_modules_esnext_map_includes_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_includes_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_esnext_map_key_of_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(89);
/* harmony import */ var core_js_modules_esnext_map_key_of_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_key_of_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_esnext_map_map_keys_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(90);
/* harmony import */ var core_js_modules_esnext_map_map_keys_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_map_keys_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_esnext_map_map_values_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(91);
/* harmony import */ var core_js_modules_esnext_map_map_values_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_map_values_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_esnext_map_merge_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(92);
/* harmony import */ var core_js_modules_esnext_map_merge_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_merge_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_esnext_map_reduce_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(93);
/* harmony import */ var core_js_modules_esnext_map_reduce_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_reduce_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_esnext_map_some_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(94);
/* harmony import */ var core_js_modules_esnext_map_some_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_some_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_esnext_map_update_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(95);
/* harmony import */ var core_js_modules_esnext_map_update_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_map_update_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _components_Sku_sku2param__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(194);
/* harmony import */ var _api_goodIndent__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(27);













const store = __webpack_require__(19);


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'sku',
  props: {
    getList: {
      type: Object,
      default: function () {
        return {};
      }
    },
    cartDetails: {
      type: Object,
      default: function () {
        return {};
      }
    },
    update: {
      type: Boolean,
      default: false
    },
    order: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cartGood: {
        number: 1,
        price: ''
      },
      specSelected: [],
      SKUResult: {},
      good_sku: {},
      //原sku属性
      selectedSku: [],
      //记录当前所有可以选择的项
      selectedSkuIndex: [[]],
      //获取可选项对应的坐标
      specSelectedIndex: [],
      //记录选中的坐标
      productSkus: [],
      selectedName: [],
      //已选属性
      noSelectedName: [],
      //未选属性
      specificationDefaultDisplay: {},
      // 规格默认显示
      specification: [],
      shoppingAttributes: [],
      //购物属性
      getLists: this.getList
    };
  },
  watch: {
    getList(newVal) {
      this.$emit('getList', newVal);
      this.getLists = this.getList;
      if (!this.update) {
        this.loadData();
      }
    },
    getLists(newVal) {
      this.$emit('getLists', newVal);
    },
    cartDetails(newVal) {
      this.getLists = newVal.good;
      this.initSelectSpec(newVal);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    //获取详情
    loadData() {
      this.selectedSku = [];
      // Sku
      if (this.getLists.good_sku.length > 0) {
        const {
          productSkus,
          specification
        } = Object(_components_Sku_sku2param__WEBPACK_IMPORTED_MODULE_13__["param2Data"])(this.getLists.good_sku);
        this.specification = specification;
        specification.forEach((item, index) => {
          this.specSelectedIndex.push(null);
          this.noSelectedName.push(item.value);
          item.leaf.forEach((item2, index2) => {
            this.selectedSku.push(item2.id);
            this.selectedSkuIndex[item2.id] = {
              index: index,
              leaf: index2
            };
          });
        });
        // return false
        this.productSkus = productSkus;
        // 获取可选集成
        productSkus.forEach((item, ind) => {
          item.data.forEach(item2 => {
            item2.sort(function (value1, value2) {
              return parseInt(value1.replace("sku", "")) - parseInt(value2.replace("sku", ""));
            });
            this.SKUResult[item2.join("_")] = true;
          });
        });
        // 规格默认属性
        this.specificationDefaultDisplay = {
          img: this.getLists.resources_many[0].img,
          price_show: this.getLists.price_show,
          inventory_show: this.getLists.inventory_show,
          selected: '选择 ' + this.noSelectedName
        };
        this.$emit('purchasePattern', this.specificationDefaultDisplay);
      } else {
        this.specificationDefaultDisplay = {
          img: this.getLists.resources_many[0].img,
          price_show: this.getLists.price_show,
          inventory_show: this.getLists.inventory_show
        };
        this.cartGood.price = this.getLists.price;
      }
      //自动选择默认第一项规格
      if (typeof this.specification[0].leaf[0] != 'undefined') {
        for (var i = 0; i < this.specification.length; i++) {
          this.selectSpec(i, 0, this.specification[i].leaf[0]);
        }
      }
    },
    //初始化选中项
    initSelectSpec(newVal) {
      this.selectedSku = [];
      this.SKUResult = [];
      this.cartGood.price = newVal.price;
      this.cartGood.number = newVal.number;
      this.shoppingAttributes = newVal.good_sku;
      this.good_sku = newVal.good_sku;
      let checkedId = []; //选中的ID
      let checkedBrother = []; //兄弟列表
      // Sku
      if (newVal.good_sku) {
        const {
          productSkus,
          specification
        } = Object(_components_Sku_sku2param__WEBPACK_IMPORTED_MODULE_13__["param2Data"])(this.getLists.good_sku);
        this.specification = specification;
        specification.forEach((item, index) => {
          item.leaf.forEach((item2, index2) => {
            // 设置选中的值
            for (var i = 0; i < newVal.good_sku.product_sku.length; i++) {
              if (item2.value === newVal.good_sku.product_sku[i].value) {
                item.leaf[index2].selected = true;
                this.specSelectedIndex[index] = index2;
                if (index2 !== null) {
                  checkedId.push(specification[index]['leaf'][index2]['id']);
                  checkedBrother.push(index);
                }
                break;
              }
            }
            this.selectedSku.push(item2.id);
            this.selectedSkuIndex[item2.id] = {
              index: index,
              leaf: index2
            };
          });
        });
        this.productSkus = productSkus;
        // 获取可选集成
        productSkus.forEach((item, ind) => {
          item.data.forEach(item2 => {
            item2.sort(function (value1, value2) {
              return parseInt(value1.replace("sku", "")) - parseInt(value2.replace("sku", ""));
            });
            this.SKUResult[item2.join("_")] = true;
          });
        });
      }
      this.specificationDefaultDisplay = {
        img: newVal.img,
        price_show: [newVal.good_sku.price],
        inventory_show: newVal.good_sku.inventory,
        selected: '已选 ' + newVal.specification
      };
      // 处理不可选项
      let selectedSkus = JSON.parse(JSON.stringify(this.selectedSku));
      //判断属性是否可选
      let assemblyCache = []; //组合临时存放
      // 去除选中后的可选项
      selectedSkus.forEach(item => {
        //选把未选中的和选中的组合，如果是选中兄弟节点，把选中的值移除
        assemblyCache = JSON.parse(JSON.stringify(checkedId));
        assemblyCache.push(item);
        checkedBrother.forEach((item2, index2) => {
          this.specification[item2].leaf.forEach(item3 => {
            // 和选中行是兄弟关系
            if (item3.id === item) {
              assemblyCache.splice(assemblyCache.indexOf(checkedId[index2]), 1);
            }
          });
        });
        assemblyCache.sort(function (value1, value2) {
          return parseInt(value1.replace("sku", "")) - parseInt(value2.replace("sku", ""));
        });

        // assembly.push(assemblyCache.join("_"))
        // 判断选择项是否在可选集合内
        if (!this.SKUResult[assemblyCache.join("_")]) {
          this.specification[this.selectedSkuIndex[item].index].leaf[this.selectedSkuIndex[item].leaf].disabled = true;
        } else {
          this.specification[this.selectedSkuIndex[item].index].leaf[this.selectedSkuIndex[item].leaf].disabled = false;
        }
      });
    },
    //输入价格
    priceInput: function (event) {
      this.cartGood.price = parseFloat(event.target.value);
    },
    //选择规格
    selectSpec(index, childIndex, res) {
      if (res.disabled) {
        //不可选的直接返回
        return false;
      }
      let chooseAll = false; //是否选全
      let specification = this.specification;
      // 选中的清空
      if (this.specSelectedIndex[index] === childIndex) {
        //选择结果相同处理
        this.$set(specification[index]['leaf'][childIndex], 'selected', specification[index]['leaf'][childIndex]['selected'] ? false : true);
        this.specSelectedIndex[index] = null;
        // 添加未选择的值
        this.noSelectedName.splice(index, 0, specification[index].value);
      } else {
        //选择不同的处理
        if (this.specSelectedIndex[index] !== null) {
          //不等于null的时候把同个规格的其它参数设为未选中
          this.$set(specification[index]['leaf'][this.specSelectedIndex[index]], 'selected', false);
        }
        this.$set(specification[index]['leaf'][childIndex], 'selected', specification[index]['leaf'][childIndex]['selected'] ? false : true);
        this.specSelectedIndex[index] = childIndex;
        // this.noSelectedName
        // 删除选中的元素
        this.noSelectedName.forEach((item, indexs) => {
          if (item === specification[index].value) {
            this.noSelectedName.splice(indexs, 1);
          }
        });
      }
      if (this.noSelectedName.length > 0) {
        this.specificationDefaultDisplay = {
          img: this.getLists.resources_many[0].img,
          price_show: this.getLists.price_show,
          inventory_show: this.getLists.inventory_show,
          selected: '选择 ' + this.noSelectedName
        };
        if (!this.update) {
          this.$emit('purchasePattern', this.specificationDefaultDisplay);
        }
      }
      //保存最新选择的位置

      //存储已选择
      /**
       * 修复选择规格存储错误
       * 将这几行代码替换即可
       * 选择的规格存放在specSelected中
       */
      this.specSelected = [];
      let ids = '';
      let checkedId = []; //选中的ID
      let checkedBrother = []; //兄弟列表
      let selectedSkus = JSON.parse(JSON.stringify(this.selectedSku));
      this.specSelectedIndex.forEach((item, index) => {
        if (item !== null) {
          this.specSelected.push(specification[index]['leaf'][item]);
          ids += specification[index]['id'] + '-' + specification[index]['leaf'][item]['id'] + '_';
          checkedId.push(specification[index]['leaf'][item]['id']);
          selectedSkus.splice(selectedSkus.indexOf(specification[index]['leaf'][item]['id']), 1);
          checkedBrother.push(index);
          chooseAll = true;
        } else {
          chooseAll = false;
        }
      });

      //判断属性是否可选
      let assemblyCache = []; //组合临时存放

      // 去除选中后的可选项
      selectedSkus.forEach(item => {
        //选把未选中的和选中的组合，如果是选中兄弟节点，把选中的值移除
        assemblyCache = JSON.parse(JSON.stringify(checkedId));
        assemblyCache.push(item);
        checkedBrother.forEach((item2, index2) => {
          this.specification[item2].leaf.forEach(item3 => {
            // 和选中行是兄弟关系
            if (item3.id === item) {
              assemblyCache.splice(assemblyCache.indexOf(checkedId[index2]), 1);
            }
          });
        });
        assemblyCache.sort(function (value1, value2) {
          return parseInt(value1.replace("sku", "")) - parseInt(value2.replace("sku", ""));
        });
        // assembly.push(assemblyCache.join("_"))
        // 判断选择项是否在可选集合内
        if (!this.SKUResult[assemblyCache.join("_")]) {
          specification[this.selectedSkuIndex[item].index].leaf[this.selectedSkuIndex[item].leaf].disabled = true;
        } else {
          specification[this.selectedSkuIndex[item].index].leaf[this.selectedSkuIndex[item].leaf].disabled = false;
        }
      });

      // console.log(ids.substr(0, ids.length - 1))
      // 选项已选择
      if (chooseAll === true) {
        this.cartGood.number = 1;
        this.shoppingAttributes = [];
        for (var i = 0; i < this.productSkus.length; i++) {
          if (this.productSkus[i].ids === ids.substr(0, ids.length - 1)) {
            const specificationDefaultDisplay = this.specificationDefaultDisplay;
            const selectedName = [];
            this.productSkus[i].skus.forEach(items => {
              selectedName.push(items.v);
            });
            this.specificationDefaultDisplay = {
              img: this.productSkus[i].resources ? this.productSkus[i].resources.img : this.getLists.resources_many[0].img,
              price_show: [this.productSkus[i].price],
              inventory_show: this.productSkus[i].inventory,
              selected: '已选 ' + selectedName.join(";"),
              cost_price: this.productSkus[i].cost_price
            };
            if (!this.update) {
              this.$emit('purchasePattern', this.specificationDefaultDisplay);
            }
            this.cartGood.price = this.productSkus[i].price;
            this.shoppingAttributes = this.productSkus[i];
            break;
          }
        }
      }
    },
    //数量
    numberChange(data) {
      this.cartGood.number = data;
    },
    //加入购物车
    cart(buyState) {
      // 单品或已选规格
      if (this.shoppingAttributes.id > 0 || this.getLists.good_sku.length === 0) {
        const tmp = /^\d+\.?\d{0,2}$/;
        if (!tmp.test(this.cartGood.price)) {
          this.$message.error('输入的金额有误');
          return false;
        }
        this.$emit('toggleSpec');
        if (this.order) {
          //订单更新，直接返回更新后的数据
          // 非SKU商品不允许订单下修改，故不做处理
          if (this.getLists.good_sku.length > 0) {
            let img = this.getLists.resources_many[0].img;
            if (this.shoppingAttributes.resources) {
              img = this.shoppingAttributes.resources.img;
            }
            let cart = {
              id: this.cartDetails.id ? this.cartDetails.id : 0,
              name: this.getLists.name,
              price: this.cartGood.price,
              number: this.cartGood.number,
              good_sku_id: this.shoppingAttributes.id,
              good_id: this.getLists.id,
              good: this.getLists,
              good_sku: this.shoppingAttributes,
              img: img
            };
            this.$emit('setOrder', cart);
          }
        } else {
          // store.remove(process.env.CACHE_PR + 'CartList')
          let cartList = store.get("DSSHOP-PC-" + 'CartList') || [];
          let cartMap = new Map();
          if (buyState) {
            //直接购买
            cartList = [];
          }
          cartList.forEach(item => {
            cartMap.set(item.good_sku_id, item);
          });
          let img = this.getLists.resources_many[0].img;
          //Sku
          if (this.getLists.good_sku.length > 0) {
            if (this.shoppingAttributes.resources) {
              img = this.shoppingAttributes.resources.img;
            }
            if (this.update) {
              //更新
              // 判断用户是否更改了SKU
              if (this.good_sku.id !== this.shoppingAttributes.id) {
                cartMap.delete(this.good_sku.id);
              }
            }
            if (cartMap.get(this.shoppingAttributes.id)) {
              //已存在，更新其它属性，增加新添加的数量
              if (this.update) {
                //更新
                cartMap.get(this.shoppingAttributes.id).number = this.cartGood.number;
              } else {
                cartMap.get(this.shoppingAttributes.id).number += this.cartGood.number;
              }

              //如果购物车商品购买数大于当前库存，将结果改成库存数量
              if (cartMap.get(this.shoppingAttributes.id).number > this.specificationDefaultDisplay.inventory_show) {
                cartMap.get(this.shoppingAttributes.id).number = this.specificationDefaultDisplay.inventory_show;
              }
              cartMap.get(this.shoppingAttributes.id).price = this.cartGood.price;
              cartMap.get(this.shoppingAttributes.id).name = this.getLists.name;
              cartMap.get(this.shoppingAttributes.id).good_id = this.getLists.id;
              const good = JSON.parse(JSON.stringify(this.getLists));
              delete good.details;
              cartMap.get(this.shoppingAttributes.id).good = good;
              cartMap.get(this.shoppingAttributes.id).good_sku_id = this.shoppingAttributes.id;
              cartMap.get(this.shoppingAttributes.id).good_sku = this.shoppingAttributes;
              cartMap.get(this.shoppingAttributes.id).img = img;
            } else {
              cartMap.set(this.shoppingAttributes.id, {
                price: this.cartGood.price,
                number: this.cartGood.number,
                name: this.getLists.name,
                good_id: this.getLists.id,
                good: this.getLists,
                good_sku_id: this.shoppingAttributes.id,
                good_sku: this.shoppingAttributes,
                img: img
              });
            }
          } else {
            // 现只有sku商品，故这里不做处理
            if (cartList['good_' + this.getLists.id]) {
              if (this.update) {
                //更新
                cartList['good_' + this.getLists.id].number = this.cartGood.number;
              } else {
                cartList['good_' + this.getLists.id].number += this.cartGood.number;
              }

              //如果购物车商品购买数大于当前库存，将结果改成库存数量
              if (cartList['good_' + this.getLists.id].number > this.getLists.inventory_show) {
                cartList['good_' + this.getLists.id].number = this.getLists.inventory_show;
              }
              cartList['good_' + this.getLists.id].price = this.cartGood.price;
              cartList['good_' + this.getLists.id].name = this.getLists.name;
              cartList['good_' + this.getLists.id].good_id = this.getLists.id;
              cartList['good_' + this.getLists.id].good = this.getLists;
              cartList['good_' + this.getLists.id].img = img;
            } else {
              cartList['good_' + this.getLists.id] = {
                price: this.cartGood.price,
                number: this.cartGood.number,
                name: this.getLists.name,
                good_id: this.getLists.id,
                good: this.getLists,
                img: img
              };
            }
          }
          if (buyState) {
            //直接购买
            store.set("DSSHOP-PC-" + 'OrderList', [...cartMap.values()]);
          } else {
            // 发送给后台
            Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_14__[/* addShoppingCart */ "a"])([...cartMap.values()], function (res) {
              this.$emit('loadCart'); //重载数据
            });

            store.set("DSSHOP-PC-" + 'CartList', [...cartMap.values()]);
            $nuxt.$store.commit('setShoppingCartNumber', cartMap.size);
          }
        }
        this.initList();
        if (this.update) {//更新
        } else {
          if (buyState) {
            //直接购买
            this.$router.replace('/indent/create');
          } else {
            this.$message({
              message: '成功加入购物车',
              type: 'success'
            });
          }
        }
      } else {
        this.$message.error('请选择规格');
      }
    },
    //初始化
    initList() {
      this.cartGood = {
        number: 1,
        price: ''
      };
      this.specification = [];
      this.specificationDefaultDisplay = [];
      this.SKUResult = [];
      this.specSelected = [];
      this.specSelectedIndex = [];
      this.selectedName = [];
      this.noSelectedName = [];
      this.selectedSku = [];
      this.selectedSkuIndex = [[]];
      this.productSkus = [];
      this.shoppingAttributes = [];
      this.loadData();
    }
  }
});

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_6280261e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(191);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_6280261e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_6280261e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_6280261e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_6280261e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".specification-list[data-v-6280261e]{display:flex;margin-top:10px}.specification-list .name[data-v-6280261e]{font-size:12px;line-height:40px;width:80px;text-align:right;color:#999}.specification-list .item-list[data-v-6280261e]{flex:1;display:flex;flex-wrap:wrap}.specification-list .item-list .item[data-v-6280261e]{border:1px solid #e0e0e0;line-height:40px;padding:0 20px;margin-left:10px;margin-bottom:10px;cursor:pointer}.specification-list .item-list .selected[data-v-6280261e]{border:1px solid #fa524c;color:#fa524c}.specification-list .item-list .disabled[data-v-6280261e]{color:#c0c4cc;border:1px solid #c0c4cc}.purchase-quantity[data-v-6280261e]{margin-top:20px;display:flex;line-height:40px}.purchase-quantity .name[data-v-6280261e]{font-size:12px;width:80px;text-align:right;margin-right:10px;color:#999}.purchase-quantity .inventory[data-v-6280261e]{font-size:12px;margin-left:10px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 205:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Sku/index.vue?vue&type=template&id=6280261e&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._ssrNode((_vm._ssrList((_vm.specification),function(item,index){return ("<div class=\"specification-list\" data-v-6280261e><div class=\"name\" data-v-6280261e>"+_vm._ssrEscape(_vm._s(_vm.$t('hint.error.select', { attribute:item.value })))+"</div> <div class=\"item-list\" data-v-6280261e>"+(_vm._ssrList((item.leaf),function(childItem,childIndex){return ("<div"+(_vm._ssrClass("item",{ selected: childItem.selected, disabled: childItem.disabled}))+" data-v-6280261e>"+_vm._ssrEscape("\n          "+_vm._s(childItem.value)+"\n        ")+"</div>")}))+"</div></div>")}))+" "),_vm._ssrNode("<div class=\"purchase-quantity\" data-v-6280261e>","</div>",[_vm._ssrNode("<div class=\"name\" data-v-6280261e>"+_vm._ssrEscape(_vm._s(_vm.$t('sku.purchase_quantity')))+"</div> "),_vm._ssrNode("<div class=\"quantity\" data-v-6280261e>","</div>",[_c('el-input-number',{attrs:{"min":1,"max":_vm.getLists.purchase_number ? _vm.getLists.purchase_number : _vm.specificationDefaultDisplay.inventory_show},on:{"change":_vm.numberChange},model:{value:(_vm.cartGood.number>_vm.specificationDefaultDisplay.inventory_show?_vm.specificationDefaultDisplay.inventory_show:_vm.cartGood.number),callback:function ($$v) {_vm.$set(_vm.cartGood.number>_vm.specificationDefaultDisplay.inventory_show?_vm.specificationDefaultDisplay.inventory_show:_vm.cartGood, "number", $$v)},expression:"cartGood.number>specificationDefaultDisplay.inventory_show?specificationDefaultDisplay.inventory_show:cartGood.number"}})],1),_vm._ssrNode(" <div class=\"inventory\" data-v-6280261e>"+_vm._ssrEscape(_vm._s(_vm.$t('good_indent.piece'))+" ("+_vm._s(_vm.$t('good.table.inventory'))+"："+_vm._s(_vm.specificationDefaultDisplay.inventory_show)+_vm._s(_vm.$t('good_indent.piece'))+")")+"</div>")],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/Sku/index.vue?vue&type=template&id=6280261e&scoped=true&

// EXTERNAL MODULE: ./components/Sku/js/index.js
var js = __webpack_require__(199);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Sku/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var Skuvue_type_script_lang_js_ = (js["default"]);
// CONCATENATED MODULE: ./components/Sku/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Skuvue_type_script_lang_js_ = (Skuvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./components/Sku/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(201)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_Skuvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "6280261e",
  "4cd39da6"
  
)

/* harmony default export */ var Sku = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=sku.js.map