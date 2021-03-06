import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    posts:[],
    post:{},
    user:{
      isAuthenticated: false,
      id: null,
      role: ""
    },
    processing: false
  },
  mutations: {
    SET_POSTS_TO_STATE: (state, posts) => {
        state.posts = posts; 
    },
    SET_POST:(state, post) => {
      state.posts.push(post);
    },
    SET_PROCESSING(state, payload){
        state.processing = payload;
    },
    SET_USER(state, payload){
      state.user.isAuthenticated = true;
      state.user.role = payload.role;
      state.user.id = payload.id;
    },
    SET_SIGNOUT(state){
      state.user.isAuthenticated = false;
      state.user.role = "";
      state.user.id = "";
    },
    REMOVE_POST(state, index){
      state.posts.splice(index,1);
    },
    CHANGE_POST(state, payload){
      state.posts[payload.index].title = payload.title;
      state.posts[payload.index].description = payload.description;
      state.posts[payload.index].createdAt = payload.createdAt;
    },
    UP_COUNTER_POST(state, payload){
      state.posts[payload].claps += 1;
    }
  },
  actions: {
    SIGNOUT({commit}){
      commit('SET_PROCESSING', true);
      commit('SET_SIGNOUT');
      commit('SET_PROCESSING', false);
    },
    GET_POSTS_FROM_API({commit}){
      return axios.get('http://localhost:3000/posts')
      .then((res) => {
          commit('SET_POSTS_TO_STATE', res.data);   
      })
      .catch((error) => {
        console.log(error);
        return error;
      })
    },
    DELETE_POST({commit}, index){
      commit('REMOVE_POST', index)
    },
    ADD_TO_POST({commit}, post){
      commit('SET_POST', post)
    }, 
    EDIT_POST({commit}, post){ 
      commit('CHANGE_POST',post)
    },
    INC_COUNTER({commit}, index){ 
      commit('UP_COUNTER_POST', index.payload)
    },
    SIGNIN({commit}, payload){
      commit('SET_PROCESSING', true)
      return axios.get('http://localhost:3000/users', {
      })
      .then((res) => {
        for (let index = 0; index < res.data.length; index++) {
          if (payload.email == res.data[index].login && payload.password == res.data[index].password) {
            commit('SET_USER', res.data[index])
          }
        } 
        commit('SET_PROCESSING', false)
    })
    }
  },
  modules: {
  },
  getters:{
    POSTS(state){
      return state.posts;
    },
    getProcessing(state){
      return state.processing;
    },
    isUserAuthenticated(state){
      return state.user.isAuthenticated;
    },
    lastPostId(state){
      return state.posts.length;
    },
    getUserRole(state){
      return state.user;
    }
  }
})

export default store;
