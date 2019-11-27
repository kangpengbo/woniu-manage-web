<template>
  <v-form  v-model="valid" ref="courseForm">
    <text v-model="brand.course_id"></text>
    <v-text-field
      label="课程名称"
      v-model="brand.course_name"
      :rules="[v => !!v || '课程名称不能为空']"
      :counter="10"
      required
    />
    <v-text-field
      label="课程简介"
      v-model="brand.introduction"
      required
    />
    <v-text-field
      label="时长"
      v-model="brand.course_time"
      required
    />
    <v-text-field
      label="燃脂数"
      v-model="brand.fat_burning"
      required
    />
    <v-text-field
      label="难度"
      v-model="brand.difficulty"
      required
    />
    <v-text-field
      label="器械"
      v-model="brand.instrument"
      required
    />
    <v-text-field
      label="价格"
      v-model="brand.price"
      required
    />
    <v-text-field
      label="适宜人群"
      v-model="brand.crowd"
      required
    />
    类型：
    <select v-model="brand.is_pay" style="width:200px;height: 30px;">
      <option value="2">请选择</option>
      <option value="1">收费</option>
      <option value="0">免费</option>
    </select>
    <br><hr style="color: red;"><br>
    课程类型：
    <select v-model="brand.type_id" style="width:200px;height: 30px;">
      <option value="0">请选择</option>
      <option value="1">瘦身</option>
      <option value="2">减脂</option>
      <option value="3">束腰</option>
      <option value="4">力量锻炼</option>
    </select>
    <br><hr style="color: red;"><br>
    <!--<v-cascader url="/item/category/list" required-->
                <!--v-model="brand.categories"-->
                <!--multiple label="书籍描述"/>-->
    <!--<v-layout row>-->
      <!--<v-flex xs3>-->
        <!--<span style="font-size: 16px; color: #444">品牌LOGO：</span>-->
      <!--</v-flex>-->
      <!--<v-flex>-->
    视频：<br><br>
        <v-upload
          v-model="brand.video" url="/upload/upfile/uploadImg" :multiple="false" :pic-width="250" :pic-height="90"
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
          course_id:"",
          course_name:"",
          introduction: "",
          course_time:"",
          fat_burning: "",
          difficulty: "",
          instrument: "",
          video: "",
          price: "",
          crowd: "",
          is_pay: "2",
          type_id: "0",
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

        //修改课程
        if (this.isEdit){
          alert(this.brand.course_id)
          //将数据提交到后台
          this.$http({
            method: 'post',
            url: '/item/course/modifyOne',
            data:{
              "course_id":this.brand.course_id,
              "course_name":this.brand.course_name,
              "introduction":this.brand.introduction,
              "course_time":this.brand.course_time,
              "fat_burning":this.brand.fat_burning,
              "difficulty":this.brand.difficulty,
              "instrument":this.brand.instrument,
              "video":this.brand.video,
              "price":this.brand.price,
              "crowd":this.brand.crowd,
              "is_pay":this.brand.is_pay,
              "type_id":this.brand.type_id}
            // this.$qs.stringify(this.brand)
          }).then(() => {
            // 关闭窗口
            this.$message.success("保存成功！");
            this.closeWindow();
          }).catch(() => {
            this.$message.error("保存失败！");
          });
          return;
        }
        alert("9999999999")
        //增加课程
        this.$http({
          method: 'post',
          url: '/item/course/addOne',
          data:{
            "course_name":this.brand.course_name,
            "introduction":this.brand.introduction,
            "course_time":this.brand.course_time,
            "fat_burning":this.brand.fat_burning,
            "difficulty":this.brand.difficulty,
            "instrument":this.brand.instrument,
            "video":this.brand.video,
            "crowd":this.brand.crowd,
            "is_pay":this.brand.is_pay,
            "type_id":this.brand.type_id}
          // this.$qs.stringify(this.brand)
        }).then(() => {
          // 关闭窗口
          this.$message.success("保存成功！");
          this.closeWindow();
        }).catch(() => {
          this.$message.error("保存失败！");
        });


        if (this.$refs.courseForm.validate()) {
          console.log(this.brand);
          // this.brand.categories = this.brand.categories.map(c => c.id);
          this.brand.firstLetter =this.brand.firstLetter.toUpperCase();
          //如果是修改数据
          // if (this.isEdit){
          //   console.log(this.brand);
          //
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
          alert("999999999")
          this.$http({
            method: this.isEdit ? 'put' : 'post',
            url: '/item/course/addOne',
            data:{
              "course_name":this.brand.course_name,
              "introduction":this.brand.introduction,
              "course_time":this.brand.course_time,
              "fat_burning":this.brand.fat_burning,
              "difficulty":this.brand.difficulty,
              "instrument":this.brand.instrument,
              "video":this.brand.video,
              "crowd":this.brand.crowd,
              "is_pay":this.brand.is_pay,
              "course_name":this.brand.course_name,
              "type_id":this.brand.type_id}
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
