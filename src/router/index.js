import Vue from 'vue'
import Router from 'vue-router'







'gf' +
''
';gf' +
'';
';g' +
';' +
';' +
';' +
';gf'

Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    route("/login",'/Login',"Login"),
    {
      path:"/",
      component: () => import('../pages/Layout'),
      redirect:"/index/dashboard",
      children:[
        route("/index/dashboard","/Dashboard","Dashboard"),
        route("/item/category",'/item/Category',"Category"),
        route("/item/brand",'/item/Brand',"Brand"),
        route("/item/goods",'/item/Goods',"Goods"),
        route("/item/specification",'/item/Specification',"Specification"),
        route("/trade/promotion",'/trade/Promotion',"Promotion"),
        route("/user/list",'/user/List',"List"),
        route("/dynamic/check",'/dynamic/Check',"Check")
      ]
    }
  ]
})
