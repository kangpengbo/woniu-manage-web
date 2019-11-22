<template>
  <v-card>
    <v-card-title>
      <v-btn @click="addArticle" color="primary">新增文章</v-btn>
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
        <td class="text-xs-center">{{ props.item.article_id }}</td>
        <td class="text-xs-center">{{ props.item.article_title }}</td>
        <td class="text-xs-center" :title="props.item.article_content">{{ props.item.article_content|ellipsis}}</td>
        <td class="text-xs-center">{{ props.item.article_views }}</td>
        <td class="text-xs-center">{{ props.item.article_likes }}</td>
        <td class="text-xs-center" style="height: 100px">
          <img :src="props.item.article_image" style="height: 100px;width: 150px" alt="图片">
        </td>
        <td class="text-xs-center">{{ dateFormat(props.item.create_time)}}</td>
        <td class="text-xs-center">
          <label class="el-tag--danger" v-if="props.item.article_state!=1">失效</label>
          <label v-else>有效</label>
        </td>
        <td class="text-xs-center">
          <v-btn icon small class="el-button--danger" @click="dele(props.item.article_id,props.item.article_state)"
                 v-if="props.item.article_state==1">
            撤下
          </v-btn>
          <v-btn icon small class="info" @click="dele(props.item.article_id,props.item.article_state)" v-else>复原</v-btn>
        </td>
        <td class="text-xs-center">
          <v-btn icon @click="editArticle(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteArticle(props.item.article_id)">
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
          <v-toolbar-title>{{isEdit ? '修改文章' : '新增文章'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <article-form :oldArticle="article" :isEdit="isEdit" @close="show = false" :reload="getDataFromApi"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
  import ArticleForm from './ArticleForm'

  export default {
    name: "article",
    components: {
      ArticleForm
    },
    data() {
      return {
        search: '',// 过滤字段
        totalItems: 0,// 总条数
        items: [],// 表格数据
        loading: true,
        pagination: {},// 分页信息
        headers: [// 表头
          {text: '文章编号', align: 'center', sortable: false, value: 'article_id'},
          {text: '文章标题', align: 'center', sortable: false, value: 'article_title'},
          {text: '文章内容', align: 'center', sortable: false, value: 'article_content'},
          {text: '浏览量', align: 'center', sortable: false, value: 'article_views'},
          {text: '点赞数', align: 'center', sortable: false, value: 'article_likes'},
          {text: '图片', align: 'center', sortable: false, value: 'article_image'},
          {text: '发布时间', align: 'center', sortable: false, value: 'create_time'},
          {text: '状态', align: 'center', sortable: false, value: 'article_state'},
          {text: '修改', align: 'center', sortable: false},
          {text: '操作', align: 'center', sortable: false}
        ],
        show: false,// 是否弹出窗口
        article: {}, // 品牌信息
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
      addArticle() {
        this.article = {};
        this.isEdit = false;
        this.show = true;
      },
      dele(id, stateid) {
        if (confirm("确认修改状态么？")) {
          this.$http.get("/item/article/operate?id=" + id + "&&state=" + stateid)
            .then(resp => {
              this.getDataFromApi();
            })
            .catch(() => {
              this.$message.info('已取消修改');
            });
        }
      },
      getDataFromApi() {
        this.loading = true;
        var mess = this.search;
        this.loading = true;
        this.$http.get("/item/article/list?message=" + mess)
          .then(resp => {
            console.log(resp);
            this.items = resp.data.map.articleList;
          })
        this.loading = false;
      },
      dateFormat(time) {
        var date = new Date(time);
        var year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return year + "-" + month + "-" + day;
      },
      deleteArticle(id) {
        if (confirm("确认删除么？")) {
          this.loading = true;
          this.$http.get("/item/article/delete?id=" + id)
            .then(resp => {
              alert(resp.data.message);
              this.getDataFromApi();
            })
          this.loading = false;
        }
      },
      editArticle(item) {
        this.article = item;
        this.isEdit = true;
        this.show = true;
      },
    },
    filters: {
      ellipsis(value) {
        if (!value) return ''
        if (value.length > 20) {
          return value.slice(0, 20) + '...'
        }
        return value
      }
    }
  }
</script>

<style scoped>

</style>
