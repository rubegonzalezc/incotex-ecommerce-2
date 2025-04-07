<template>
  <v-container class="my-8 featured-products-container">
    <div class="text-center mb-6">
      <h2 class="text-h4 font-weight-bold mb-2 section-title">Productos Destacados</h2>
      <p class="text-subtitle-1 section-subtitle">Soluciones profesionales para tu proyecto</p>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="d-flex justify-center my-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <v-row v-else>
      <v-col 
        v-for="(product, index) in products" 
        :key="product.id || index"
        cols="12" 
        sm="6"
        md="3"
        class="px-2 mb-4"
      >
        <v-card
          class="product-card h-100"
          elevation="2"
          rounded="lg"
        >
          <div class="position-relative">
            <v-img
              :src="product.image"
              height="220"
              cover
              class="product-image"
              @click="navigateToProduct(product.id, product.slug)"
              style="cursor: pointer;"
            >
              <div class="product-badge" v-if="product.badge">
                <span :class="`badge-${product.badgeType}`">{{ product.badge }}</span>
              </div>
            </v-img>
          </div>
          
          <v-card-text class="pa-4">
            <h3 
              class="text-subtitle-1 font-weight-bold mb-2 product-title text-dark"
              @click="navigateToProduct(product.id, product.slug)"
              style="cursor: pointer;"
            >
              {{ product.name }}
            </h3>
            
            <div class="d-flex align-center mb-2">
              <div class="product-rating">
                <v-rating
                  :model-value="validateRating(product.rating)"
                  color="amber"
                  density="compact"
                  size="small"
                  readonly
                  half-increments
                  active-color="amber-darken-2"
                >
                  <template v-slot:item="props">
                    <v-icon
                      :icon="props.isFilled ? 'fa-solid fa-star' : 'fa-regular fa-star'"
                      :color="props.isFilled ? 'amber-darken-2' : 'grey'"
                      size="small"
                    />
                  </template>
                </v-rating>
              </div>
              <span class="text-caption review-count ml-2">({{ product.reviewCount }})</span>
            </div>
            
            <div class="d-flex align-center justify-space-between">
              <div class="product-code text-caption">
                Código: {{ product.sku }}
              </div>
              <v-btn
                color="primary"
                size="small"
                variant="text"
                @click.stop="addProductToQuote(product)"
                class="quote-btn"
              >
                Cotizar <v-icon icon="fa-solid fa-clipboard-list" size="x-small" class="ml-1"></v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        :to="'/productos'"
        class="px-6"
      >
        Explorar catálogo <v-icon icon="fa-solid fa-arrow-right" size="small" class="ml-2"></v-icon>
      </v-btn>
    </div>
    
    <!-- Snackbar for confirmation -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
    >
      <div class="d-flex align-center">
        <v-icon icon="fa-solid fa-check-circle" class="mr-2"></v-icon>
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
        <v-btn
          color="white"
          variant="outlined"
          to="/mi-cotizacion"
        >
          Ver Cotización
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuoteStore } from '@/stores/quoteStore';
import { productService } from '@/services/productService';

// Estados
const loading = ref(true);
const products = ref([]);
const showSnackbar = ref(false);
const snackbarText = ref('');

// Servicios
const router = useRouter();
const quoteStore = useQuoteStore();

// Props para permitir pasar productos predeterminados si es necesario
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
});

// Asegurarse de que el rating sea un número válido
const validateRating = (rating) => {
  const numRating = Number(rating);
  return isNaN(numRating) ? 0 : Math.min(Math.max(numRating, 0), 5);
};

// Método para agregar un producto a la cotización
const addProductToQuote = (product) => {
  quoteStore.addToQuote({
    ...product,
    quantity: 1
  });
  snackbarText.value = `${product.name} añadido a tu cotización`;
  showSnackbar.value = true;
};

// Método para navegar al detalle del producto
const navigateToProduct = (id, slug) => {
  // Usar slug si está disponible, de lo contrario usar id
  router.push(`/productos/${slug || id}`);
};

// Cargar productos destacados
const loadFeaturedProducts = async () => {
  try {
    // Si se proporcionaron productos como prop, usarlos
    if (props.products && props.products.length > 0) {
      products.value = props.products;
      return;
    }

    // De lo contrario, obtenerlos del servicio
    products.value = await productService.getFeaturedProducts();
  } catch (error) {
    console.error('Error al cargar productos destacados:', error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadFeaturedProducts();
});
</script>

<style scoped>
.featured-products-container {
  max-width: 1400px !important;
  width: 90%;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.product-image {
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}

.badge-discount, .badge-new, .badge-hot, .badge-featured, .badge-success, .badge-info {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
}

.badge-discount {
  background-color: #FF5722;
}

.badge-new {
  background-color: #FF9800;
}

.badge-hot {
  background-color: #F44336;
}

.badge-featured, .badge-success {
  background-color: #4CAF50;
}

.badge-info {
  background-color: #9C27B0;
}

.product-title {
  height: 48px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.text-dark {
  color: rgba(0, 0, 0, 0.8) !important;
}

.primary-text {
  color: #1867C0 !important;
}

.section-title {
  color: #1867C0;
}

.section-subtitle {
  color: rgba(0, 0, 0, 0.7);
}

.position-relative {
  position: relative;
}

.quote-btn {
  font-weight: 500;
}

.quote-btn:hover {
  background-color: rgba(24, 103, 192, 0.1);
}

.product-code {
  color: rgba(0, 0, 0, 0.6);
}

@media (max-width: 599px) {
  .featured-products-container {
    width: 95%;
    padding-left: 8px;
    padding-right: 8px;
  }
}

.review-count {
  color: rgba(0, 0, 0, 0.6) !important;
}
</style>