import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import TreeDemo from "../views/demo/Tree.vue"
import FromGrid from "../views/demo/FromGrid.vue";

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  /**
   * 针对后台管理系统，所有第一层路由的component为Home.除非需要跳出主界面
   * 页面上的菜单只会渲染到二级目录(第一层的children)。第三层的children只用于路由。不渲染菜单
   * isHide属性必填，用于决定页面是否渲染此菜单。
   * name名称在整个数组当做不能重复
   * 其余规则遵守vue-route规范即可。
   */
  routes: [
    {
      path: '/',
      name: '框架示例',
      isHide: false,
      component: Home,
      children: [
        {
          path: 'tree',
          name: '树结构',
          component: TreeDemo,
          isHide: false,
        },
        {
          path: 'crud',
          name: 'CRUD视图',
          component: FromGrid,
          isHide: false,
        },
      ]
    }
  ]
})
