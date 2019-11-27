<template>
  <v-card>
    <v-card-title>
      <v-btn @click="addBrand" color="primary">新增课程</v-btn>
<!--      <v-btn @click="testCourse" color="primary">testsession</v-btn>-->
<!--      <v-btn @click="queryCourse" color="primary">querysession</v-btn>-->
      <v-spacer/>
      <v-text-field
        append-icon="search"
        label="搜索"
        single-line
        hide-details
        v-model="search"
      />
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.course_id }}</td>
        <td class="text-xs-center">{{ props.item.course_name }}</td>
        <td class="text-xs-center">{{ props.item.introduction.substring(0,10)}}...</td>
        <td class="text-xs-center">{{ props.item.course_time }}</td>
        <td class="text-xs-center">{{ props.item.fat_burning}}</td>
        <td class="text-xs-center">{{ props.item.difficulty }}</td>
        <td class="text-xs-center">{{ props.item.instrument}}</td>
        <video width="100" height="100" controls>
          <source :src="props.item.video" type="video/mp4">5
        </video>
        <td class="text-xs-center">{{ props.item.price }}￥</td>
        <td class="text-xs-center">{{ props.item.crowd }}</td>
        <td v-if="props.item.is_pay=='1'" v-text="'付费'" class="text-xs-center"></td>
        <td v-else="props.item.is_pay!='1'" v-text="'免费'" class="text-xs-center"></td>
        <td v-if="props.item.type_id=='1'" v-text="'瘦身'" class="text-xs-center"></td>
        <td v-if="props.item.type_id=='2'" v-text="'减脂'" class="text-xs-center"></td>
        <td v-if="props.item.type_id=='3'" v-text="'束腰'" class="text-xs-center"></td>
        <td v-if="props.item.type_id=='4'" v-text="'力量锻炼'" class="text-xs-center"></td>
        <td v-if="props.item.course_state=='1'" v-text="'上架'" class="text-xs-center"></td>
        <td v-if="props.item.course_state!='1'" v-text="'下架'" class="text-xs-center"></td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editBrand(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteBrand(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
      <template slot="expand" slot-scope="props">
        <v-card flat>
          <v-card-text>Peek-a-boo!</v-card-text>
        </v-card>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          对不起，没有查询到任何数据 :(
        </v-alert>
      </template>
      <template slot="pageText" slot-scope="props">
        共{{props.itemsLength}}条,当前:{{ props.pageStart }} - {{ props.pageStop }}
      </template>
    </v-data-table>

    <v-dialog v-model="show" max-width="600" scrollable v-if="show">
      <v-card>
        <v-toolbar dark dense color="primary">
          <v-toolbar-title>{{isEdit ? '修改品牌' : '新增品牌'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <brand-form :oldBrand="brand" :isEdit="isEdit" @close="show = false" :reload="getDataFromApi"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
  import BrandForm from './CourseForm'
  import {brandData} from '../../mockDB'

  export default {
    name: "brand",
    components: {
      BrandForm
    },
    data() {
      return {
        search: '',// 过滤字段
        totalItems: 0,// 总条数
        items: [],// 表格数据
        loading: true,
        pagination: {},// 分页信息
        headers: [// 表头
          {text: '课程编号', align: 'center', value: 'id'},
          {text: '课程名称', align: 'center', value: 'id'},
          {text: '课程简介', align: 'center', value: 'id'},
          {text: '时长', align: 'center', value: 'id'},
          {text: '燃脂数', align: 'center', value: 'id'},
          {text: '难度', align: 'center', value: 'id'},
          {text: '器械', align: 'center', value: 'id'},
          {text: '视频', align: 'center', value: 'id'},
          {text: '价格', align: 'center', value: 'id'},
          {text: '适宜人群', align: 'center', value: 'id'},
          {text: '是否付费', align: 'center', value: 'id'},
          {text: '类型', align: 'center', value: 'id'},
          {text: '状态', align: 'center', value: 'id'},
          {text: '备注', align: 'center', value: 'id'}
        ],
        show: false,// 是否弹出窗口
        brand: {}, // 品牌信息
        isEdit: false // 判断是编辑还是新增
      }
    },
    watch: {
      pagination: {
        handler() {
          this.getDataFromApi();
        },
        deep: true
      },
      search: {
        handler() {
          this.getDataFromApi();
        }
      },
      show(val, oldVal) {
        // 表单关闭后重新加载数据
        if (oldVal) {
          this.getDataFromApi();
        }
      }
    },
    mounted() {
      this.getDataFromApi();
    },
    methods: {
      addBrand() {
        this.brand = {};
        this.isEdit = false;
        this.show = true;
      },
      testCourse() {
       alert("test")
        // this.$http.get("/item/set")
        //   .then(resp => {
        //     console.log(resp);
        //   })
        // this.$axios.get('/item/set', {}, {
        //   headers: {
        //     "Content-Type":"application/json;charset=utf-8"
        //   },
        //   withCredentials : true
        // })
        this.$axios.get('/item/jwt/login?account=jack&password=123', {}, {
          headers: {
            "Content-Type":"application/json;charset=utf-8"
          },
          withCredentials : true
        })
      },
      queryCourse() {
       alert("query")
        // this.$http.get("/item/query")
        //   .then(resp => {
        //     console.log(resp);
        //   })
       //  this.$axios.get('/item/jwt/getMessage', {}, {
       //    headers: {
       //      "Content-Type":"application/json;charset=utf-8"
       //    },
       //    withCredentials : true
       //  })
      },
      searchCourse() {
        alert("99999999")
        this.$http.get("/item/course/findByName?name=h")
          .then(resp => {
            console.log(resp);
            this.items = resp.data;
          })
      },
      editBrand(item) {
        this.brand = item;
        this.isEdit = true;
        this.show = true;
      },
      deleteBrand(item) {
        this.$message.confirm('此操作将永久删除该品牌, 是否继续?').then(() => {
          // 发起删除请求
          alert(item.course_id)
          this.$http.delete("/item/course/removeOne?id=" + item.course_id,)
            .then(() => {
              // 删除成功，重新加载数据
              this.$message.success("删除成功！");
              this.getDataFromApi();
            })
        }).catch(() => {
          this.$message.info("删除已取消！");
        });

      },
      getDataFromApi() {
        // 200ms后返回假数据
        // window.setTimeout(() => {
        //   this.items = brandData.slice(0,4);
        //   this.totalItems = 100
        //   this.loading = false;
        // }, 200)
        this.$http.get("/item/course/list?name="+this.search)
          .then(resp => {
            console.log(resp);
            this.items = resp.data;
          })
        this.loading = false;
      }
    }
  }
</script>

<style scoped>

</style>
