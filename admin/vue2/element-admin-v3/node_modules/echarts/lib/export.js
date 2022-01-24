var zrender = require("zrender/lib/zrender");

exports.zrender = zrender;

var matrix = require("zrender/lib/core/matrix");

exports.matrix = matrix;

var vector = require("zrender/lib/core/vector");

exports.vector = vector;

var zrUtil = require("zrender/lib/core/util");

var colorTool = require("zrender/lib/tool/color");

exports.color = colorTool;

var graphic = require("./util/graphic");

exports.graphic = graphic;

var numberUtil = require("./util/number");

exports.number = numberUtil;

var formatUtil = require("./util/format");

exports.format = formatUtil;

var _throttle = require("./util/throttle");

var throttle = _throttle.throttle;
exports.throttle = _throttle.throttle;

var ecHelper = require("./helper");

exports.helper = ecHelper;

var parseGeoJSON = require("./coord/geo/parseGeoJson");

exports.parseGeoJSON = parseGeoJSON;

var _List = require("./data/List");

exports.List = _List;

var _Model = require("./model/Model");

exports.Model = _Model;

var _Axis = require("./coord/Axis");

exports.Axis = _Axis;

var _env = require("zrender/lib/core/env");

exports.env = _env;

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

/**
 * Do not mount those modules on 'src/echarts' for better tree shaking.
 */
var parseGeoJson = parseGeoJSON;
var ecUtil = {};
zrUtil.each(['map', 'each', 'filter', 'indexOf', 'inherits', 'reduce', 'filter', 'bind', 'curry', 'isArray', 'isString', 'isObject', 'isFunction', 'extend', 'defaults', 'clone', 'merge'], function (name) {
  ecUtil[name] = zrUtil[name];
});
exports.parseGeoJson = parseGeoJson;
exports.util = ecUtil;