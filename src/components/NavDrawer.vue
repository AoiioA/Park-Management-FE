<template>
  <v-navigation-drawer
    app
    dark
    fixed
    v-model="drawer"
    :mini-variant="mini"
    class="pb-0 nav-drawer"
  >
    <v-layout
      fill-height
      column
    >
      <v-flex>
        <v-list class="py-1">
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
        <v-divider light></v-divider>
      </v-flex>
      <v-flex class="no-scroll nav-list">
        <v-expansion-panel expand class="elevation-0">
          <v-expansion-panel-content v-for="navItem in navItems" :key="navItem.title">
            <div slot="header" class="nav-list-header">
              <v-list two-line>
                <v-list-tile>
                  <v-list-tile-avatar>
                    <v-icon>{{ navItem.action }}</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ navItem.title }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ navItem.child.map(el=>el.title).join('，') }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </div>
            <v-list dense class="nav-sublist">
              <v-tooltip
                v-for="subItem in navItem.child"
                :key="subItem.title"
                right
              >
                <v-list-tile
                  :to="subItem.url"
                  slot="activator"
                  ripple
                >
                  <v-list-tile-action>
                    <v-icon small>{{ subItem.action }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <span>{{ subItem.title }}</span>
              </v-tooltip>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex>
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
          action: "dashboard",
          title: "工作台",
          active: true,
          child: [
            { action: "dashboard", title: "总览", url: "/home/dashboard" }
          ]
        },
        {
          action: "business",
          title: "资产管理",
          child: [
            { action: "business", title: "园区管理", url: "/home/park" },
            { action: "business", title: "楼宇管理", url: "/home/building" },
            { action: "business", title: "房源管理", url: "/home/house" }
          ]
        },
        {
          action: "gavel",
          title: "招商管理",
          child: [
            { action: "gavel", title: "预约管理", url: "/home/sale" },
            { action: "gavel", title: "客户管理", url: "/home/404" },
            { action: "gavel", title: "中介商管理", url: "/home/404" }
          ]
        },
        {
          action: "receipt",
          title: "合同管理",
          child: [
            {
              action: "receipt",
              title: "合同概览",
              url: "/home/contract/list"
            },
            {
              action: "receipt",
              title: "合同审核",
              url: "/home/contract/examine"
            }
          ]
        },
        {
          action: "attach_money",
          title: "财务管理",
          child: [
            { action: "attach_money", title: "租金管理", url: "/home/finance" },
            { action: "attach_money", title: "其他费用", url: "/home/404" }
          ]
        },
        {
          action: "build",
          title: "物业管理",
          child: [
            { action: "build", title: "资产维护", url: "/home/property" },
            { action: "build", title: "水电管理", url: "/home/404" },
            { action: "build", title: "卫生管理", url: "/home/404" }
          ]
        },
        {
          action: "bubble_chart",
          title: "数据分析",
          child: [
            { action: "bubble_chart", title: "数据概览", url: "/home/analysis" }
          ]
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

<style lang="stylus" scoped>
.no-scroll {
  &::-webkit-scrollbar {
    display: none;
  }
}

.nav-drawer {
  overflow: hidden;

  .flex {
    flex: none;

    &.nav-list {
      flex: auto;
      overflow-x: hidden;
      overflow-y: auto;

      .expansion-panel {
        .expansion-panel__container {
          &.expansion-panel__container--active {
            background: rgba(0, 0, 0, 0.3);
          }

          .nav-list-header {
            .list__tile__sub-title {
              text-overflow: ellipsis;
              overflow: hidden;
              max-width: 150px;
            }
          }

          .nav-sublist {
            border-bottom: 1px solid hsla(0, 0%, 100%, 0.12);

            .list__tile__action {
              text-align: center;
              display: inline-block;
              line-height: 40px;
              font-size: 0;
            }
          }
        }
      }
    }
  }
}

.nav-drawer {
  & /deep/ .expansion-panel__container {
    border-top: 0;
  }

  & /deep/ .expansion-panel__header {
    padding: 0 16px 0 0;
  }

  &.navigation-drawer--mini-variant /deep/ .expansion-panel__header {
    display: none;
  }
}
</style>
