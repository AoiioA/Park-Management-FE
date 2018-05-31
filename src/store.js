import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    rules: {
      required: val =>
        val instanceof Array
          ? !!val.length
          : !!val || val === 0 || "此项为必填项",
      noZero: val => val != 0 || "此项不能为零",
      nonnegative: val => val >= 0 || "此项不能为负",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "此项需按e-mail格式";
      }
    },
    snackbar: [],
    toolBarTitle: ""
  },
  mutations: {
    addSnackBar(state, text, type) {
      let newSnackBar = [];
      state.snackbar.forEach(el => {
        if (el.value != false) newSnackBar.push(el);
      });
      newSnackBar.push({
        color: type,
        text: text,
        value: true,
        temp: new Date()
      });
      state.snackbar = newSnackBar;
    },
    closeSnackBar(state, index) {
      state.snackbar[index].value = false;
    },
    changeToolBarTitle(state, title) {
      state.toolBarTitle = title;
    }
  },
  actions: {}
});
