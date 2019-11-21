<template>
  <v-card>
    <v-toolbar class="elevation-0">
      <v-btn @click="addItem" color="primary">新增商品</v-btn>
      <v-spacer/>
      <v-flex xs3>
        状态：
        <v-btn-toggle mandatory v-model="search.saleable">
          <v-btn flat>
            全部
          </v-btn>
          <v-btn flat :value="true">
            上架
          </v-btn>
          <v-btn flat :value="false">
            下架
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
        <td class="text-xs-center">{{ props.item.dynamic_id }}</td>
        <td class="text-xs-center">{{ props.item.user_id }}</td>
        <td class="text-xs-center">{{ props.item.dynamic_content}}</td>
        <td class="text-xs-center" v-if="props.item.state==1"><img :src="props.item.dynamic_image " width="50px"></td>
        <td class="text-xs-center" v-else>/</td>
        <td class="text-xs-center" v-if="props.item.state==2">
            <a :href="props.item.dynamic_video">查看视频</a>
        </td>
        <td class="text-xs-center" v-else>/</td>
        <td class="text-xs-center">{{ props.item.create_time|formatDate}}</td>

        <td class="justify-center layout px-0">
          <v-btn icon small @click="deleteItem(props.item.dynamic_id)">
            <i class="el-icon-delete"/>
          </v-btn>
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

    <v-dialog v-if="show" v-model="show" max-width="900" scrollable persistent>
      <v-card>
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改商品' : '新增商品'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="closeForm">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="height: 600px;">
          <!-- 表单 -->
          <goods-form :oldGoods="selectedGoods" :isEdit="isEdit" :step="step" ref="goodsForm" @closeForm="closeForm"/>
        </v-card-text>
        <!--<v-card-actions>
          <v-layout row justify-center>
            <v-flex xs2>
              <v-btn :disabled="step === 1" @click="lastStep">上一步</v-btn>
            </v-flex>
            <v-flex xs2>
              <v-btn :disabled="step === 4" color="primary" @click="nextStep">下一步</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>-->
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  export default {
    name: "check",
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
          {text: 'id', align: 'center', value: 'dynamic_id'},
          {text: '用户id', align: 'center', sortable: false, value: 'user_id'},
          {text: '文字内容', align: 'center', sortable: false, value: 'dynamic_content'},
          {text: '图片', align: 'center', value: 'dynamic_image', sortable: true,},
          {text: '视频', align: 'center', value: 'dynamic_video', sortable: false,},
          {text: '发布时间', align: 'center', value: 'create_time', sortable: true,},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
        show: false,// 是否弹出窗口
        selectedGoods: null, // 选中的商品信息
        isEdit: false, // 判断是编辑还是新增
        step: 1// 表单中的导航条
      }
    },
    filters: {
      formatDate(dateStr,time) {
        //得到特定的时间
        var date = new Date(dateStr);
        var year = date.getFullYear();
        //ES6语法填充：var month = (date.getMonth()+1).toString().padStart(2, '0');
        var month = date.getMonth()+1<10 ? '0'+ (date.getMonth()+1) : date.getMonth()+1;
        var day = date.getDate()<10 ? '0' + date.getDate() : date.getDate();
        var hh = date.getHours()<10 ? '0' + date.getHours() : date.getHours();
        var mm = date.getMinutes()<10 ? '0' + date.getMinutes() : date.getMinutes();
        var ss = date.getSeconds()<10 ? '0' + date.getSeconds() : date.getSeconds();
        //return `${year}-${month}-${day}`;
        if(time&&time.toLowerCase() === 'yyyy-mm-dd'){
          return `${year}-${month}-${day}`;
        }else if(time&&time.toLowerCase() === 'hh:mm:ss'){
          return `${hh}:${mm}:${ss}`;
        }else{
          return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
        }
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
      }
    },
    mounted() {
      this.getDataFromApi();
    },
    methods: {
      deleteItem(id) {
        this.$message.confirm('此操作将永久删除该商品, 是否继续?')
          .then(resp => {
            // 发起删除请求
            this.$http.delete("/item/dynamic/del?id=" + id)
              .then(() => {
                // 删除成功，重新加载数据
                this.$message.info('删除成功!');
                this.getDataFromApi();
              })
          })
          .catch(() => {
            this.$message.info('已取消删除');
          });
      },
      getDataFromApi() {
        var account=this.search.key;
        this.loading = true;
        this.$http.get("/item/dynamic/all?account=account")
          .then(resp => {
            console.log(resp);
            this.items = resp.data.map.dynamics;
          })
          .catch(() => {
            this.message.info("操作错误");
          });
      }
    }
  }
</script>

<style scoped>
  label {
    font-size: 14px;
  }
</style>
