<template>
  <div>
    <AppHeader />
    
    <v-container class="login-container py-12">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="mx-auto" max-width="500">
            <v-card-title class="text-center pt-6 pb-4">
              <h1 class="text-h4 font-weight-bold">Iniciar Sesión</h1>
            </v-card-title>
            
            <v-alert
              v-if="route.query.redirect"
              type="info"
              variant="tonal"
              class="mx-4 mb-4"
              closable
            >
              Inicia sesión para acceder a esta sección
            </v-alert>
            
            <v-alert
              v-if="loginError"
              type="error"
              variant="tonal"
              class="mx-4 mb-4"
              closable
            >
              {{ loginError }}
            </v-alert>
            
            <v-card-text>
              <v-form @submit.prevent="handleLogin" ref="loginForm" v-model="formValid">
                <v-text-field
                  v-model="email"
                  label="Correo electrónico"
                  prepend-inner-icon="fa-solid fa-envelope"
                  variant="outlined"
                  :rules="emailRules"
                  required
                  class="mb-4"
                ></v-text-field>
                
                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  prepend-inner-icon="fa-solid fa-lock"
                  variant="outlined"
                  :append-inner-icon="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="passwordRules"
                  required
                  class="mb-4"
                ></v-text-field>
                
                <div class="d-flex justify-space-between align-center mb-4">
                  <v-checkbox
                    v-model="rememberMe"
                    label="Recordarme"
                    hide-details
                    density="compact"
                  ></v-checkbox>
                  
                  <v-btn
                    variant="text"
                    color="primary"
                    @click="forgotPassword"
                    class="text-none text-body-2"
                  >
                    ¿Olvidaste tu contraseña?
                  </v-btn>
                </div>
                
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  :disabled="!formValid"
                >
                  Iniciar Sesión
                </v-btn>
              </v-form>
              
              <v-divider class="my-4">
                <span class="text-caption text-medium-emphasis">O</span>
              </v-divider>
              
              <v-row class="mb-4">
                <v-col>
                  <v-btn
                    variant="outlined"
                    prepend-icon="fa-solid fa-user-plus"
                    block
                    @click="goToRegister"
                  >
                    Crear cuenta nueva
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const router = useRouter();
const route = useRoute();

// Estado del formulario
const loginForm = ref(null);
const formValid = ref(false);
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const loginError = ref('');

// Reglas de validación
const emailRules = [
  v => !!v || 'El correo electrónico es requerido',
  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'El correo electrónico no es válido'
];

const passwordRules = [
  v => !!v || 'La contraseña es requerida'
];

// Manejar inicio de sesión
const handleLogin = async () => {
  if (!loginForm.value.validate()) return;
  
  try {
    loading.value = true;
    
    // Simulación de inicio de sesión (reemplazar con llamada a API real)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verificar credenciales (simulado)
    if (email.value === 'cliente@ejemplo.cl' && password.value === '123456') {
      // Creamos un objeto con los datos del usuario
      const userData = {
        email: email.value,
        firstName: 'Juan',
        lastName: 'Pérez',
        token: 'simulated-jwt-token-' + Math.random().toString(36).substring(2),
        isAdmin: false
      };
      
      // Guardar en localStorage
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Si se seleccionó recordarme, guardamos el email por separado
      if (rememberMe.value) {
        localStorage.setItem('user_email', email.value);
      }
      
      // Disparar evento de storage para actualizar otros componentes
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user_data',
        newValue: JSON.stringify(userData)
      }));
      
      loginError.value = '';
      console.log('Inicio de sesión exitoso como cliente');
      
      // Redirigir a la página de destino o a mi-cuenta por defecto
      const redirectPath = route.query.redirect || '/mi-cuenta';
      router.push(redirectPath);
    } 
    // Verificar si es admin
    else if (email.value === 'admin@incotex.cl' && password.value === 'admin123') {
      // Creamos un objeto con los datos del administrador
      const adminData = {
        email: email.value,
        firstName: 'Admin',
        lastName: 'Incotex',
        token: 'admin-jwt-token-' + Math.random().toString(36).substring(2),
        isAdmin: true
      };
      
      // Guardar en localStorage
      localStorage.setItem('user_data', JSON.stringify(adminData));
      
      // Si se seleccionó recordarme, guardamos el email por separado
      if (rememberMe.value) {
        localStorage.setItem('user_email', email.value);
      }
      
      // Disparar evento de storage para actualizar otros componentes
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user_data',
        newValue: JSON.stringify(adminData)
      }));
      
      loginError.value = '';
      console.log('Inicio de sesión exitoso como administrador');
      
      // Redirigir al panel de administración o a la página solicitada
      const redirectPath = route.query.redirect || '/admin';
      router.push(redirectPath);
    }
    else {
      // Error de credenciales
      loginError.value = 'Correo electrónico o contraseña incorrectos';
    }
  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    loginError.value = 'Se produjo un error al iniciar sesión. Inténtalo nuevamente.';
  } finally {
    loading.value = false;
  }
};

// Funciones auxiliares
const forgotPassword = () => {
  alert('Funcionalidad de recuperación de contraseña no implementada en esta demo.');
};

const goToRegister = () => {
  router.push('/registro');
};

// Cargar datos guardados
onMounted(() => {
  // Verificar si hay un email guardado
  const savedEmail = localStorage.getItem('user_email');
  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.value = true;
  }
});
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
}
</style>