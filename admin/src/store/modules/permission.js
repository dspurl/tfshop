import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
// 模板
export const componentsMap = {
  Dashboard: () => import('@/views/Dashboard/index'),
  Admin: () => import('@/views/User/Admin/index'),
  AdminList: () => import('@/views/User/Admin/list'),
  Manage: () => import('@/views/User/Manage/index'),
  ManageList: () => import('@/views/User/Manage/list'),
  Member: () => import('@/views/User/Member/index'),
  MemberList: () => import('@/views/User/Member/list'),
  Power: () => import('@/views/User/Power/index'),
  PowerList: () => import('@/views/User/Power/list'),
  RedisServices: () => import('@/views/Tool/redisService/index'),
  RedisServicesList: () => import('@/views/Tool/redisService/list'),
  RedisPanel: () => import('@/views/Tool/redisService/panel'),
  Specification: () => import('@/views/GoodsManage/specification/index'),
  SpecificationList: () => import('@/views/GoodsManage/specification/list'),
  SpecificationGroup: () => import('@/views/GoodsManage/specificationGroup/index'),
  SpecificationGroupList: () => import('@/views/GoodsManage/specificationGroup/list'),
  Brand: () => import('@/views/GoodsManage/brand/index'),
  BrandList: () => import('@/views/GoodsManage/brand/list'),
  ResourceData: () => import('@/views/Tool/resource/index'),
  ResourceDataList: () => import('@/views/Tool/resource/list'),
  Category: () => import('@/views/GoodsManage/category/index'),
  CategoryList: () => import('@/views/GoodsManage/category/list'),
  // 商品管理
  Product: () => import('@/views/GoodsManage/goods/index'),
  ProductList: () => import('@/views/GoodsManage/goods/list'),
  CreateProduct: () => import('@/views/GoodsManage/goods/create'),
  EditProduct: () => import('@/views/GoodsManage/goods/edit'),
  // 运费模板
  Freight: () => import('@/views/Freight/index'),
  FreightList: () => import('@/views/Freight/list'),
  CreateFreight: () => import('@/views/Freight/create'),
  EditFreight: () => import('@/views/Freight/edit'),
  // 运费模板
  Dhl: () => import('@/views/Dhl/index'),
  DhlList: () => import('@/views/Dhl/list'),
  // 订单管理
  Indent: () => import('@/views/Indent/index'),
  IndentList: () => import('@/views/Indent/list'),
  Shipment: () => import('@/views/Indent/shipment'),
  // 轮播
  Banner: () => import('@/views/Tool/Banner/index'),
  BannerList: () => import('@/views/Tool/Banner/list'),
  // 统计
  StatisticsVisit: () => import('@/views/Statistics/visit'),
  StatisticsAgeAndSex: () => import('@/views/Statistics/user'),
  StatisticsPay: () => import('@/views/Statistics/pay'),
  // 插件列表
  // 插件
  PlugIn: () => import('@/views/Plugin/index'),
  PlugInList: () => import('@/views/Plugin/list'),
  CreatePlugIn: () => import('@/views/Plugin/create'),
  EditPlugIn: () => import('@/views/Plugin/edit')
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
