(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-6e1e"],{"6g3Z":function(t,e,i){"use strict";i.r(e);var n=i("M3qR"),o=i.n(n);for(var a in n)"default"!==a&&function(t){i.d(e,t,function(){return n[t]})}(a);e.default=o.a},BEPA:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-container"},[i("div",{staticClass:"filter-container"},[i("el-menu",{staticClass:"el-menu-demo",attrs:{"default-active":t.listQuery.activeIndex,mode:"horizontal",clearable:""},on:{select:t.handleSelect}},[i("el-menu-item",{attrs:{index:"1"}},[t._v("全部商品("+t._s(t.goodCount.all)+")")]),t._v(" "),i("el-menu-item",{attrs:{index:"2"}},[t._v("出售中("+t._s(t.goodCount.sell)+")")]),t._v(" "),i("el-menu-item",{attrs:{index:"3"}},[t._v("仓库中("+t._s(t.goodCount.warehouse)+")")]),t._v(" "),i("el-menu-item",{attrs:{index:"4"}},[t._v("低库存("+t._s(t.goodCount.lowInventory)+")")]),t._v(" "),i("el-menu-item",{attrs:{index:"5"}},[t._v("已售完("+t._s(t.goodCount.sellOut)+")")])],1),t._v(" "),i("br"),t._v(" "),i("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:t.listQuery}},[i("el-form-item",{attrs:{label:"关键字"}},[i("el-input",{attrs:{placeholder:"商品标题/商品货号",clearable:""},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.handleFilter(e):null}},model:{value:t.listQuery.title,callback:function(e){t.$set(t.listQuery,"title",e)},expression:"listQuery.title"}})],1),t._v(" "),i("el-form-item",[i("el-button",{attrs:{type:"primary"},on:{click:t.handleFilter}},[t._v("搜索")]),t._v("\n        分类筛选:\n        "),i("el-cascader",{attrs:{options:t.categorys,props:{expandTrigger:"hover"},clearable:""},on:{change:t.changeCategorys},model:{value:t.listQuery.category_id,callback:function(e){t.$set(t.listQuery,"category_id",e)},expression:"listQuery.category_id"}})],1)],1),t._v(" "),i("br"),t._v(" "),i("router-link",{directives:[{name:"permission",rawName:"v-permission",value:t.$store.jurisdiction.GoodCreate,expression:"$store.jurisdiction.GoodCreate"}],attrs:{to:"GoodCreate"}},[i("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px",float:"right"},attrs:{type:"primary",icon:"el-icon-edit"}},[t._v("添加")])],1)],1),t._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],key:t.tableKey,ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.list,border:"",fit:"","highlight-current-row":""},on:{"sort-change":t.sortChange,"selection-change":t.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"55",fixed:"left"}}),t._v(" "),i("el-table-column",{attrs:{label:"编号",sortable:"custom",prop:"id",width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("router-link",{staticStyle:{width:"300px"},attrs:{to:{path:"/commodityManagement/good/goodDetail",query:{id:e.row.id}},target:"_blank"}},[t._v(" "+t._s(e.row.id))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"商品类型",sortable:"custom",prop:"type",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(e.row.type)+"\n      ")]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"图片",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-image",{staticStyle:{width:"80px",height:"80px"},attrs:{src:t._f("smallImage")(e.row.resources.img,150),"preview-src-list":[e.row.resources.img]}})]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"商品",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticClass:"drawing"},[i("div",{staticClass:"right"},[i("div",[t._v(t._s(e.row.name))]),t._v(" "),e.row.price_show.length>1?i("div",[t._v("¥ "+t._s(t._f("1000")(e.row.price_show[0]))+" - "+t._s(t._f("1000")(e.row.price_show[1])))]):i("div",[t._v("¥ "+t._s(t._f("1000")(e.row.price_show[0])))])])])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"分类",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.category?e.row.category.name:"无"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"货号",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.number))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"库存",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.inventory_show))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"销量",sortable:"custom",prop:"sales",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.sales))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"状态",sortable:"custom",prop:"is_show",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.putaway_show))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"减库存方式",sortable:"custom",prop:"is_inventory",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.is_inventory_show))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"是否推荐",sortable:"custom",prop:"is_recommend",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(1===e.row.is_recommend?"是":"否"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"上架时间",sortable:"custom",prop:"time",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.time?e.row.time:"未发布"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"更新时间",sortable:"custom",prop:"updated_at",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.updated_at))])]}}])}),t._v(" "),i("el-table-column",{attrs:{label:"操作","class-name":"small-padding fixed-width",width:"148",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("router-link",{directives:[{name:"permission",rawName:"v-permission",value:t.$store.jurisdiction.GoodEdit,expression:"$store.jurisdiction.GoodEdit"}],attrs:{to:{path:"GoodEdit",query:{id:e.row.id,page:t.listQuery.page,activeIndex:t.listQuery.activeIndex}}}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"编辑",placement:"top-start"}},[i("el-button",{attrs:{type:"primary",icon:"el-icon-edit",circle:""}})],1)],1),t._v(" "),1!==e.row.is_show?i("el-tooltip",{directives:[{name:"permission",rawName:"v-permission",value:t.$store.jurisdiction.GoodEdit,expression:"$store.jurisdiction.GoodEdit"}],staticClass:"item",attrs:{effect:"dark",content:"立即发布",placement:"top-start"}},[i("el-button",{attrs:{loading:t.formLoading,type:"success",icon:"el-icon-sell",circle:""},on:{click:function(i){t.handleState(e.row)}}})],1):i("el-tooltip",{directives:[{name:"permission",rawName:"v-permission",value:t.$store.jurisdiction.GoodEdit,expression:"$store.jurisdiction.GoodEdit"}],staticClass:"item",attrs:{effect:"dark",content:"放入库存",placement:"top-start"}},[i("el-button",{attrs:{loading:t.formLoading,type:"info",icon:"el-icon-sold-out",circle:""},on:{click:function(i){t.handleState(e.row,1)}}})],1),t._v(" "),i("el-tooltip",{directives:[{name:"permission",rawName:"v-permission",value:t.$store.jurisdiction.GoodDestroy,expression:"$store.jurisdiction.GoodDestroy"}],staticClass:"item",attrs:{effect:"dark",content:"删除",placement:"top-start"}},[i("el-button",{attrs:{loading:t.formLoading,type:"danger",icon:"el-icon-delete",circle:""},on:{click:function(i){t.handleDelete(e.row)}}})],1)]}}])})],1),t._v(" "),i("div",{staticClass:"pagination-operation"},[i("div",{staticClass:"operation"},[i("el-button",{attrs:{size:"mini"},on:{click:t.handleCheckAllChange}},[t._v("全选/反选")]),t._v(" "),"3"===t.listQuery.activeIndex?i("el-button",{directives:[{name:"permission",rawName:"v-permission",value:t.$store.jurisdiction.GoodEdit,expression:"$store.jurisdiction.GoodEdit"}],attrs:{loading:t.formLoading,size:"mini",type:"success"},on:{click:function(e){t.handleAllState()}}},[t._v("立即发布")]):"2"===t.listQuery.activeIndex?i("el-button",{directives:[{name:"permission",rawName:"v-permission",value:t.$store.jurisdiction.GoodEdit,expression:"$store.jurisdiction.GoodEdit"}],attrs:{loading:t.formLoading,size:"mini",type:"info"},on:{click:function(e){t.handleAllState(1)}}},[t._v("放入库存")]):t._e(),t._v(" "),i("el-button",{directives:[{name:"permission",rawName:"v-permission",value:t.$store.jurisdiction.GoodDestroy,expression:"$store.jurisdiction.GoodDestroy"}],attrs:{loading:t.formLoading,size:"mini",type:"danger"},on:{click:function(e){t.handleAllDelete()}}},[t._v("删除")])],1),t._v(" "),i("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>0,expression:"total>0"}],staticClass:"pagination",attrs:{total:t.total,page:t.listQuery.page,limit:t.listQuery.limit},on:{"update:page":function(e){t.$set(t.listQuery,"page",e)},"update:limit":function(e){t.$set(t.listQuery,"limit",e)},pagination:t.getList}})],1)],1)},o=[];i.d(e,"a",function(){return n}),i.d(e,"b",function(){return o})},Hobs:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("Wkq7"),o=i("xAVR"),a=i("X4fA"),r=function(t){return t&&t.__esModule?t:{default:t}}(i("Mz3J"));e.default={name:"GoodList",components:{Pagination:r.default},data:function(){return{formLoading:!1,goodCount:{all:0,sell:0,warehouse:0,lowInventory:0,sellOut:0},actionurl:"http://dsshop.test/api/v1/admin/uploadPictures",imgHeaders:{Authorization:(0,a.getToken)("token_type")+" "+(0,a.getToken)("access_token")},dialogVisible:!1,ruleForm:[],checkAll:!1,tableKey:0,list:null,total:0,textMap:{update:"修改",create:"添加"},imgData:{type:1,size:512e3},imgProgressPercent:0,loading:!1,listLoading:!1,imgProgress:!1,dialogStatus:"",dialogFormVisible:!1,listQuery:{limit:10,page:this.$route.query.page?Number(this.$route.query.page):1,sort:"-id",activeIndex:this.$route.query.activeIndex?this.$route.query.activeIndex:"1",cateId:this.$route.query.cateId},temp:{},categorys:[],rules:{title:[{required:!0,message:"请输入标题",trigger:"blur"}],type:[{required:!0,message:"请选择类型",trigger:"change"}],price:[{required:!0,message:"请填写价格",trigger:"change"}],img:[{required:!0,message:"请上传图片",trigger:"change"}],state:[{required:!0,message:"请选择状态",trigger:"change"}],sort:[{required:!0,message:"请填写排序",trigger:"blur"}]}}},created:function(){this.getList(),this.getGoodCount(),this.getCateList()},methods:{getList:function(){var t=this;this.listLoading=!0,(0,n.getList)(this.listQuery).then(function(e){t.list=e.data.data,t.total=e.data.total,t.listLoading=!1})},getGoodCount:function(){var t=this;(0,n.count)().then(function(e){t.goodCount=e.data})},getCateList:function(){var t=this;(0,o.getList)(this.listQuery).then(function(e){t.categorys=e.data.options})},handleFilter:function(){this.listQuery.page=1,this.getList()},sortChange:function(t){var e=t.prop,i=t.order;this.listQuery.sort="ascending"===i?"+"+e:"-"+e,this.handleFilter()},changeCategorys:function(t){this.listQuery.cateId=t,this.handleFilter()},handleSelect:function(t,e){this.listQuery.activeIndex=t,this.handleFilter()},handleCheckAllChange:function(){this.$refs.multipleTable.toggleAllSelection()},handleSelectionChange:function(t){this.multipleSelection=t},handleState:function(t,e){var i=this,o="是否确认立即上架商品?";1===e&&(o="是否确认将商品加入仓库？");this.$confirm(o,this.$t("hint.hint"),{confirmButtonText:this.$t("usuel.confirm"),cancelButtonText:this.$t("usuel.cancel"),type:"warning"}).then(function(){i.formLoading=!0,(0,n.state)(t.id,t).then(function(){i.getList(),i.dialogFormVisible=!1,i.formLoading=!1,i.$notify({title:i.$t("hint.succeed"),message:"操作成功",type:"success",duration:2e3})}).catch(function(){i.formLoading=!1})}).catch(function(){})},handleDelete:function(t){var e=this;this.$confirm("是否确认删除该商品?",this.$t("hint.hint"),{confirmButtonText:this.$t("usuel.confirm"),cancelButtonText:this.$t("usuel.cancel"),type:"warning"}).then(function(){e.formLoading=!0,(0,n.destroy)(t.id).then(function(){e.getList(),e.dialogFormVisible=!1,e.formLoading=!1,e.$notify({title:e.$t("hint.succeed"),message:"删除成功",type:"success",duration:2e3})}).catch(function(){e.formLoading=!1})}).catch(function(){})},handleAllState:function(t){var e=this,i="是否确认批量立即上架商品?";1===t&&(i="是否确认批量将商品加入仓库？");this.$confirm(i,this.$t("hint.hint"),{confirmButtonText:this.$t("usuel.confirm"),cancelButtonText:this.$t("usuel.cancel"),type:"warning"}).then(function(){e.formLoading=!0,(0,n.state)(0,e.multipleSelection).then(function(){e.getList(),e.dialogFormVisible=!1,e.formLoading=!1,e.$notify({title:e.$t("hint.succeed"),message:"操作成功",type:"success",duration:2e3})}).catch(function(){e.formLoading=!1})}).catch(function(){})},handleAllDelete:function(){var t=this;this.$confirm("是否确认批量删除内容?",this.$t("hint.hint"),{confirmButtonText:this.$t("usuel.confirm"),cancelButtonText:this.$t("usuel.cancel"),type:"warning"}).then(function(){t.formLoading=!0,(0,n.destroy)(0,t.multipleSelection).then(function(){t.getList(),t.dialogFormVisible=!1,t.formLoading=!1,t.$notify({title:t.$t("hint.succeed"),message:"删除成功",type:"success",duration:2e3})}).catch(function(){t.formLoading=!1})}).catch(function(){})}}}},Lcw6:function(t,e,i){"use strict";var n=i("qULk");i.n(n).a},M3qR:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("Y5bG");e.default={name:"Pagination",props:{total:{required:!0,type:Number},page:{type:Number,default:1},limit:{type:Number,default:20},pageSizes:{type:Array,default:function(){return[10,20,30,50]}},layout:{type:String,default:"total, sizes, prev, pager, next, jumper"},background:{type:Boolean,default:!0},autoScroll:{type:Boolean,default:!0},hidden:{type:Boolean,default:!1}},computed:{currentPage:{get:function(){return this.page},set:function(t){this.$emit("update:page",t)}},pageSize:{get:function(){return this.limit},set:function(t){this.$emit("update:limit",t)}}},methods:{handleSizeChange:function(t){this.$emit("pagination",{page:this.currentPage,limit:t}),this.autoScroll&&(0,n.scrollTo)(0,800)},handleCurrentChange:function(t){this.$emit("pagination",{page:t,limit:this.pageSize}),this.autoScroll&&(0,n.scrollTo)(0,800)}}}},Mz3J:function(t,e,i){"use strict";i.r(e);var n=i("cJ0Q"),o=i("6g3Z");for(var a in o)"default"!==a&&function(t){i.d(e,t,function(){return o[t]})}(a);i("Lcw6");var r=i("KHd+"),s=Object(r.a)(o.default,n.a,n.b,!1,null,"331ed7d4",null);s.options.__file="index.vue",e.default=s.exports},Vx98:function(t,e,i){"use strict";i.r(e);var n=i("BEPA"),o=i("mRDP");for(var a in o)"default"!==a&&function(t){i.d(e,t,function(){return o[t]})}(a);i("qNrD");var r=i("KHd+"),s=Object(r.a)(o.default,n.a,n.b,!1,null,null,null);s.options.__file="list.vue",e.default=s.exports},Wkq7:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getList=function(t){return(0,n.default)({url:"good",method:"GET",params:t})},e.count=function(){return(0,n.default)({url:"goodCount",method:"GET"})},e.create=function(t){return t=o.default.parse(t),(0,n.default)({url:"good",method:"POST",data:t})},e.edit=function(t){return t=o.default.parse(t),(0,n.default)({url:"good/"+t.id,method:"POST",data:t})},e.destroy=function(t,e){return e=o.default.parse(e),(0,n.default)({url:"good/destroy/"+t,method:"POST",data:e})},e.detail=function(t){return(0,n.default)({url:"good/"+t,method:"GET"})},e.state=function(t,e){return e=o.default.parse(e),(0,n.default)({url:"good/state/"+t,method:"POST",data:e})},e.specification=function(t){return(0,n.default)({url:"good/specification/"+t,method:"GET"})};var n=a(i("t3Un")),o=a(i("Qyje"));function a(t){return t&&t.__esModule?t:{default:t}}},Y5bG:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.scrollTo=function(t,e,i){var o=document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop,a=t-o,r=0;e=void 0===e?500:e,function t(){r+=20;var s=Math.easeInOutQuad(r,o,a,e);!function(t){document.documentElement.scrollTop=t,document.body.parentNode.scrollTop=t,document.body.scrollTop=t}(s),r<e?n(t):i&&"function"==typeof i&&i()}()},Math.easeInOutQuad=function(t,e,i,n){return(t/=n/2)<1?i/2*t*t+e:-i/2*(--t*(t-2)-1)+e};var n=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}},cJ0Q:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"pagination-container",class:{hidden:t.hidden}},[i("el-pagination",t._b({attrs:{background:t.background,"current-page":t.currentPage,"page-size":t.pageSize,layout:t.layout,"page-sizes":t.pageSizes,total:t.total},on:{"update:currentPage":function(e){t.currentPage=e},"update:pageSize":function(e){t.pageSize=e},"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}},"el-pagination",t.$attrs,!1))],1)},o=[];i.d(e,"a",function(){return n}),i.d(e,"b",function(){return o})},mRDP:function(t,e,i){"use strict";i.r(e);var n=i("Hobs"),o=i.n(n);for(var a in n)"default"!==a&&function(t){i.d(e,t,function(){return n[t]})}(a);e.default=o.a},qNrD:function(t,e,i){"use strict";var n=i("v33r");i.n(n).a},qULk:function(t,e,i){},v33r:function(t,e,i){},xAVR:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getList=function(t){return(0,n.default)({url:"category",method:"GET",params:t})},e.create=function(t){return t=o.default.parse(t),(0,n.default)({url:"category",method:"POST",data:t})},e.edit=function(t){return t=o.default.parse(t),(0,n.default)({url:"category/"+t.id,method:"POST",data:t})},e.destroy=function(t){return(0,n.default)({url:"category/destroy/"+t,method:"POST"})};var n=a(i("t3Un")),o=a(i("Qyje"));function a(t){return t&&t.__esModule?t:{default:t}}}}]);