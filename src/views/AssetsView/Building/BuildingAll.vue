<template>
  <div class="build-all">
    <v-jumbotron color="blue-grey lighten-4" height="auto">
      <v-container grid-list-xl fill-height>
        <v-layout align-start align-content-start justify-center wrap>
          <v-flex xs12 md10 tag="h1" class="title grey--text text--darken-1">楼宇列表</v-flex>
          <v-flex xs12 md10>
            <v-card>
              <v-card-title class="py-2">
                <v-text-field
                  flat
                  solo
                  prepend-icon="search"
                  label="在列表中搜索..."
                  v-model="search"
                ></v-text-field>
                <v-dialog v-model="newDialog" max-width="500px">
                  <v-btn color="primary" slot="activator">添加新项</v-btn>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm6 md4 v-for="(val, key) in editedItem" :key="key" v-if="key != 'id'">
                            <v-text-field :label="key" v-model="editedItem[key]"></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat @click.native="closeNewDialog">放弃编辑</v-btn>
                      <v-btn color="primary" depressed @click.native="saveNewDialog">保存内容</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="delDialog" max-width="290px">
                  <v-card>
                    <v-card-title class="headline">确定删除该项？</v-card-title>
                    <v-card-text>点击刷新按钮可复原列表。</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="error" flat @click.native="confirmDelDialog()">十分确定</v-btn>
                      <v-btn color="primary" depressed @click.native="delDialog = false">再想想看</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-tooltip bottom>
                  <v-btn icon @click="initialize" slot="activator">
                    <v-icon>refresh</v-icon>
                  </v-btn>
                  <span>刷新数据</span>
                </v-tooltip>
                <v-menu offset-y left :nudge-bottom="10">
                  <v-btn icon slot="activator">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list two-line dense>
                    <v-list-tile disabled @click="1">
                      <v-list-tile-content>
                        <v-list-tile-title>列表菜单选项一</v-list-tile-title>
                        <v-list-tile-sub-title>这是一条列表菜单的选择项</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="1">
                      <v-list-tile-content>
                        <v-list-tile-title>列表菜单选项二</v-list-tile-title>
                        <v-list-tile-sub-title>这是一条列表菜单的选择项</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-divider></v-divider>
              <v-data-table
                :search="search"
                :headers="headers"
                :items="items"
                item-key="id"
                :no-data-text="`暂无数据`"
                :no-results-text="`没能找到“${ search }”的结果...`"
              >
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.calories }}</td>
                    <td>{{ props.item.fat }}</td>
                    <td>{{ props.item.carbs }}</td>
                    <td>{{ props.item.protein }}</td>
                    <td class="text-xs-center px-0">
                      <v-btn icon class="mx-0" @click.stop="editNewDialog(props.item)">
                        <v-icon color="primary">edit</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-0" @click.stop="openDelDialog(props.item)">
                        <v-icon color="pink">delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card flat>
                    <!-- <v-card-title class="headline">{{props.item.name}}</v-card-title> -->
                    <v-card-text>{{props.item.detail}}</v-card-text>
                  </v-card>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>
</template>

<script>
export default {
  data: () => ({
    newDialog: false,
    delDialog: false,
    headers: [
      { text: "Dessert (100g serving)", value: "name", sortable: false },
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      { text: "Carbs (g)", value: "carbs" },
      { text: "Protein (g)", value: "protein" },
      { text: "Actions", value: "name", sortable: false }
    ],
    items: [],
    search: "",
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: "",
      fat: "",
      carbs: "",
      protein: "",
      detail: ""
    },
    defaultItem: {
      name: "",
      calories: "",
      fat: "",
      carbs: "",
      protein: "",
      detail: ""
    },
    delIndex: -1
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "添加新项" : "修改项目";
    }
  },
  watch: {
    newDialog(val) {
      val || this.closeNewDialog();
    },
    delDialog(val) {
      val || (this.delDialog = false);
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.items = [
        {
          id: 1,
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          detail: "bulabulabula..."
        },
        {
          id: 2,
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          detail: "bulabulabula..."
        },
        {
          id: 3,
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          detail: "bulabulabula..."
        },
        {
          id: 4,
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          detail: "bulabulabula..."
        },
        {
          id: 5,
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          detail: "bulabulabula..."
        }
      ];
    },
    editNewDialog(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.newDialog = true;
    },
    closeNewDialog() {
      this.newDialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    saveNewDialog() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        Object.assign(this.editedItem, { id: this.items.length });
        this.items.push(this.editedItem);
      }
      this.closeNewDialog();
    },
    openDelDialog(item) {
      this.delIndex = this.items.indexOf(item);
      this.delDialog = true;
    },
    confirmDelDialog() {
      this.items.splice(this.delIndex, 1);
      this.delDialog = false;
    }
  }
};
</script>
