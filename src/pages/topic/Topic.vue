<template>
  <v-card>
    <v-card-title>
      <v-btn @click="addTopic" color="primary">新增话题</v-btn>
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
        <td class="text-xs-center">{{ props.item.topic_id }}</td>
        <td class="text-xs-center">{{ props.item.topic_title }}</td>
        <td class="text-xs-center" :title="props.item.topic_content">{{ props.item.topic_content|ellipsis}}</td>
        <td class="text-xs-center">{{ props.item.topic_views }}</td>
        <td class="text-xs-center">{{ props.item.topic_likes }}</td>
        <td class="text-xs-center">{{ dateFormat(props.item.create_time)}}</td>
        <td class="text-xs-center">
          <label class="el-tag--danger" v-if="props.item.topic_state!=1">失效</label>
          <label v-else>有效</label>
        </td>
        <td class="text-xs-center">
          <v-btn icon small class="el-button--danger" @click="dele(props.item.topic_id,props.item.topic_state)"
                 v-if="props.item.topic_state==1">
            撤下
          </v-btn>
          <v-btn icon small class="info" @click="dele(props.item.topic_id,props.item.topic_state)" v-else>复原</v-btn>
          <v-btn icon @click="deleteTopic(props.item.topic_id)">
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
          <v-toolbar-title>{{isEdit ? '修改话题' : '新增话题'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <topic-form :oldTopic="topic" :isEdit="isEdit" @close="show = false" :reload="getDataFromApi"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
  import TopicForm from './TopicForm'

  export default {
    name: "topic",
    components: {
      TopicForm
    },
    data() {
      return {
        search: '',// 过滤字段
        totalItems: 0,// 总条数
        items: [],// 表格数据
        loading: true,
        pagination: {},// 分页信息
        headers: [// 表头
          {text: '话题编号', align: 'center', sortable: false, value: 'topic_id'},
          {text: '话题标题', align: 'center', sortable: false, value: 'topic_title'},
          {text: '话题内容', align: 'center', sortable: false, value: 'topic_content'},
          {text: '访问量', align: 'center', sortable: false, value: 'topic_views'},
          {text: '浏览量', align: 'center', sortable: false, value: 'topic_likes'},
          {text: '发布时间', align: 'center', sortable: false, value: 'create_time'},
          {text: '状态', align: 'center', sortable: false, value: 'topic_state'},
          {text: '操作', align: 'center', sortable: false}
        ],
        show: false,// 是否弹出窗口
        topic: {}, // 品牌信息
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
      addTopic() {
        this.topic = {};
        this.isEdit = false;
        this.show = true;
      },
      dele(id, stateid) {
        if (stateid == 1) {
          if (confirm("确认撤下么？")) {
            this.$http.get("/item/topic/remove?id=" + id + "&&state=" + stateid)
              .then(resp => {
                this.getDataFromApi();
              })
              .catch(() => {
                this.$message.info('已取消撤下');
              });
          }
        } else {
          if (confirm("确认还原么？")) {
            this.$http.get("/item/topic/remove?id=" + id + "&&state=" + stateid)
              .then(resp => {
                this.getDataFromApi();
              })
              .catch(() => {
                this.$message.info('已取消还原');
              });
          }
        }
      },
      getDataFromApi() {
        this.loading = true;
        var mess = this.search;
        this.loading = true;
        this.$http.get("/item/topic/list?message=" + mess)
          .then(resp => {
            console.log(resp);
            this.items = resp.data.map.topiclist;
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
      deleteTopic(id) {
        if (confirm("确认删除么？")) {
          this.loading = true;
          this.$http.get("/item/topic/delete?id=" + id)
            .then(resp => {
              alert(resp.data.message);
              this.getDataFromApi();
            })
          this.loading = false;
        }
      }
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
