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
    //route("/login",'/Login',"Login"),
    {
      path:"/",
      component: () => import('../pages/Login'),
    },
    {
      path:"/index",
      name:"Index",
      component: () => import('../pages/Layout'),
      redirect:"/index/dashboard",
      children:[
        route("/index/dashboard","/Dashboard","Dashboard"),
        route("/item/category",'/item/Category',"Category"),
        route("/item/course",'/item/Course',"Course"),
        route("/item/courseType",'/item/CourseType',"courseType"),
        route("/item/specification",'/item/Specification',"Specification"),
        route("/trade/promotion",'/trade/Promotion',"Promotion"),
        route("/topic/list",'/topic/Topic',"Topic"),
        route("/user/list",'/user/List',"List"),
        route("/dynamic/check",'/dynamic/Check',"Check"),
        route("/article/list",'/article/Article',"Article")
      ]
    }
  ]
})
