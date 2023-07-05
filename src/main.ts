import './assets/main.css'

import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')

watch(
    pinia.state,
    (state) => {
      localStorage.setItem("LocalOptions", JSON.stringify(state.localOptiosnStore));
    },
    { deep: true }
);