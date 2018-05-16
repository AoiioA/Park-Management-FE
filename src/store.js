import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
