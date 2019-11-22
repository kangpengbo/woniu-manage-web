<template>
  <v-form v-model="valid" ref="articleForm">
    <v-text-field
      label="文章标题"
      v-model="article.article_title"
      :rules="[v => !!v || '文章标题不能为空']"
      :counter="10"
      required
    />
    <v-text-field
      label="文章内容"
      v-model="article.article_content"
      :rules="[v => !!v || '文章内容不能为空']"
      :counter="30"
      required
    />
    <v-upload
      v-model="article.article_image" url="/upload/upfile/uploadImg" :multiple="false" :pic-width="250" :pic-height="90"
    />
    <v-layout class="my-4">
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear" color="warning">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  import config from '@/config';

  export default {
    name: "article-form",
    props: {
      oldArticle: Object,
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
        valid: false,
        article: this.oldArticle,
        imageDialogVisible: false
      }
    },
    watch: {
      oldArticle: {
        deep: true,
        handler(val) {
          Object.deepCopy(val, this.article);
        }
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.articleForm.validate()) {
          console.log(this.article);
          // 将数据提交到后台
          if (!this.isEdit) {
            this.$http({
              method: this.isEdit ? 'put' : 'post',
              url: '/item/article/add',
              data: {
                "article_title": this.article.article_title,
                "article_content": this.article.article_content,
                "article_image": this.article.article_image
              }
            }).then(resp => {
              // 关闭窗口
              alert(resp.data.message);
            });
          } else {
            this.$http({
              method: this.isEdit ? 'put' : 'post',
              url: '/item/article/update',
              data: {
                "article_id": this.article.article_id,
                "article_title": this.article.article_title,
                "article_content": this.article.article_content,
                "article_image": this.article.article_image
              }
            }).then(resp => {
              // 关闭窗口
              alert(resp.data.message);
            });
          }
        }
      },
      clear() {
        // 重置表单
        this.$refs.articleForm.reset();
      }
    }
  }
</script>

<style scoped>

</style>
