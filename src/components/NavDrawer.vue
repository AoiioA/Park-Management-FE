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
            <v-list-tile-avatar tile>
              <img src="@/assets/logo.png">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>科技金融园区共享服务平台</v-list-tile-title>
            </v-list-tile-content>
            <!-- <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action> -->
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
      </v-flex>
      <v-flex class="no-scroll nav-list">
        <v-expansion-panel class="elevation-0">
          <v-expansion-panel-content v-for="navItem in navItems" :key="navItem.title">
            <div slot="header" class="nav-list-header">
              <v-list two-line dense>
                <v-list-tile>
                  <v-list-tile-avatar>
                    <v-icon>{{ navItem.action }}</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ navItem.title }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ navItem.child.map(el=>el.title).join(' ') }}</v-list-tile-sub-title>
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
        <v-list dense subheader>
          <v-divider></v-divider>
          <v-list-tile @click.stop="mini = !mini" avatar>
            <v-list-tile-action v-if="mini">
              <v-icon>chevron_right</v-icon>
            </v-list-tile-action>
            <template v-else>
              <v-list-tile-avatar></v-list-tile-avatar>
              <v-list-tile-content></v-list-tile-content>
              <v-list-tile-action>
                <v-icon>chevron_left</v-icon>
              </v-list-tile-action>
            </template>
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
            { action: "business", title: "商圈", url: "/home/assets/point" },
            { action: "business", title: "园区管理", url: "/home/assets/park" },
            {
              action: "business",
              title: "楼宇管理",
              url: "/home/assets/building"
            },
            { action: "business", title: "房源管理", url: "/home/assets/house" }
          ]
        },
        {
          action: "gavel",
          title: "智能招商",
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
            { action: "build", title: "水费管理", url: "/home/property/water" },
            {
              action: "build",
              title: "电费管理",
              url: "/home/property/electricity"
            }
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
          border-top: 1px solid #424242;

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

  & /deep/ .expansion-panel__header {
    transition: height 0.3s ease;
    height: 68px;
    overflow: hidden;
  }

  &.navigation-drawer--mini-variant /deep/ .expansion-panel__container--active .expansion-panel__header {
    height: 0;
  }
}
</style>
