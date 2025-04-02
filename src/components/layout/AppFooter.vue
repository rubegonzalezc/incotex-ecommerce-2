<template>
  <v-footer class="app-footer bg-grey-darken-4 text-white">
    <v-container>
      <v-row class="py-6">
        <!-- Logo y descripción de la empresa -->
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <div class="footer-logo mb-4">
            <router-link to="/">
              <v-img
                src="https://incotexhv.cl/wp-content/uploads/2021/07/Logo-Incotex-1024x318.png"
                alt="INCOTEX HV SERVICIOS SPA"
                max-width="180"
                height="50"
                class="custom-logo white-logo"
                @error="handleLogoError"
              />
            </router-link>
          </div>
          <p class="text-body-2 mb-6">
            Somos una empresa líder en suministro de material eléctrico, automatización 
            industrial y soluciones técnicas para la industria, con más de 15 años 
            de experiencia en el mercado.
          </p>
          <div class="social-links d-flex">
            <v-btn
              v-for="(social, index) in socialLinks"
              :key="index"
              :href="social.link"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              :icon="social.icon"
              color="white"
              class="mr-2"
              size="small"
            ></v-btn>
          </div>
        </v-col>

        <!-- Enlaces rápidos -->
        <v-col cols="12" sm="6" md="2" class="mb-6 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-4">Sitio</h3>
          <v-list density="compact" bg-color="transparent" class="pa-0">
            <v-list-item
              v-for="(link, index) in siteLinks"
              :key="index"
              :to="link.to"
              class="px-0"
              link
            >
              <template v-slot:prepend>
                <v-icon :icon="link.icon" size="small" class="mr-2"></v-icon>
              </template>
              <v-list-item-title class="text-white">{{ link.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Categorías -->
        <v-col cols="12" sm="6" md="2" class="mb-6 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-4">Categorías</h3>
          <v-list density="compact" bg-color="transparent" class="pa-0">
            <v-list-item
              v-for="(category, index) in popularCategories"
              :key="index"
              :to="category.to"
              class="px-0"
              link
            >
              <v-list-item-title class="text-white">{{ category.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Newsletter / Suscripción -->
        <v-col cols="12" md="4">
          <h3 class="text-h6 font-weight-bold mb-4">Boletín Informativo</h3>
          <p class="text-body-2 mb-4">
            Suscríbete para recibir actualizaciones, ofertas especiales y novedades en productos.
          </p>
          <div class="newsletter-form">
            <v-form @submit.prevent="subscribeNewsletter">
              <div class="d-flex">
                <v-text-field
                  v-model="newsletterEmail"
                  label="Tu email"
                  variant="outlined"
                  density="compact"
                  bg-color="grey-darken-3"
                  color="white"
                  hide-details
                  class="mr-2"
                ></v-text-field>
                <v-btn 
                  type="submit" 
                  color="primary" 
                  :loading="subscribing"
                >
                  Suscribir
                </v-btn>
              </div>
            </v-form>
          </div>
          
          <!-- Certificaciones -->
          <div class="mt-6">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Certificaciones</h4>
            <div class="d-flex flex-wrap">
              <v-img
                v-for="(cert, index) in certifications"
                :key="index"
                :src="cert.image"
                :alt="cert.name"
                width="60"
                height="40"
                contain
                class="mr-3 mb-2 certification-badge"
              />
            </div>
          </div>
        </v-col>
      </v-row>
      
      <!-- Separador -->
      <v-divider class="border-opacity-25"></v-divider>
      
      <!-- Pie de página con copyright y links legales -->
      <div class="d-flex flex-column flex-md-row justify-space-between align-center py-4">
        <div class="mb-4 mb-md-0 text-center text-md-start">
          <span class="text-caption">
            &copy; {{ currentYear }} INCOTEX HV SERVICIOS SPA. Todos los derechos reservados.
          </span>
        </div>
        
        <div class="d-flex flex-wrap justify-center">
          <router-link 
            v-for="(link, index) in legalLinks" 
            :key="index"
            :to="link.to"
            class="text-caption text-white text-decoration-none mx-3"
          >
            {{ link.title }}
          </router-link>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
import { ref, computed } from 'vue';

// Estados
const newsletterEmail = ref('');
const subscribing = ref(false);

// Año actual para copyright
const currentYear = computed(() => new Date().getFullYear());

// Manejo de error de imagen
const handleLogoError = (e) => {
  // Si no se puede cargar el logo blanco, intentar con el logo normal
  e.target.src = 'https://incotexhv.cl/wp-content/uploads/2021/07/Logo-Incotex-1024x318.png';
};

// Enlaces a redes sociales
const socialLinks = [
  { icon: 'fa-brands fa-facebook-f', link: 'https://facebook.com' },
  { icon: 'fa-brands fa-instagram', link: 'https://instagram.com' },
  { icon: 'fa-brands fa-linkedin-in', link: 'https://linkedin.com' },
  { icon: 'fa-brands fa-whatsapp', link: 'https://wa.me/56912345678' },
  { icon: 'fa-brands fa-youtube', link: 'https://youtube.com' }
];

// Enlaces del sitio
const siteLinks = [
  { title: 'Inicio', to: '/', icon: 'fa-solid fa-house' },
  { title: 'Productos', to: '/productos', icon: 'fa-solid fa-box' },
  { title: 'Mi Cotización', to: '/mi-cotizacion', icon: 'fa-solid fa-clipboard-list' },
  { title: 'Contacto', to: '/contacto', icon: 'fa-solid fa-envelope' }
];

// Categorías populares
const popularCategories = [
  { title: 'Contactores y Relés', to: '/categorias/contactores-y-reles' },
  { title: 'Protección Eléctrica', to: '/categorias/proteccion-electrica' },
  { title: 'Iluminación', to: '/categorias/iluminacion' },
  { title: 'Automatización', to: '/categorias/automatizacion' },
  { title: 'Cables y Accesorios', to: '/categorias/cables-y-accesorios' }
];

// Enlaces legales
const legalLinks = [
  { title: 'Términos y Condiciones', to: '/terminos' },
  { title: 'Política de Privacidad', to: '/privacidad' },
  { title: 'Envíos y Devoluciones', to: '/envios' }
];

// Certificaciones y normas
const certifications = [
  { name: 'ISO 9001', image: 'https://placehold.co/60x40/e0e0e0/cccccc?text=ISO' },
  { name: 'SEC', image: 'https://placehold.co/60x40/e0e0e0/cccccc?text=SEC' },
  { name: 'CE', image: 'https://placehold.co/60x40/e0e0e0/cccccc?text=CE' }
];

// Método para suscribirse al newsletter
const subscribeNewsletter = async () => {
  if (!newsletterEmail.value || !validateEmail(newsletterEmail.value)) {
    alert('Por favor, introduce un email válido.');
    return;
  }
  
  subscribing.value = true;
  
  try {
    // Aquí iría la lógica real para procesar la suscripción
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
    
    alert('¡Gracias por suscribirte a nuestro boletín!');
    newsletterEmail.value = '';
  } catch (error) {
    console.error('Error al suscribirse:', error);
    alert('Ha ocurrido un error. Inténtelo nuevamente.');
  } finally {
    subscribing.value = false;
  }
};

// Validación simple de email
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
</script>

<style scoped>
.app-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-logo {
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.footer-logo:hover {
  opacity: 1;
}

/* Ajustar el logo del footer */
:deep(.custom-logo .v-img__img) {
  position: relative;
}

/* Filtro para convertir el logo a blanco */
.white-logo :deep(img) {
  filter: brightness(0) invert(1);
}

.v-list-item-title {
  transition: color 0.2s;
}

.v-list-item:hover .v-list-item-title {
  color: var(--v-primary-base) !important;
}

.social-links .v-btn {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.social-links .v-btn:hover {
  opacity: 1;
  transform: translateY(-3px);
}

.certification-badge {
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s;
}

.certification-badge:hover {
  filter: grayscale(0%);
  opacity: 1;
}

/* Ajustar espaciados en móvil */
@media (max-width: 599px) {
  .app-footer .v-container {
    padding: 0 16px;
  }
}
</style>