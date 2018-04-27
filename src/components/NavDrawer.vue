<template>
  <v-navigation-drawer
    app
    dark
    fixed
    v-model="drawer"
    :mini-variant="mini"
    class="pb-0"
  >
    <v-layout
      fill-height
      column
    >
      <v-flex style="flex: none">
        <v-list class="pt-1 pb-1">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://vuetifyjs.com/static/doc-images/logo.svg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Park Management</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <!-- <v-divider light></v-divider> -->
      </v-flex>
      <v-flex>
        <v-list subheader>
          <template v-for="navItem in navItems">
            <v-list-group
              v-if="navItem.child"
              :key="navItem.title"
              v-model="navItem.active"
              :prepend-icon="navItem.action"
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>{{ navItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list dense v-if="navItem.child.length">
                <v-list-tile
                  v-for="subItem in navItem.child"
                  :key="subItem.title"
                  :to="subItem.url"
                  ripple
                >
                  <v-list-tile-action>
                    <v-icon>{{ subItem.action }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-list-group>
            <v-list-tile
              v-else-if="navItem.url"
              :key="navItem.title"
              :prepend-icon="navItem.action"
              :to="navItem.url"
            >
              <v-list-tile-action>
                <v-icon>{{ navItem.action }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ navItem.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
      <v-flex style="flex: none">
        <v-list v-if="mini">
          <v-list-tile @click.stop="mini = !mini">
            <v-list-tile-action>
              <v-icon>chevron_right</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavDrawer",
  props: {
    isDrawer: Boolean,
    isMini: Boolean
  },
  data() {
    return {
      navItems: [
        {
          action: "local_activity",
          title: "工作台",
          active: true,
          url: "/home"
        },
        {
          action: "restaurant",
          title: "资产管理",
          child: [
            { action: "local_activity", title: "楼宇管理", url: "/about" },
            { action: "local_activity", title: "房源管理", url: "/about" },
            { action: "local_activity", title: "网点管理", url: "/about" }
          ]
        },
        {
          action: "content_cut",
          title: "招商管理",
          child: [
            { action: "local_activity", title: "预约看房", url: "/about" },
            { action: "local_activity", title: "客户管理", url: "/about" },
            { action: "local_activity", title: "中介商管理", url: "/about" }
          ]
        },
        {
          action: "school",
          title: "合同管理",
          child: [
            { action: "local_activity", title: "已生效合同", url: "/about" },
            { action: "local_activity", title: "待提交合同", url: "/about" },
            { action: "local_activity", title: "待审核合同", url: "/about" }
          ]
        },
        {
          action: "directions_run",
          title: "财务管理",
          child: [
            { action: "local_activity", title: "租金管理", url: "/about" },
            { action: "local_activity", title: "服务金管理", url: "/about" },
            { action: "local_activity", title: "其他费用管理", url: "/about" }
          ]
        },
        {
          action: "healing",
          title: "物业管理",
          url: "/home"
        },
        {
          action: "local_offer",
          title: "数据分析",
          url: "/home"
        }
      ]
    };
  },
  computed: {
    drawer: {
      get() {
        return this.isDrawer;
      },
      set(newValue) {
        this.$emit("update:isDrawer", newValue);
      }
    },
    mini: {
      get() {
        return this.isMini;
      },
      set(newValue) {
        this.$emit("update:isMini", newValue);
      }
    }
  }
};
</script>
