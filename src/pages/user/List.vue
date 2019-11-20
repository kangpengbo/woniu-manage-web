<template>
  <v-card>
    <v-toolbar class="elevation-0">
      <v-spacer/>
      <v-flex xs3>
        状态：
        <v-btn-toggle mandatory v-model="search.saleable">
          <v-btn :value="3" flat>
            全部
          </v-btn>
          <v-btn flat :value="1">
            正常
          </v-btn>
          <v-btn flat :value="0">
            黑名单
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          append-icon="search"
          label="搜索"
          single-line
          hide-details
          v-model="search.key"
        />
      </v-flex>
    </v-toolbar>
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
        <td class="text-xs-center">{{ props.item.user_id }}</td>
        <td class="text-xs-center">{{ props.item.account }}</td>
        <td class="text-xs-center">{{ props.item.nickname}}</td>
        <td class="text-xs-center">{{ props.item.sex }}</td>
        <td class="text-xs-center">{{ dateFormat(props.item.birthday)}}</td>
        <td class="text-xs-center">{{ props.item.telephone }}</td>
        <td class="text-xs-center">{{ props.item.email}}</td>
        <td class="text-xs-center">
          <img :src="props.item.head_image" alt="图片">
        </td>
        <td class="text-xs-center">{{ props.item.height }}</td>
        <td class="text-xs-center">{{ props.item.weight }}</td>
        <td class="text-xs-center">{{ props.item.city }}</td>
        <td class="text-xs-center">
          <label icon small v-if="props.item.state!=1">黑名</label>
          <label icon v-else>正常</label>
        </td>
        <td class="text-xs-center">
          <v-btn icon small class="el-button--danger" @click="defriend(props.item.user_id,props.item.state)"
                 v-if="props.item.state==1">
            拉黑
          </v-btn>
          <v-btn icon small class="info" @click="restore(props.item.user_id,props.item.state)" v-else>复原</v-btn>
        </td>
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
  </v-card>
</template>

<script>
  import {goodsData} from "../../mockDB";

  export default {
    name: "item",
    data() {
      return {
        search: {
          key: '',
          saleable: true,
        },// 过滤字段
        totalItems: 0,// 总条数
        items: [],// 表格数据
        loading: true,
        pagination: {},// 分页信息
        headers: [// 表头
          {text: '#', align: 'center', value: 'id'},
          {text: '账号', align: 'center', value: 'account'},
          {text: '昵称', align: 'center', value: 'password'},
          {text: '性别', align: 'center', value: 'sex'},
          {text: '生日', align: 'center', value: 'birthday'},
          {text: '电话', align: 'center', value: 'telephone'},
          {text: '邮箱', align: 'center', value: 'email'},
          {text: '头像', align: 'center', value: 'head_image'},
          {text: '身高', align: 'center', value: 'height'},
          {text: '体重', align: 'center', value: 'weight'},
          {text: '地址', align: 'center', value: 'city'},
          {text: '状态', align: 'center', value: 'state'},
          {text: '操作', align: 'center'}
        ],
        step: 1,// 表单中的导航条
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
        },
        deep: true
      }
    },
    mounted() {
      this.getDataFromApi();
    },
    methods: {
      lastStep() {
        if (this.step === 1) {
          return;
        }
        this.step--;
      },
      nextStep() {
        if (this.step === 4) {
          return;
        }
        if (this.$refs.goodsForm.$refs.basic.validate()) {
          this.step++;
        }
      },/*拉黑用户*/
      defriend(id, state) {
        // 发起拉黑请求
        if (confirm("确认拉黑么？")) {
          this.$http.get("/item/user/operate?id=" + id + "&&state=" + state)
            .then(resp => {
              this.getDataFromApi();
            })
            .catch(() => {
              this.$message.info('已取消拉黑');
            });
        }
      },
      restore(id, state) {
        // 发起还原请求
        if (confirm("确认还原么？")) {
          this.$http.get("/item/user/operate?id=" + id + "&&state=" + state)
            .then(resp => {
              this.getDataFromApi();
            })
            .catch(() => {
              this.$message.info('已取消还原');
            });
        }
      },
      getDataFromApi() {
        var mess = this.search.key;
        var inf = this.search.saleable;
        this.loading = true;
        this.$http.get("/item/user/list?message=" + mess + "&&info=" + inf)
          .then(resp => {
            console.log(resp);
            this.items = resp.data;
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
      }
    }
  }
</script>

<style scoped>
  label {
    font-size: 14px;
  }
</style>
