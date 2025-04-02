<template>
  <div>
    <AppHeader />
    
    <!-- Cabecera de la página -->
    <v-container fluid class="quote-header py-8 mb-8">
      <v-container class="text-center">
        <h1 class="text-h3 font-weight-bold mb-2">Mi Cotización</h1>
        <p class="text-subtitle-1">Revisa y ajusta los productos que deseas cotizar</p>
      </v-container>
    </v-container>

    <v-container class="quote-container">
      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-center my-16">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <div v-else>
        <!-- Cotización con productos -->
        <div v-if="quoteItems.length > 0">
          <!-- Resumen de cotización -->
          <v-card flat class="mb-4 pa-4 bg-grey-lighten-5">
            <div class="d-flex justify-space-between align-center flex-wrap">
              <div>
                <span class="text-subtitle-1 font-weight-medium">
                  {{ quoteItems.length }} {{ quoteItems.length === 1 ? 'producto' : 'productos' }} en tu cotización
                </span>
              </div>
              <v-btn
                variant="text"
                color="red-darken-2"
                @click="clearQuote"
                prepend-icon="fa-solid fa-trash"
              >
                Vaciar cotización
              </v-btn>
            </div>
          </v-card>

          <!-- Lista de productos -->
          <v-card class="mb-6">
            <v-data-table
              :headers="tableHeaders"
              :items="quoteItems"
              :items-per-page="-1"
              hide-default-footer
            >
              <template v-slot:item.image="{ item }">
                <div class="d-flex align-center py-2">
                  <v-img
                    :src="item.image"
                    :alt="item.name"
                    width="80"
                    height="80"
                    cover
                    class="rounded mr-3"
                  ></v-img>
                </div>
              </template>

              <template v-slot:item.name="{ item }">
                <div class="d-flex flex-column">
                  <router-link :to="`/productos/${item.id}`" class="quote-product-name">
                    {{ item.name }}
                  </router-link>
                  <span class="text-caption mt-1">Código: {{ item.code }}</span>
                </div>
              </template>

              <template v-slot:item.quantity="{ item }">
                <v-text-field
                  v-model="item.quantity"
                  type="number"
                  min="1"
                  hide-details
                  density="compact"
                  style="max-width: 100px"
                  class="quantity-input"
                  @blur="updateQuantity(item.id, parseInt(item.quantity) || 1)"
                  variant="outlined"
                ></v-text-field>
              </template>

              <template v-slot:item.quotedPrice="{ item }">
                <span v-if="item.quotedPrice">$ {{ formatPrice(item.quotedPrice) }}</span>
                <span v-else class="text-grey">Por cotizar</span>
              </template>

              <template v-slot:item.subtotal="{ item }">
                <span v-if="item.quotedPrice" class="text-subtitle-2 font-weight-medium">
                  $ {{ formatPrice(item.quotedPrice * item.quantity) }}
                </span>
                <span v-else class="text-grey">Por cotizar</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  variant="text"
                  color="red-darken-2"
                  size="small"
                  @click="removeFromQuote(item.id)"
                >
                  <v-icon icon="fa-solid fa-trash"></v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>

          <v-row>
            <v-col cols="12" md="6">
              <!-- Notas y preferencias -->
              <v-card class="mb-6">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon icon="fa-solid fa-clipboard-list" class="mr-2"></v-icon>
                  Notas y preferencias
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-textarea
                    v-model="quoteNotes"
                    label="Instrucciones especiales o detalles adicionales"
                    variant="outlined"
                    rows="4"
                    counter="500"
                    maxlength="500"
                  ></v-textarea>
                  <p class="text-caption mt-2">
                    Por favor, incluya cualquier requisito específico o preferencia para esta cotización.
                  </p>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Resumen de cotización -->
              <v-card class="quote-summary">
                <v-card-title class="bg-grey-lighten-4 py-3 px-4">
                  <v-icon icon="fa-solid fa-calculator" class="mr-2"></v-icon>
                  Resumen de cotización
                </v-card-title>
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between mb-3">
                    <span class="text-body-1">Subtotal:</span>
                    <span v-if="hasUnquotedItems" class="text-body-1">Por cotizar</span>
                    <span v-else class="text-body-1">$ {{ formatPrice(quoteSubtotal) }}</span>
                  </div>
                  <div class="d-flex justify-space-between mb-3">
                    <span class="text-body-1">IVA 19%:</span>
                    <span v-if="hasUnquotedItems" class="text-body-1">Por cotizar</span>
                    <span v-else class="text-body-1">$ {{ formatPrice(quoteSubtotal * 0.19) }}</span>
                  </div>
                  <v-divider class="my-3"></v-divider>
                  <div class="d-flex justify-space-between">
                    <span class="text-h6 font-weight-bold">Total estimado:</span>
                    <span v-if="hasUnquotedItems" class="text-h6 font-weight-bold">Por cotizar</span>
                    <span v-else class="text-h6 font-weight-bold">$ {{ formatPrice(quoteSubtotal * 1.19) }}</span>
                  </div>
                  <p class="text-caption mt-3">
                    Estos precios son estimados y pueden variar en la cotización final.
                  </p>
                </v-card-text>
              </v-card>

              <!-- Botones de acción -->
              <div class="d-flex mt-4">
                <v-btn
                  color="grey"
                  variant="outlined"
                  to="/productos"
                  class="flex-grow-1 mr-2"
                >
                  Seguir comprando
                </v-btn>
                <v-btn
                  color="primary"
                  variant="flat"
                  class="flex-grow-1"
                  @click="showRequestForm = true"
                >
                  Solicitar cotización
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Cotización vacía -->
        <v-card v-else class="pa-8 text-center empty-quote">
          <v-icon icon="fa-solid fa-clipboard" size="80" color="grey-lighten-3" class="mb-6"></v-icon>
          <h2 class="text-h5 font-weight-bold mb-4">Tu cotización está vacía</h2>
          <p class="text-body-1 mb-6">Agrega productos a tu cotización para recibir precios y disponibilidad.</p>
          <v-btn
            color="primary"
            size="large"
            to="/productos"
          >
            Explorar productos
          </v-btn>
        </v-card>
      </div>
    </v-container>

    <!-- Diálogo para solicitar cotización -->
    <v-dialog v-model="showRequestForm" max-width="700">
      <v-card>
        <v-card-title class="bg-primary text-white py-4 px-4">
          <span class="text-h6">Solicitar Cotización</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" color="white" @click="showRequestForm = false">
            <v-icon>fa-solid fa-times</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-4 pt-6">
          <v-form ref="quoteFormRef" v-model="validForm" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="quoteForm.name"
                  :rules="[v => !!v || 'El nombre es requerido']"
                  label="Nombre completo *"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="quoteForm.company"
                  label="Empresa (opcional)"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="quoteForm.email"
                  :rules="[
                    v => !!v || 'El email es requerido',
                    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email no válido'
                  ]"
                  label="Email *"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="quoteForm.phone"
                  :rules="[v => !!v || 'El teléfono es requerido']"
                  label="Teléfono *"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="quoteForm.message"
                  label="Mensaje adicional (opcional)"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  counter="500"
                ></v-textarea>
              </v-col>
              
              <v-col cols="12">
                <v-checkbox
                  v-model="quoteForm.terms"
                  :rules="[v => !!v || 'Debes aceptar los términos']"
                  label="Acepto los términos y condiciones y la política de privacidad"
                  @click:checkbox="handleTermsCheckbox"
                  @click="preventLinkInterference"
                  density="comfortable"
                ></v-checkbox>
                <div class="text-caption ml-3">
                  Puedes leer nuestros <a href="#" @click.stop class="text-decoration-none">términos y condiciones</a> y 
                  <a href="#" @click.stop class="text-decoration-none">política de privacidad</a> para más información.
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showRequestForm = false">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="submitQuoteRequest"
            :loading="submitting"
            :disabled="!validForm"
          >
            Enviar solicitud
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuoteStore } from '@/stores/quoteStore';
import AppHeader from '@/components/layout/AppHeader.vue';

// Estado
const loading = ref(true);
const showRequestForm = ref(false);
const submitting = ref(false);
const quoteNotes = ref('');
const validForm = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('fa-solid fa-check-circle');

// Formulario
const quoteForm = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  message: '',
  terms: false
});

// Referencia al formulario
const quoteFormRef = ref(null);

// Configuración de la tabla
const tableHeaders = [
  { title: 'Producto', key: 'image', width: '80px', sortable: false },
  { title: 'Nombre', key: 'name', sortable: false },
  { title: 'Cantidad', key: 'quantity', align: 'center', width: '120px', sortable: false },
  { title: 'Precio Unitario', key: 'quotedPrice', align: 'end', width: '150px', sortable: false },
  { title: 'Subtotal', key: 'subtotal', align: 'end', width: '150px', sortable: false },
  { title: '', key: 'actions', align: 'center', width: '80px', sortable: false },
];

// Store de cotizaciones
const quoteStore = useQuoteStore();
const quoteItems = computed(() => quoteStore.quoteItems);
const quoteSubtotal = computed(() => quoteStore.quoteSubtotal);

// Verificar si hay productos sin cotizar
const hasUnquotedItems = computed(() => {
  return quoteItems.value.some(item => item.quotedPrice === null || item.quotedPrice === undefined);
});

// Métodos
const formatPrice = (price) => {
  return quoteStore.formatPrice(price);
};

const updateQuantity = (productId, quantity) => {
  quoteStore.updateQuoteItemQuantity(productId, quantity);
};

const removeFromQuote = (productId) => {
  quoteStore.removeFromQuote(productId);
  showSnackbarMessage('Producto eliminado de tu cotización', 'error', 'fa-solid fa-trash');
};

const clearQuote = () => {
  if (confirm('¿Estás seguro de que quieres vaciar tu cotización?')) {
    quoteItems.value.forEach(item => {
      quoteStore.removeFromQuote(item.id);
    });
    showSnackbarMessage('Tu cotización ha sido vaciada', 'info', 'fa-solid fa-info-circle');
  }
};

const showSnackbarMessage = (text, color, icon) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarIcon.value = icon;
  showSnackbar.value = true;
};

const submitQuoteRequest = async () => {
  // Validación del formulario
  const { valid } = await quoteFormRef.value.validate();
  
  if (!valid) return;
  
  submitting.value = true;
  
  try {
    // Aquí iría la lógica para enviar la cotización al backend
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular retraso de red
    
    // Simulamos éxito
    showRequestForm.value = false;
    showSnackbarMessage(
      'Tu solicitud de cotización ha sido enviada. Te contactaremos pronto.',
      'success',
      'fa-solid fa-check-circle'
    );
    
    // Opcional: limpiar la cotización después de enviarla
    // clearQuote();
    
    // Resetear formulario
    quoteForm.value = {
      name: '',
      company: '',
      email: '',
      phone: '',
      message: '',
      terms: false
    };
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
    showSnackbarMessage(
      'Ha ocurrido un error al enviar tu solicitud. Inténtalo de nuevo.',
      'error',
      'fa-solid fa-times-circle'
    );
  } finally {
    submitting.value = false;
  }
};

const handleTermsCheckbox = (e) => {
  quoteForm.value.terms = e;
};

const preventLinkInterference = (e) => {
  // Prevenir que el clic en enlaces dentro del label afecte al checkbox
  e.stopPropagation();
};

onMounted(() => {
  // Simular carga de datos
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.quote-header {
  background-color: #f5f7fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.quote-container {
  max-width: 1400px !important;
}

.quantity-input :deep(input) {
  text-align: center;
}

.quote-product-name {
  color: rgba(0, 0, 0, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.quote-product-name:hover {
  color: var(--v-primary-base);
  text-decoration: underline;
}

.empty-quote {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (max-width: 600px) {
  .quote-header h1 {
    font-size: 2rem;
  }
}
</style>