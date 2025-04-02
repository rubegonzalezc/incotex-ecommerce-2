import { createPinia } from 'pinia'

export function registerPinia(app) {
  const pinia = createPinia()
  app.use(pinia)
}