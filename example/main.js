import Vue from "vue"

import app from "./app.vue"
import asyncComputed from "src/index.js"

Vue.use(asyncComputed);

new Vue({
    el:"#app",
    render(h){
        return h(app);
    },
    components:{
        app
    },
})