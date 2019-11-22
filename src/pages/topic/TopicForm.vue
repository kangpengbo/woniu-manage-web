<template>
  <v-form v-model="valid" ref="topicForm">
    <v-text-field
      label="话题标题"
      v-model="topic.topic_title"
      :rules="[v => !!v || '话题标题不能为空']"
      :counter="10"
      required
    />
    <v-text-field
      label="话题内容"
      v-model="topic.topic_content"
      :rules="[v => !!v || '话题内容不能为空']"
      :counter="30"
      required
    />
    <v-upload
      v-model="topic.topic_image" url="/upload/upfile/uploadImg" :multiple="false" :pic-width="250" :pic-height="90"
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
    name: "topic-form",
    props: {
      oldTopic: Object,
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
        topic: {
          topic_title: "",
          topic_content: "",
          topic_image: ""
        },
        imageDialogVisible: false
      }
    },
    watch: {
      oldTopic: {
        deep: true,
        handler(val) {
          Object.deepCopy(val, this.topic);
        }
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.topicForm.validate()) {
          console.log(this.topic);
          // 将数据提交到后台
          this.$http({
            method: this.isEdit ? 'put' : 'post',
            url: '/item/topic/add',
            data: {
              "topic_title": this.topic.topic_title,
              "topic_content": this.topic.topic_content,
              "topic_image": this.topic.topic_image
            }
          }).then(resp => {
            // 关闭窗口
            alert(resp.data.message);
          });
        }
      },
      clear() {
        // 重置表单
        this.$refs.topicForm.reset();
      }
    }
  }
</script>

<style scoped>

</style>
