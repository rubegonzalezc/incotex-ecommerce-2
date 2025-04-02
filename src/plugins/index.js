/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '@/router'

// Aquí deberías tener importaciones de otros plugins
import { registerPinia } from './pinia'

export function registerPlugins(app) {
  // Registra otros plugins que ya tengas
  app
    .use(vuetify)
    .use(router)
  
  // Registra Pinia
  registerPinia(app)
}
