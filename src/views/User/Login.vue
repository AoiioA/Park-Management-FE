<template>
  <v-app>
    <v-jumbotron height="100%" :src="require('@/assets/login_bg.svg')">
      <!-- <img src="@/assets/login_bg.svg" /> -->
      <v-container fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6 lg5 xl4>
            <v-subheader class="subheading">
              科技金融园区共享服务平台
            </v-subheader>
            <v-card>
              <v-container fluid grid-list-xl>
                <v-card-title primary-title>
                  <v-layout column>
                    <v-flex class="headline">
                      欢迎登录
                    </v-flex>
                  </v-layout>
                </v-card-title>
                <v-card-text>
                  <v-layout column>
                    <v-flex>
                      <v-form ref="userForm" v-model="userValid" lazy-validation>
                        <v-text-field
                          :disabled="loginLoading"
                          v-model="userInfo.username"
                          :rules="[$store.state.rules.required]"
                          label="您的用户名"
                        ></v-text-field>
                        <v-text-field
                          :disabled="loginLoading"
                          v-model="userInfo.password"
                          @input="passwordHint=[]"
                          @keyup.enter="userLogin"
                          :rules="[$store.state.rules.required]"
                          :type="showPassword ? 'text' : 'password'"
                          :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                          @click:append="() => (showPassword = !showPassword)"
                          label="您的密码"
                          :error-messages="passwordHint"
                          persistent-hint
                        ></v-text-field>
                      </v-form>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="1" color="primary" flat class="mx-0">忘记您的密码？</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="!userValid||!!passwordHint.length" @click="userLogin" :loading="loginLoading" color="primary" class="mr-3">登录</v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
            <v-subheader class="subheading">
              <v-spacer></v-spacer>
              <v-btn @click="1" color="grey darken-1" small flat class="mx-0">帮助</v-btn>
              <v-btn @click="1" color="grey darken-1" small flat class="mx-0">服务条款</v-btn>
            </v-subheader>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </v-app>
</template>

<script>
export default {
  name: "login",
  data: () => ({
    userInfo: {
      username: "",
      password: ""
    },
    userValid: true,
    showPassword: false,
    loginLoading: false,
    passwordHint: []
  }),
  methods: {
    userLogin() {
      if (this.$refs.userForm.validate()) {
        this.loginLoading = true;
        this.passwordHint = [];
        this.$http
          .post("/cms/core/user/login.json", {
            code: this.userInfo.username,
            password: this.userInfo.password
          })
          .then(res => {
            this.loginLoading = false;
            if (res.data.code != 500) {
              this.$store.commit("addSuccessBar", "登录成功 欢迎回来");
              window.localStorage.setItem(
                "userInfo",
                JSON.stringify(res.data.data)
              );
              this.$router.push("/home");
            } else {
              throw new Error(res.data.msg);
            }
          })
          .catch(err => {
            this.loginLoading = false;
            this.passwordHint = ["用户不存在或密码错误"];
            this.$store.commit("addErrorBar", `登录失败 ${err}`);
          });
      }
    }
  }
};
</script>
