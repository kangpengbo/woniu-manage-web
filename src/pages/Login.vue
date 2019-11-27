<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>蜗牛商城后台管理</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" v-model="account" label="用户名" type="text"/>
                  <v-text-field
                    prepend-icon="lock"
                    v-model="password"
                    label="密码"
                    id="password"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'text' : 'password'"
                 ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="doLogin">登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-dialog v-model="dialog" width="300px">
      <v-alert icon="warning" color="error" :value="true">
      用户名和密码不能为空
      </v-alert>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    account: "",
    password: "",
    dialog: false,
    e1:false
  }),
  methods: {
    doLogin() {
      if (!this.account || !this.password) {
        this.dialog = true;
        return false;
      }
      this.$http({
        method:'post',
        url: '/item/user/login',
        data: {
          "account":this.account,
          "password":this.password
        }
      }).then(resp => {
        console.log(resp);
        if(1==(resp.data.message)){
          //存用户信息
          localStorage.setItem('user', resp.data.user.account);
          this.$router.push("/index");
         /* this.$router.push({
            name: 'Index'
          })*/
        }else{
          this.message.info("登录失败");
        }
      })
      /*console.log(this.account + " ... " + this.password);
      this.$router.push("/");*/
    }
  }
};
</script>
