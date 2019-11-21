var menus = [
  {
    action: "home",
    title: "首页",
    path:"/index",
    items: [{ title: "统计", path: "/dashboard" }]
  },
  {
    action: "apps",
    title: "商品管理",
    path:"/item",
    items: [
      // { title: "分类管理", path: "/category" },
      { title: "商品类型", path: "/brand" },
      { title: "商品列表", path: "/goods" },
      // { title: "规格参数", path: "/specification" }
    ]
  },
  {
    action: "people",
    title: "用户管理",
    path:"/user",
    items: [
      { title: "用户统计", path: "/list" }
    ]
  },
  {
    action: "comment",
    title: "话题管理",
    path:"/topic",
    items: [
      { title: "话题统计", path: "/list" }
    ]
  },
  {
    action: "attach_money",
    title: "动态管理",
    path:"/dynamic",
    items: [
      { title: "审核动态", path: "/check" }
      /*{ title: "订单管理", path: "/order" },
      { title: "物流管理", path: "/logistics" },
      { title: "促销管理", path: "/promotion" }*/
    ]
  },
  {
    action: "settings",
    title: "权限管理",
    path:"/authority",
    items: [
      { title: "权限管理", path: "/list" },
      { title: "角色管理", path: "/role" },
      { title: "人员管理", path: "/member" }
    ]
  }
]

export default menus;
