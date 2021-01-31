import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
// 模板
export const componentsMap = {
  Dashboard: () => import('@/views/Dashboard/index'),
  Admin: () => import('@/views/UserManagement/Admin/index'),
  AdminList: () => import('@/views/UserManagement/Admin/list'),
  Manage: () => import('@/views/UserManagement/Manage/index'),
  ManageList: () => import('@/views/UserManagement/Manage/list'),
  Member: () => import('@/views/UserManagement/Member/index'),
  MemberList: () => import('@/views/UserManagement/Member/list'),
  Power: () => import('@/views/UserManagement/Power/index'),
  PowerList: () => import('@/views/UserManagement/Power/list'),
  Good: () => import('@/views/CommodityManagement/Good/index'),
  GoodList: () => import('@/views/CommodityManagement/Good/list'),
  GoodCreate: () => import('@/views/CommodityManagement/Good/create'),
  GoodEdit: () => import('@/views/CommodityManagement/Good/edit'),
  Brand: () => import('@/views/CommodityManagement/Brand/index'),
  BrandList: () => import('@/views/CommodityManagement/Brand/list'),
  RedisServices: () => import('@/views/Tool/RedisService/index'),
  RedisServicesList: () => import('@/views/Tool/RedisService/list'),
  RedisPanel: () => import('@/views/Tool/RedisService/panel'),
  Specification: () => import('@/views/CommodityManagement/Specification/index'),
  SpecificationList: () => import('@/views/CommodityManagement/Specification/list'),
  SpecificationGroup: () => import('@/views/CommodityManagement/SpecificationGroup/index'),
  SpecificationGroupList: () => import('@/views/CommodityManagement/SpecificationGroup/list'),
  ResourceData: () => import('@/views/Tool/Resource/index'),
  ResourceDataList: () => import('@/views/Tool/Resource/list'),
  Category: () => import('@/views/CommodityManagement/Category/index'),
  CategoryList: () => import('@/views/CommodityManagement/Category/list'),
  // 运费模板
  Freight: () => import('@/views/Freight/index'),
  FreightList: () => import('@/views/Freight/list'),
  FreightCreate: () => import('@/views/Freight/create'),
  FreightEdit: () => import('@/views/Freight/edit'),
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
