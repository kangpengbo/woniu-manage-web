<template>
  <v-form v-model="valid" ref="brandForm">
    <v-text-field
      label="书籍名称"
      v-model="brand.name"
      :rules="[v => !!v || '品牌名称不能为空']"
      :counter="10"
      required
    />
    <v-text-field
      label="作者"
      v-model="brand.author"
      required
    />
    <v-text-field
      label="出版商"
      v-model="brand.publisher"
      required
    />
    <v-text-field
      label="价格"
      v-model="brand.price"
      required
    />
    <v-text-field
      label="类型"
      v-model="brand.typeid"
      required
    />
    <v-text-field
      label="库存"
      v-model="brand.pnum"
      required
    />
    <!--<v-cascader url="/item/category/list" required-->
    <!--v-model="brand.categories"-->
    <!--multiple label="书籍描述"/>-->
    <!--<v-layout row>-->
    <!--<v-flex xs3>-->
    <!--<span style="font-size: 16px; color: #444">品牌LOGO：</span>-->
    <!--</v-flex>-->
    <!--<v-flex>-->
    <v-upload
    v-model="brand.pnum" url="/upload/upfile/uploadImg" :multiple="false" :pic-width="250" :pic-height="90"
    />
    <!--</v-flex>-->
    <!--</v-layout>-->
    <v-layout class="my-4">
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear" color="warning">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  import config from '@/config';
  export default {
    name: "brand-form",
    props: {
      oldBrand: Object,
      isEdit: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        baseUrl: config.api,
        valid:false,
        brand: {
          id:"",
          name: "",
          author:"",
          publisher: "",
          price: "",
          typeid: "",
          pnum: "",
          imgurl: "",
          categories: []
        },
        imageDialogVisible:false
      }
    },
    watch: {
      oldBrand:{
        deep:true,
        handler(val){
          Object.deepCopy(val,this.brand);
        }
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.brandForm.validate()) {
          // this.brand.categories = this.brand.categories.map(c => c.id);
          //如果是修改数据
          // if (this.isEdit){
          //   console.log(this.brand);

          //   // 将数据提交到后台
          //   this.$http({
          //     method: this.isEdit ? 'put' : 'post',
          //     url: '/item/bookType/modify',
          //     data:{"typeName":this.brand.typeName, "typeid":this.brand.typeid,"typedecription":this.brand.typedecription,"firstLetter":this.brand.firstLetter}
          //     // this.$qs.stringify(this.brand)
          //   }).then(() => {
          //     // 关闭窗口
          //     this.$message.success("保存成功！");
          //     this.closeWindow();
          //   }).catch(() => {
          //     this.$message.error("保存失败！");
          //   });
          //   return;
          // }
          // 将数据提交到后台
          alert(7777777)
          alert(this.brand.name)
          this.$http({
            method: 'post',
            url: '/item/product/add',
            data:{"name":this.brand.name,
              "author":this.brand.author,
              "publisher":this.brand.publisher,
              "price":this.brand.price,
              "typeid":this.brand.typeid,
              "pnum":this.brand.pnum,
              "imgurl":this.brand.imgurl}
            // this.$qs.stringify(this.brand)
          }).then(() => {
            // 关闭窗口
            this.$message.success("保存成功！");
            this.closeWindow();
          }).catch(() => {
            this.$message.error("保存失败！");
          });
        }
      },
      clear() {
        // 重置表单
        this.$refs.brandForm.reset();
        this.categories = [];
      },
      // // 图片上传出成功后操作
      // handleImageSuccess(res) {
      //   this.brand.image = res;
      // },
      // removeImage(){
      //   this.brand.image = "";
      // },
      closeWindow(){
        this.$emit("close");
      }
    },
    //修改数据回显
    mounted() {
      if (this.isEdit){
        this.brand=Object.deepCopy(this.oldBrand);
      }
    }
  }
</script>

<style scoped>

</style>
