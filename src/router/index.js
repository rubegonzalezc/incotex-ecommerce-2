/**
 * router/index.js
 *
 * Configuración manual de rutas
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'

// Páginas
import HomePage from '@/pages/index.vue'

// Rutas de administración
const adminRoutes = [
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/pages/admin/index.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/productos',
    name: 'AdminProducts',
    component: () => import('@/pages/admin/productos.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/cotizaciones',
    name: 'AdminQuotes',
    component: () => import('@/pages/admin/cotizaciones.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/usuarios',
    name: 'AdminUsers',
    component: () => import('@/pages/admin/usuarios.vue'),
    meta: { requiresAdmin: true }
  },
  // {
  //   path: '/admin/categorias',
  //   name: 'AdminCategories',
  //   component: () => import('@/pages/admin/categorias.vue'),
  //   meta: { requiresAdmin: true }
  // },
  // {
  //   path: '/admin/ventas',
  //   name: 'AdminSales',
  //   component: () => import('@/pages/admin/ventas.vue'),
  //   meta: { requiresAdmin: true }
  // },
  // {
  //   path: '/admin/configuracion',
  //   name: 'AdminSettings',
  //   component: () => import('@/pages/admin/configuracion.vue'),
  //   meta: { requiresAdmin: true }
  // }
];

// Definición manual de rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/productos',
    name: 'Products',
    component: () => import('@/pages/productos/index.vue')
  },
  {
    path: '/productos/:id',
    name: 'ProductDetail',
    component: () => import('@/pages/productos/[id].vue')
  },
  {
    path: '/categorias/:category',
    name: 'CategoryProducts',
    component: () => import('@/pages/categorias/[category].vue')
  },
  {
    path: '/mi-cotizacion',
    name: 'Quote',
    component: () => import('@/pages/mi-cotizacion.vue')
  },{
    path: '/novedades',
    name: 'News',
    component: () => import('@/pages/novedades.vue')
  },
  {
    path: '/contacto',
    name: 'Contact',
    component: () => import('@/pages/contacto.vue')
  },
  {
    path: '/mi-cuenta',
    name: 'Account',
    component: () => import('@/pages/mi-cuenta.vue')
  },{
   path: '/iniciar-sesion',
    name: 'Login',
    component: () => import('@/pages/iniciar-sesion.vue')
  },{
    path: '/marcas',
    name: 'Brands',
    component: () => import('@/pages/marcas/index.vue')
  },{
    path: '/marcas/:brand',
    name: 'BrandProducts',
    component: () => import('@/pages/marcas/[brand].vue')
  },{
    path: '/categorias',
    name: 'Categories',
    component: () => import('@/pages/categorias/index.vue')
  },
  // Agregar rutas de administración
  ...adminRoutes
  // Ruta catch-all para 404
  ,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Rutas que requieren autenticación
const authRequiredRoutes = ['/mi-cuenta'];
const adminRequiredRoutes = ['/admin'];

// Guardia de navegación para verificar autenticación
router.beforeEach((to, from, next) => {
  // Verificar si la ruta requiere autenticación
  if (authRequiredRoutes.includes(to.path)) {
    // Verificar si el usuario está autenticado
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      // Redirigir al login con parámetro de redirección
      next({
        path: '/iniciar-sesion',
        query: { redirect: to.fullPath }
      });
      return;
    }
  }
  
  // Verificar si la ruta requiere permisos de administrador
  if (adminRequiredRoutes.includes(to.path) || to.meta.requiresAdmin) {
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      // Redirigir al login con parámetro de redirección
      next({
        path: '/iniciar-sesion',
        query: { redirect: to.fullPath }
      });
      return;
    }
    
    // Verificar si el usuario tiene permisos de administrador
    const user = JSON.parse(userData);
    if (!user.isAdmin) {
      // Redirigir a la página de inicio si no tiene permisos
      next({ path: '/' });
      return;
    }
  }
  
  // Continuar navegación
  next();
});

// Manejo de errores de carga
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Recargando página para corregir error de importación dinámica')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Error de importación dinámica, la recarga no solucionó el problema', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
