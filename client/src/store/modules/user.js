import axios from 'axios';
import jwt from 'jsonwebtoken';

export default {
  namespaced: true,
  state: {
    authenticated: null,
    authError: false,
    user: null,
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
      setTimeout(() => {
        state.authenticated = true;
      }, 1000);
    },
    userLogout(state) {
      state.user = null;
    },
  },

  actions: {
    async userExist({ commit }) {
      if (window.localStorage.getItem('token')) {
        try {
          let token = jwt.verify(
            window.localStorage.getItem('token'),
            process.env.VUE_APP_SECRET_KEY
          );
          if (token.exp < Date.now()) {
            commit('setUser', token.user);
          }
        } catch {
          console.log('login had expired');
        }
      }
    },

    async register({ commit, state }, userData) {
      state.authenticated = false;
      await axios
        .post(process.env.VUE_APP_API + '/user/register', userData.user)
        .then((response) => {
          let token = response.data.token;
          window.localStorage.setItem('token', token);
          try {
            let responseToken = jwt.verify(
              token,
              process.env.VUE_APP_SECRET_KEY
            );
            if (userData.remember) {
              window.localStorage.setItem(
                'user',
                JSON.stringify({
                  username: responseToken.user.username,
                  ...userData.user,
                })
              );
            }
            commit('setUser', responseToken.user);
          } catch (error) {
            console.error(error);
          }
        })
        .catch((err) => {
          console.error(err);
          state.authError = true;
          state.authenticated = null;
        });
    },

    async login({ commit, state }, userData) {
      state.authenticated = false;
      await axios
        .post(process.env.VUE_APP_API + '/user/login', userData.user)
        .then((response) => {
          let token = response.data.token;
          window.localStorage.setItem('token', token);
          try {
            let responseToken = jwt.verify(
              token,
              process.env.VUE_APP_SECRET_KEY
            );
            if (userData.remember) {
              window.localStorage.setItem(
                'user',
                JSON.stringify({
                  token: responseToken.user.username,
                  ...userData.user,
                  role: responseToken.user.role,
                })
              );
            }
            commit('setUser', responseToken.user);
          } catch (error) {
            console.error(error);
          }
        })
        .catch((error) => {
          console.error(error);
          state.authError = true;
          state.authenticated = null;
        });
    },

    logout({ commit }) {
      commit('userLogout');
    },
  },
};
