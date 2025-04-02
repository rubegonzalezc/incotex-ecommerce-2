<template>
  <div>
    <AppHeader />

    <!-- Cabecera de la página -->
    <v-container fluid class="contact-header py-8 mb-8">
      <v-container class="text-center">
        <h1 class="text-h3 font-weight-bold mb-2">Contáctanos</h1>
        <p class="text-subtitle-1">Estamos aquí para ayudarte con cualquier consulta</p>
      </v-container>
    </v-container>

    <v-container class="contact-container">
      <v-row>
        <!-- Información de contacto -->
        <v-col cols="12" md="5" order="2" order-md="1">
          <v-card class="pa-6 h-100">
            <h2 class="text-h5 font-weight-bold mb-6">Información de Contacto</h2>
            
            <div class="contact-info-list">
              <div class="contact-info-item d-flex mb-6">
                <v-icon icon="fa-solid fa-location-dot" size="24" color="primary" class="mt-1 mr-4"></v-icon>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold mb-1">Dirección</h3>
                  <p class="text-body-1">Av. Las Industrias 1234, Santiago</p>
                  <p class="text-body-1">Región Metropolitana, Chile</p>
                </div>
              </div>

              <div class="contact-info-item d-flex mb-6">
                <v-icon icon="fa-solid fa-phone" size="24" color="primary" class="mt-1 mr-4"></v-icon>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold mb-1">Teléfono</h3>
                  <p class="text-body-1">
                    <a href="tel:+56912345678" class="text-decoration-none">+56 9 1234 5678</a>
                  </p>
                  <p class="text-body-1">
                    <a href="tel:+5622123456" class="text-decoration-none">+56 2 2123 4567</a>
                  </p>
                </div>
              </div>

              <div class="contact-info-item d-flex mb-6">
                <v-icon icon="fa-solid fa-envelope" size="24" color="primary" class="mt-1 mr-4"></v-icon>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold mb-1">Email</h3>
                  <p class="text-body-1">
                    <a href="mailto:contacto@incotex.cl" class="text-decoration-none">contacto@incotex.cl</a>
                  </p>
                  <p class="text-body-1">
                    <a href="mailto:ventas@incotex.cl" class="text-decoration-none">ventas@incotex.cl</a>
                  </p>
                </div>
              </div>

              <div class="contact-info-item d-flex mb-6">
                <v-icon icon="fa-solid fa-clock" size="24" color="primary" class="mt-1 mr-4"></v-icon>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold mb-1">Horario de Atención</h3>
                  <p class="text-body-1">Lunes a Viernes: 8:30 AM - 6:00 PM</p>
                  <p class="text-body-1">Sábados: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            <!-- Redes Sociales -->
            <div class="mt-8">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">Síguenos</h3>
              <div class="d-flex">
                <v-btn
                  v-for="(social, index) in socialLinks"
                  :key="index"
                  :href="social.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="text"
                  :icon="social.icon"
                  color="primary"
                  class="mr-2 social-btn"
                  border
                ></v-btn>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Formulario de contacto -->
        <v-col cols="12" md="7" order="1" order-md="2">
          <v-card class="pa-6">
            <h2 class="text-h5 font-weight-bold mb-6">Envíanos un Mensaje</h2>

            <v-form ref="contactFormRef" v-model="validForm" @submit.prevent="submitContactForm">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="contactForm.name"
                    :rules="[v => !!v || 'El nombre es requerido']"
                    label="Nombre *"
                    variant="outlined"
                    prepend-inner-icon="fa-solid fa-user"
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="contactForm.email"
                    :rules="[
                      v => !!v || 'El email es requerido',
                      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email no válido'
                    ]"
                    label="Email *"
                    variant="outlined"
                    prepend-inner-icon="fa-solid fa-envelope"
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="contactForm.phone"
                    label="Teléfono (opcional)"
                    variant="outlined"
                    prepend-inner-icon="fa-solid fa-phone"
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="contactForm.subject"
                    :items="subjectOptions"
                    label="Asunto *"
                    :rules="[v => !!v || 'Por favor seleccione un asunto']"
                    variant="outlined"
                    prepend-inner-icon="fa-solid fa-tag"
                    density="comfortable"
                    class="mb-2"
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="contactForm.message"
                    :rules="[v => !!v || 'El mensaje es requerido']"
                    label="Mensaje *"
                    variant="outlined"
                    prepend-inner-icon="fa-solid fa-message"
                    density="comfortable"
                    rows="5"
                    counter="1000"
                    class="mb-4"
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <div class="d-flex justify-end">
                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      :loading="submitting"
                      :disabled="!validForm"
                    >
                      Enviar Mensaje
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

      <!-- Mapa de ubicación -->
      <v-card class="mt-8">
        <v-card-title class="py-4 px-6 bg-grey-lighten-4">
          <v-icon icon="fa-solid fa-map-location-dot" class="mr-2"></v-icon>
          Nuestra Ubicación
        </v-card-title>
        <div class="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.2031567319386!2d-70.6658491840905!3d-33.44347068077621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a758000000%3A0x74e5a1d6b3c941d3!2sSantiago%2C%20Regi%C3%B3n%20Metropolitana%2C%20Chile!5e0!3m2!1ses!2s!4v1617047114605!5m2!1ses!2s" 
            width="100%" 
            height="450" 
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Ubicación de Incotex HV Servicios SPA"
          ></iframe>
        </div>
      </v-card>

      <!-- Preguntas frecuentes (FAQs) -->
      <v-card class="mt-8">
        <v-card-title class="py-4 px-6 bg-grey-lighten-4">
          <v-icon icon="fa-solid fa-circle-question" class="mr-2"></v-icon>
          Preguntas Frecuentes
        </v-card-title>
        <v-card-text class="pt-4">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="(faq, index) in faqs" :key="index">
              <v-expansion-panel-title>{{ faq.question }}</v-expansion-panel-title>
              <v-expansion-panel-text>{{ faq.answer }}</v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Snackbar para confirmaciones -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="4000"
    >
      <div class="d-flex align-center">
        <v-icon :icon="snackbarIcon" class="mr-2"></v-icon>
        {{ snackbarText }}
      </div>
      
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSnackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

// Estado
const validForm = ref(false);
const submitting = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('fa-solid fa-check-circle');

// Referencia al formulario
const contactFormRef = ref(null);

// Formulario de contacto
const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
});

// Opciones para el select de asunto
const subjectOptions = [
  'Consulta general',
  'Cotización',
  'Soporte técnico',
  'Servicio post-venta',
  'Reclamo',
  'Otros'
];

// Enlaces a redes sociales
const socialLinks = [
  { icon: 'fa-brands fa-facebook-f', link: 'https://facebook.com' },
  { icon: 'fa-brands fa-instagram', link: 'https://instagram.com' },
  { icon: 'fa-brands fa-linkedin-in', link: 'https://linkedin.com' },
  { icon: 'fa-brands fa-whatsapp', link: 'https://wa.me/56912345678' },
  { icon: 'fa-brands fa-youtube', link: 'https://youtube.com' }
];

// Preguntas frecuentes
const faqs = [
  {
    question: '¿Cuáles son los tiempos de entrega?',
    answer: 'Los tiempos de entrega varían según la disponibilidad del producto y su ubicación. Generalmente, para productos en stock, el tiempo de entrega es de 24 a 48 horas hábiles en Santiago y 3 a 5 días hábiles en regiones.'
  },
  {
    question: '¿Cómo puedo obtener una cotización?',
    answer: 'Puede solicitar una cotización desde nuestra página de productos agregando los ítems a su carrito de cotización y luego completando el formulario de solicitud, o bien contactarnos directamente por teléfono o email.'
  },
  {
    question: '¿Realizan instalaciones o solo venta de productos?',
    answer: 'Ofrecemos tanto la venta de productos como servicios de instalación y mantenimiento. Contamos con personal técnico capacitado para asegurar el correcto funcionamiento de nuestros productos.'
  },
  {
    question: '¿Tienen servicio técnico post-venta?',
    answer: 'Sí, contamos con servicio técnico post-venta para todos nuestros productos. La garantía varía según el fabricante, generalmente entre 6 meses y 2 años.'
  },
  {
    question: '¿Emiten factura electrónica?',
    answer: 'Sí, emitimos factura electrónica para todas nuestras ventas a empresas y boleta electrónica para clientes particulares.'
  }
];

// Métodos
const showSnackbarMessage = (text, color, icon) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarIcon.value = icon;
  showSnackbar.value = true;
};

const submitContactForm = async () => {
  const { valid } = await contactFormRef.value.validate();
  
  if (!valid) return;
  
  submitting.value = true;
  
  try {
    // Aquí iría la lógica para enviar el formulario al backend
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular retraso de red
    
    showSnackbarMessage(
      'Tu mensaje ha sido enviado. Te contactaremos a la brevedad.',
      'success',
      'fa-solid fa-check-circle'
    );
    
    // Resetear formulario
    contactForm.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
    
    contactFormRef.value.reset();
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    showSnackbarMessage(
      'Ha ocurrido un error al enviar tu mensaje. Inténtalo nuevamente.',
      'error',
      'fa-solid fa-times-circle'
    );
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  // Cualquier inicialización necesaria
});
</script>

<style scoped>
.contact-header {
  background-color: #f5f7fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.contact-container {
  max-width: 1400px !important;
}

.contact-info-item a {
  color: inherit;
  transition: color 0.2s;
}

.contact-info-item a:hover {
  color: var(--v-primary-base);
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s;
}

.social-btn:hover {
  transform: translateY(-3px);
}

.map-container {
  position: relative;
  overflow: hidden;
  padding-bottom: 0;
  height: 450px;
}

@media (max-width: 959px) {
  .contact-header h1 {
    font-size: 2rem;
  }
  
  .map-container {
    height: 350px;
  }
}

@media (max-width: 599px) {
  .map-container {
    height: 300px;
  }
}
</style>