import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
// 模板
export const componentsMap = {
  dashboard: () => import('@/views/dashboard/index'),
  AdministratorList: () => import('@/views/user/index'),
  UsersList: () => import('@/views/user/users'),
  ManageList: () => import('@/views/user/manageGroups'),
  PowerList: () => import('@/views/user/power'),
  RedisServices: () => import('@/views/tool/redisService/index'),
  RedisServicesList: () => import('@/views/tool/redisService/list'),
  RedisPanel: () => import('@/views/tool/redisService/panel'),
  ProjectList: () => import('@/views/project/list'),
  Specification: () => import('@/views/GoodsManage/specification/index'),
  SpecificationList: () => import('@/views/GoodsManage/specification/list'),
  SpecificationGroup: () => import('@/views/GoodsManage/specificationGroup/index'),
  SpecificationGroupList: () => import('@/views/GoodsManage/specificationGroup/list'),
  Brand: () => import('@/views/GoodsManage/brand/index'),
  BrandList: () => import('@/views/GoodsManage/brand/list'),
  ResourceData: () => import('@/views/tool/resource/index'),
  ResourceDataList: () => import('@/views/tool/resource/list'),
  Category: () => import('@/views/GoodsManage/category/index'),
  CategoryList: () => import('@/views/GoodsManage/category/list'),
  // 商品管理
  Product: () => import('@/views/GoodsManage/goods/index'),
  ProductList: () => import('@/views/GoodsManage/goods/list'),
  CreateProduct: () => import('@/views/GoodsManage/goods/create'),
  EditProduct: () => import('@/views/GoodsManage/goods/edit'),
  // 运费模板
  Freight: () => import('@/views/freight/index'),
  freightList: () => import('@/views/freight/list'),
  CreateFreight: () => import('@/views/freight/create'),
  EditFreight: () => import('@/views/freight/edit'),
  // 运费模板
  Dhl: () => import('@/views/dhl/index'),
  dhlList: () => import('@/views/dhl/list'),
  // 订单管理
  Indent: () => import('@/views/Indent/index'),
  indentList: () => import('@/views/Indent/list'),
  shipment: () => import('@/views/Indent/shipment'),
  // 轮播
  Banner: () => import('@/views/tool/Banner/index'),
  BannerList: () => import('@/views/tool/Banner/list'),
  // 统计
  StatisticsVisit: () => import('@/views/statistics/visit'),
  StatisticsAgeAndSex: () => import('@/views/statistics/user'),
  StatisticsPay: () => import('@/views/statistics/pay'),
  // 优惠券_s
  Coupon: () => import('@/views/tool/Coupon/index'),
  CouponList: () => import('@/views/tool/Coupon/list'),
  // 优惠券_e
  // 评价_s
  Comment: () => import('@/views/tool/Comment/index'),
  CommentList: () => import('@/views/tool/Comment/list'),
  // 评价_e
  // 栏目文章_s
  Column: () => import('@/views/tool/Article/Column/index'),
  ColumnList: () => import('@/views/tool/Article/Column/list'),
  CreateColumn: () => import('@/views/tool/Article/Column/create'),
  EditColumn: () => import('@/views/tool/Article/Column/edit'),
  Article: () => import('@/views/tool/Article/Article/index'),
  ArticleList: () => import('@/views/tool/Article/Article/list'),
  CreateArticle: () => import('@/views/tool/Article/Article/create'),
  EditArticle: () => import('@/views/tool/Article/Article/edit'),
  // 栏目文章_e
  // 插件列表
  // 插件
  PlugIn: () => import('@/views/Plugin/index'),
  PlugInList: () => import('@/views/Plugin/list')
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
