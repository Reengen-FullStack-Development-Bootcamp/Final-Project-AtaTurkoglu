<template>
  <v-app id="app">
    <v-app-bar app color="transparent" dark flat align-center hide-on-scroll>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.xs"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <router-link v-slot="{ href, navigate }" to="/" custom>
        <v-toolbar-title :href="href" @click="navigate" role="button">
          <h2>Patika</h2>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-container
        class="nav-router"
        v-if="$vuetify.breakpoint.smAndUp && $store.state.user.user"
      >
        <v-row justify="center">
          <v-col sm="6" md="4" lg="3" xl="2" class="p-0 d-flex justify-center">
            <router-link v-slot="{ href, navigate }" to="/dashboard" custom>
              <v-btn :href="href" @click="navigate" text>
                {{ $t('Dashboard') }}
              </v-btn>
            </router-link>
          </v-col>
          <v-col sm="6" md="4" lg="3" xl="2" class="p-0 d-flex justify-center">
            <router-link v-slot="{ href, navigate }" to="/" custom>
              <v-btn :href="href" @click="navigate" text>
                {{ $t('User Settings') }}
              </v-btn>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
      <v-spacer></v-spacer>
      <v-menu offset-y left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :width="$store.state.user.user ? 100 : ''">
            <span v-if="$store.state.user.user">
              {{ $store.state.user.user.username }}
            </span>
            <v-icon v-else>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn elevation="0" color="white" @click="loginDialog = true">
              <v-icon class="mr-2">mdi-login-variant</v-icon>
              {{ $t('Log In') }}
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn elevation="0" color="white" @click="registerDialog = true">
              <v-icon class="mr-2">mdi-account-plus</v-icon>
              {{ $t('Register') }}
            </v-btn>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-btn elevation="0" color="white" @click="logout">
              <v-icon class="mr-2">mdi-logout-variant</v-icon>
              {{ $t('Log Out') }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" class="ml-6">
            <span>{{ lang }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn small elevation="0" color="white" @click="changeLang('tr')"
              >TR</v-btn
            >
          </v-list-item>
          <v-list-item>
            <v-btn small elevation="0" color="white" @click="changeLang('eng')"
              >ENG</v-btn
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <Register v-if="registerDialog" />
    <Login v-if="loginDialog" />
    <v-main>
      <v-navigation-drawer
        v-if="$vuetify.breakpoint.xs"
        v-model="drawer"
        width="50%"
        absolute
        temporary
        color="transparent"
      >
        <v-list nav shaped>
          <v-list-item-group class="mt-6">
            <v-list-item>
              <router-link v-slot="{ href, navigate }" to="/dashboard" custom>
                <span :href="href" @click="navigate" class="router-link-mobile">
                  <h3>{{ $t('Dashboard') }}</h3>
                </span>
              </router-link>
            </v-list-item>
            <v-list-item>
              <router-link v-slot="{ href, navigate }" to="/" custom>
                <span :href="href" @click="navigate" class="router-link-mobile">
                  <h3>{{ $t('User Settings') }}</h3>
                </span>
              </router-link>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import i18n from './i18n';
import Register from './components/user/Register.vue';
import Login from './components/user/Login.vue';
export default {
  components: {
    Register,
    Login,
  },
  name: 'App',
  data() {
    return {
      lang: 'eng',
      drawer: false,
      registerDialog: false,
      loginDialog: false,
    };
  },
  beforeCreate() {
    this.$store.dispatch('user/userExist');
  },
  created() {
    document.addEventListener('beforeunload', () => {
      let savedCols = {
        factoriesCols: this.$store.state.datatable.factories.columns.map(
          (c) => c.attname
        ),
        departmentsCols: this.$store.state.datatable.departments.columns.map(
          (c) => c.attname
        ),
      };
      window.localStorage.setItem('columns', JSON.stringify(savedCols));
    });
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout');
      if (this.$route.path != '/') this.$router.push({ path: '/' });
    },
    changeLang(lang) {
      this.lang = lang;
      i18n.locale = lang;
    },
  },
};
</script>
<style>
#app {
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-image: url('assets/bg/bg(3).jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
#app:before {
  content: '';
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.55);
  pointer-events: none;
  z-index: 0;
}
::-webkit-scrollbar {
  display: none;
}
#bg {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}
img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  filter: brightness(45%);
}
.nav-router {
  width: 40%;
}
.router-link-mobile {
  color: white;
}
.v-list-item--active {
  background-color: white;
}
</style>
