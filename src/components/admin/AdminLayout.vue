<template>
  <div>
    <!-- Barra superior -->
    <AdminAppBar 
      :adminName="adminName"
      :isDarkTheme="isDarkTheme"
      @toggle-theme="toggleTheme"
      @go-to-website="goToWebsite"
      @logout="logout"
    />

    <v-layout>
      <!-- Barra lateral de navegación -->
      <AdminSidebar
        v-model:drawer="drawer"
        :activeSection="activeSection"
        :navItems="navItems"
        @logout="logout"
      />

      <!-- Contenido principal - Aquí se insertará el contenido específico de cada página -->
      <v-main>
        <v-container>
          <slot></slot>
        </v-container>
      </v-main>
    </v-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminAppBar from '@/components/admin/AdminAppBar.vue';

const router = useRouter();
const route = useRoute();
const { mobile } = useDisplay();

// Estado de navegación
const drawer = ref(true);
const isDarkTheme = ref(false);

// Determinar la sección activa basada en la ruta actual
const activeSection = computed(() => {
  const path = route.path;
  if (path === '/admin') return 'dashboard';
  if (path.includes('/admin/productos')) return 'products';
  if (path.includes('/admin/cotizaciones')) return 'quotes';
  if (path.includes('/admin/usuarios')) return 'users';
  if (path.includes('/admin/categorias')) return 'categories';
  if (path.includes('/admin/ventas')) return 'sales';
  if (path.includes('/admin/configuracion')) return 'settings';
  return 'dashboard';
});

// Datos de usuario
const adminData = ref({
  firstName: 'Admin',
  lastName: 'Incotex',
  email: 'admin@incotexhv.cl',
  role: 'Administrador',
});

const adminName = computed(() => `${adminData.value.firstName}`);

// Elementos de navegación con enlaces a las páginas
const navItems = [
  { title: 'Dashboard', value: 'dashboard', icon: 'fa-solid fa-gauge-high', link: '/admin' },
  { title: 'Productos', value: 'products', icon: 'fa-solid fa-box', link: '/admin/productos' },
  { title: 'Cotizaciones', value: 'quotes', icon: 'fa-solid fa-clipboard-list', link: '/admin/cotizaciones' },
  { title: 'Usuarios', value: 'users', icon: 'fa-solid fa-users', link: '/admin/usuarios' },
  { title: 'Categorías', value: 'categories', icon: 'fa-solid fa-tags', link: '/admin/categorias' },
  { title: 'Ventas', value: 'sales', icon: 'fa-solid fa-chart-line', link: '/admin/ventas' },
  { title: 'Configuración', value: 'settings', icon: 'fa-solid fa-gear', link: '/admin/configuracion' },
];

// Métodos
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  // Aquí se conectaría con la lógica para cambiar el tema en Vuetify
};

const goToWebsite = () => {
  router.push('/');
};

const logout = () => {
  // Eliminar datos de usuario
  localStorage.removeItem('user_data');
  
  // Disparar evento para actualizar otros componentes
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'user_data',
    newValue: null
  }));
  
  // Redirigir a la página de inicio
  router.push('/');
};

onMounted(() => {
  // Verificar autenticación y permisos de administrador
  const userData = localStorage.getItem('user_data');
  
  if (!userData) {
    console.log('Usuario no autenticado, redirigiendo a login');
    router.replace({
      path: '/iniciar-sesion',
      query: { redirect: route.fullPath }
    });
    return;
  }
  
  // Verificar si es administrador
  const user = JSON.parse(userData);
  if (!user.isAdmin) {
    console.log('Usuario sin permisos de administrador');
    router.replace('/');
    return;
  }
  
  // Establecer datos del administrador
  adminData.value = {
    firstName: user.firstName || 'Admin',
    lastName: user.lastName || '',
    email: user.email || '',
    role: 'Administrador',
  };
  
  console.log('Cargando layout de administración');
});
</script>