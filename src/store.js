import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    devBaseUrl: "http://122.115.50.65",
    rules: {
      required: val =>
        val instanceof Array
          ? !!val.length
          : !!val || val === 0 || "此项为必填项",
      noZero: val => val != 0 || "此项不能为零",
      nonnegative: val => val >= 0 || "此项不能为负",
      testFloorNumber: val =>
        !new RegExp(/[^(\-?)\d+]/gi).test(val) || "该项需为整数",
      lengthLessThan: num => val =>
        (val || "").length <= num || `该项长度需小于${num}`,
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "此项需按e-mail格式";
      }
    },
    snackbar: [],
    toolBarIsBack: false,
    toolBarCrumbs: [],
    toolBarTitle: ""
  },
  getters: {
    getBaseUrl: state => {
      if (process.env.NODE_ENV == "development") {
        return state.devBaseUrl;
      }
      return "";
    }
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
    changeToolBarTitle(state, toolBar) {
      let { title, isBack, crumbs } = toolBar;
      state.toolBarTitle = title;
      state.toolBarIsBack = isBack || false;
      state.toolBarCrumbs = crumbs || [];
    }
  },
  actions: {}
});
