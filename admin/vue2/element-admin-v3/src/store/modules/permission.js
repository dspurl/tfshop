import { constantRouterMap } from '@/router'
import Layout from '@/views/Layout/Layout'
// 模板
export const componentsMap = {
  Dashboard: () => import('@/views/Dashboard/index'),
  Admin: () => import('@/views/UserManagement/Admin/index'),
  AdminList: () => import('@/views/UserManagement/Admin/list'),
  AdminLogList: () => import('@/views/UserManagement/Admin/log'),
  Manage: () => import('@/views/UserManagement/Manage/index'),
  ManageList: () => import('@/views/UserManagement/Manage/list'),
  Member: () => import('@/views/UserManagement/Member/index'),
  MemberList: () => import('@/views/UserManagement/Member/list'),
  Power: () => import('@/views/UserManagement/Power/index'),
  PowerList: () => import('@/views/UserManagement/Power/list'),
  Category: () => import('@/views/CommodityManagement/Category/index'),
  CategoryList: () => import('@/views/CommodityManagement/Category/list'),
  Good: () => import('@/views/CommodityManagement/Good/index'),
  GoodList: () => import('@/views/CommodityManagement/Good/list'),
  GoodCreate: () => import('@/views/CommodityManagement/Good/create'),
  GoodEdit: () => import('@/views/CommodityManagement/Good/edit'),
  GoodDetail: () => import('@/views/CommodityManagement/Good/detail'),
  Brand: () => import('@/views/CommodityManagement/Brand/index'),
  BrandList: () => import('@/views/CommodityManagement/Brand/list'),
  Specification: () => import('@/views/CommodityManagement/Specification/index'),
  SpecificationList: () => import('@/views/CommodityManagement/Specification/list'),
  SpecificationGroup: () => import('@/views/CommodityManagement/SpecificationGroup/index'),
  SpecificationGroupList: () => import('@/views/CommodityManagement/SpecificationGroup/list'),
  Freight: () => import('@/views/LogisticManagement/Freight/index'),
  FreightList: () => import('@/views/LogisticManagement/Freight/list'),
  FreightCreate: () => import('@/views/LogisticManagement/Freight/create'),
  FreightEdit: () => import('@/views/LogisticManagement/Freight/edit'),
  Dhl: () => import('@/views/LogisticManagement/Dhl/index'),
  DhlList: () => import('@/views/LogisticManagement/Dhl/list'),
  Indent: () => import('@/views/IndentManagement/Indent/index'),
  IndentList: () => import('@/views/IndentManagement/Indent/list'),
  IndentDetail: () => import('@/views/IndentManagement/Indent/detail'),
  Resource: () => import('@/views/ToolManagement/Resource/index'),
  ResourceList: () => import('@/views/ToolManagement/Resource/list'),
  // 轮播
  Banner: () => import('@/views/ToolManagement/Banner/index'),
  BannerList: () => import('@/views/ToolManagement/Banner/list'),
  // 统计
  StatisticsVisitList: () => import('@/views/Statistics/visit'),
  StatisticsAgeAndSexList: () => import('@/views/Statistics/user'),
  StatisticsPayList: () => import('@/views/Statistics/pay'),
  // 栏目文章_s
  Column: () => import('@/views/ToolManagement/Article/Column/index'),
  ColumnList: () => import('@/views/ToolManagement/Article/Column/list'),
  ColumnCreate: () => import('@/views/ToolManagement/Article/Column/create'),
  ColumnEdit: () => import('@/views/ToolManagement/Article/Column/edit'),
  Article: () => import('@/views/ToolManagement/Article/Article/index'),
  ArticleList: () => import('@/views/ToolManagement/Article/Article/list'),
  ArticleCreate: () => import('@/views/ToolManagement/Article/Article/create'),
  ArticleEdit: () => import('@/views/ToolManagement/Article/Article/edit'),
  // 栏目文章_e
  // 评价_s
  Comment: () => import('@/views/ToolManagement/Comment/index'),
  CommentList: () => import('@/views/ToolManagement/Comment/list'),
  // 评价_e
  // 分销_s
  Distribution: () => import('@/views/ToolManagement/Distribution/index'),
  DistributionList: () => import('@/views/ToolManagement/Distribution/list'),
  // 分销_e
  // 优惠券_s
  Coupon: () => import('@/views/ToolManagement/Coupon/index'),
  CouponList: () => import('@/views/ToolManagement/Coupon/list'),
  // 优惠券_e
  // 产品参数模板_s
  GoodParameterGroup: () => import('@/views/ToolManagement/Description/GoodParameterGroup/index'),
  GoodParameterGroupList: () => import('@/views/ToolManagement/Description/GoodParameterGroup/list'),
  GoodParameterGroupCreate: () => import('@/views/ToolManagement/Description/GoodParameterGroup/create'),
  GoodParameterGroupEdit: () => import('@/views/ToolManagement/Description/GoodParameterGroup/edit'),
  GoodParameter: () => import('@/views/ToolManagement/Description/GoodParameter/index'),
  GoodParameterList: () => import('@/views/ToolManagement/Description/GoodParameter/list'),
  GoodParameterCreate: () => import('@/views/ToolManagement/Description/GoodParameter/create'),
  GoodParameterEdit: () => import('@/views/ToolManagement/Description/GoodParameter/edit'),
  // 产品参数模板_e
  // 积分_s
  Integral: () => import('@/views/ToolManagement/Integral/Integral/index'),
  IntegralList: () => import('@/views/ToolManagement/Integral/Integral/list'),
  IntegralLog: () => import('@/views/ToolManagement/Integral/IntegralLog/index'),
  IntegralLogList: () => import('@/views/ToolManagement/Integral/IntegralLog/list'),
  IntegralConfiguration: () => import('@/views/ToolManagement/Integral/IntegralConfiguration/index'),
  IntegralConfigurationList: () => import('@/views/ToolManagement/Integral/IntegralConfiguration/list'),
  IntegralConfigurationCreate: () => import('@/views/ToolManagement/Integral/IntegralConfiguration/create'),
  IntegralConfigurationEdit: () => import('@/views/ToolManagement/Integral/IntegralConfiguration/edit'),
  // 积分_e
  // 积分商品_s
  IntegralCommodity: () => import('@/views/ToolManagement/IntegralCommodity/IntegralCommodity/index'),
  IntegralCommodityList: () => import('@/views/ToolManagement/IntegralCommodity/IntegralCommodity/list'),
  IntegralCommodityCreate: () => import('@/views/ToolManagement/IntegralCommodity/IntegralCommodity/create'),
  IntegralCommodityEdit: () => import('@/views/ToolManagement/IntegralCommodity/IntegralCommodity/edit'),
  // 积分商品_e
  // 积分抽奖_s
  IntegralDraw: () => import('@/views/ToolManagement/IntegralDraw/IntegralDraw/index'),
  IntegralDrawList: () => import('@/views/ToolManagement/IntegralDraw/IntegralDraw/list'),
  IntegralDrawCreate: () => import('@/views/ToolManagement/IntegralDraw/IntegralDraw/create'),
  IntegralDrawEdit: () => import('@/views/ToolManagement/IntegralDraw/IntegralDraw/edit'),
  IntegralDrawLog: () => import('@/views/ToolManagement/IntegralDraw/IntegralDrawLog/index'),
  IntegralDrawLogList: () => import('@/views/ToolManagement/IntegralDraw/IntegralDrawLog/list'),
  // 积分抽奖_e
  // 秒杀_s
  Seckill: () => import('@/views/ToolManagement/Seckill/Seckill/index'),
  SeckillList: () => import('@/views/ToolManagement/Seckill/Seckill/list'),
  SeckillCreate: () => import('@/views/ToolManagement/Seckill/Seckill/create'),
  SeckillEdit: () => import('@/views/ToolManagement/Seckill/Seckill/edit'),
  // 秒杀_e
  // 拼团_s
  GroupPurchase: () => import('@/views/ToolManagement/GroupPurchase/index'),
  GroupPurchaseList: () => import('@/views/ToolManagement/GroupPurchase/list'),
  GroupPurchaseCreate: () => import('@/views/ToolManagement/GroupPurchase/create'),
  GroupPurchaseEdit: () => import('@/views/ToolManagement/GroupPurchase/edit'),
  // 拼团_e
  // 插件列表
  // 插件
  PlugIn: () => import('@/views/Plugin/index'),
  PlugInList: () => import('@/views/Plugin/list'),
  PlugInCreate: () => import('@/views/Plugin/create'),
  PlugInEdit: () => import('@/views/Plugin/edit')
}
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { asyncRouterMap } = data
        const accessedRouters = generateAsyncRouter(componentsMap, asyncRouterMap)
        accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTERS', accessedRouters)
        // console.log(accessedRouters)
        resolve()
      })
    }
  }
}
function generateAsyncRouter(componentsMap, serverRouterMap) {
  serverRouterMap.forEach(function(item, index) {
    if (!item.redirect) {
      delete item.redirect
    }
    // console.log('item.component',item.component)
    item.component = item.component === 'Layout' ? Layout : componentsMap[item.component]
    if (item.children && item.children.length > 0) {
      generateAsyncRouter(componentsMap, item.children)
    }
  })
  return serverRouterMap
}
export default permission
