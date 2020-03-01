import vue from 'vue';
import vuex from 'vuex';
import state from './state'
import mutations from './mutations'

vue.use(vuex);

const store = new vuex.Store({
    state,
    mutations
})
window.store = store;
export default store;
