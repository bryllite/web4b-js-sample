<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Bryllite </span>
        <span class="font-weight-light">web4b-JS</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2"></span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <Web4bSample/>
    </v-content>
  </v-app>
</template>

<script>
import Web4bSample from './components/Web4bSample';

export default {
  name: 'App',
  components: {
    Web4bSample,
  },
  data: () => ({
    //
  }),
};
</script>
