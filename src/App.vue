<template>
  <div id="app">
    <v-app>
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
            <v-divider light></v-divider>
          </v-flex>
          <v-flex>
            <v-list>
              <v-list-group
                v-model="item.active"
                v-for="item in items"
                :key="item.title"
                :prepend-icon="item.action"
                no-action
              >
                <v-list-tile slot="activator">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-for="subItem in item.items" :key="subItem.title" @click="">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon>{{ subItem.action }}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list-group>
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
      <v-toolbar
        app
        dark
        fixed
        flat
        color="blue darken-3"
      >
        <!-- <v-toolbar-title
          class="ml-0 pl-3"
          v-if="$vuetify.breakpoint.lgAndUp"
          :style="{width: mini?'80px':'300px'}"
        >
          <v-avatar size="32px" tile style="display: inline-block;margin: 0 8px;">
            <img
              src="https://vuetifyjs.com/static/doc-images/logo.svg"
              alt="Vuetify"
            >
          </v-avatar>
          <span v-if="!mini" class="hidden-sm-and-down">Park Management</span>
        </v-toolbar-title> -->
        <v-toolbar-side-icon v-if="!$vuetify.breakpoint.lgAndUp" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-text-field
          flat
          solo-inverted
          prepend-icon="search"
          label="Search"
          class="hidden-sm-and-down"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>apps</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
        <v-btn icon large>
          <v-avatar size="32px" tile>
            <img
              src="https://vuetifyjs.com/static/doc-images/logo.svg"
              alt="Vuetify"
            >
          </v-avatar>
        </v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <router-view></router-view>
        </v-container>
      </v-content>
      <v-footer height="auto">
        <v-layout row wrap justify-center>
          <v-flex xs12 py-3 text-xs-center>
            &copy;2018 — <strong>BILIBALA</strong>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        {
          action: "local_activity",
          title: "工作台"
        },
        {
          action: "restaurant",
          title: "Dining",
          active: true,
          items: [
            { title: "Breakfast & brunch" },
            { title: "New American" },
            { title: "Sushi" }
          ]
        },
        {
          action: "school",
          title: "Education",
          items: [{ title: "List Item" }]
        },
        {
          action: "directions_run",
          title: "Family",
          items: [{ title: "List Item" }]
        },
        {
          action: "healing",
          title: "Health",
          items: [{ title: "List Item" }]
        },
        {
          action: "content_cut",
          title: "Office",
          items: [{ title: "List Item" }]
        },
        {
          action: "local_offer",
          title: "Promotions",
          items: [{ title: "List Item" }]
        }
      ],
      mini: false
    };
  }
};
</script>

<style lang="stylus"></style>
