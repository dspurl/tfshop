import { constantRouterMap } from '@/router'
import Layout from '@/views/Layout/Layout'
// 模板
export const componentsMap = {
  Dashboard: () => import('@/views/Dashboard/index'),
  Admin: () => import('@/views/UserManagement/Admin/index'),
  AdminList: () => import('@/views/UserManagement/Admin/list'),
  AdminLog: () => import('@/views/UserManagement/Admin/log'),
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
  IndentShipment: () => import('@/views/IndentManagement/Indent/shipment'),
  RedisService: () => import('@/views/ToolManagement/RedisService/index'),
  RedisServiceList: () => import('@/views/ToolManagement/RedisService/list'),
  RedisPanel: () => import('@/views/ToolManagement/RedisService/panel'),
  Resource: () => import('@/views/ToolManagement/Resource/index'),
  ResourceList: () => import('@/views/ToolManagement/Resource/list'),
  // 轮播
  Banner: () => import('@/views/ToolManagement/Banner/index'),
  BannerList: () => import('@/views/ToolManagement/Banner/list'),
  // 统计
  StatisticsVisit: () => import('@/views/Statistics/visit'),
  StatisticsAgeAndSex: () => import('@/views/Statistics/user'),
  StatisticsPay: () => import('@/views/Statistics/pay'),
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
