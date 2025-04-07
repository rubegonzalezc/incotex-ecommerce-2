<template>
  <div>
    <AppHeader />

    <!-- Loading indicator -->
    <div v-if="loading" class="d-flex justify-center align-center pa-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Contenido del producto -->
    <div v-else-if="product">
      <v-container class="product-container">
        <!-- Breadcrumbs -->
        <v-breadcrumbs :items="breadcrumbs" divider="/">
          <template v-slot:title="{ item }">
            <v-breadcrumbs-item
              :title="item.title"
              :disabled="item.disabled"
              :to="item.to"
            ></v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>

        <v-row>
          <!-- Imagen del producto -->
          <v-col cols="12" md="6" class="mb-6 mb-md-0">
            <v-card flat class="product-image-card">
              <v-img
                :src="product.image"
                :alt="product.name"
                cover
                height="400"
                class="rounded-lg product-main-image"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                  </v-row>
                </template>
                <div class="product-badge" v-if="product.badge">
                  <span :class="`badge-${product.badgeType}`">{{ product.badge }}</span>
                </div>
              </v-img>
            </v-card>
          </v-col>

          <!-- Información del producto -->
          <v-col cols="12" md="6">
            <div class="product-info">
              <h1 class="text-h4 font-weight-bold mb-2">{{ product.name }}</h1>
              
              <div class="d-flex align-center mb-4">
                <div class="product-rating">
                  <v-rating
                    :model-value="validateRating(product.rating)"
                    color="amber"
                    density="compact"
                    readonly
                    half-increments
                  >
                    <template v-slot:item="props">
                      <v-icon
                        :icon="props.isFilled ? 'fa-solid fa-star' : 'fa-regular fa-star'"
                        :color="props.isFilled ? 'amber-darken-2' : 'grey'"
                      />
                    </template>
                  </v-rating>
                </div>
                <span class="text-body-2 ml-2">({{ product.reviewCount }} opiniones)</span>
              </div>

              <div class="product-meta mb-4">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="fa-solid fa-barcode" size="small" class="mr-2"></v-icon>
                  <span class="text-body-2">SKU: <strong>{{ product.sku }}</strong></span>
                </div>
                <div class="d-flex align-center mb-2">
                  <v-icon icon="fa-solid fa-tag" size="small" class="mr-2"></v-icon>
                  <span class="text-body-2">Categoría: 
                    <v-btn 
                      variant="text" 
                      density="compact" 
                      class="pa-0 text-capitalize" 
                      :to="`/categorias/${getCategorySlug(product.categoryId)}`"
                    >
                      <strong>{{ getCategoryName(product.categoryId) }}</strong>
                    </v-btn>
                  </span>
                </div>
                <div class="d-flex align-center mb-2">
                  <v-icon icon="fa-solid fa-industry" size="small" class="mr-2"></v-icon>
                  <span class="text-body-2">Marca: 
                    <v-btn 
                      variant="text" 
                      density="compact" 
                      class="pa-0 text-capitalize" 
                      :to="`/marcas/${getBrandSlug(product.brandId)}`"
                    >
                      <strong>{{ getBrandName(product.brandId) }}</strong>
                    </v-btn>
                  </span>
                </div>
                <div class="d-flex align-center">
                  <v-icon :icon="getStockIcon(product.stock)" size="small" class="mr-2" :color="getStockColor(product.stock)"></v-icon>
                  <span class="text-body-2" :class="`text-${getStockColor(product.stock)}`">{{ getStockText(product.stock) }}</span>
                </div>
              </div>

              <v-divider class="mb-4"></v-divider>
              
              <!-- Descripción del producto -->
              <div class="product-description mb-6">
                <h2 class="text-h6 font-weight-bold mb-2">Descripción</h2>
                <p class="text-body-1">{{ product.description }}</p>
              </div>

              <!-- Especificaciones técnicas -->
              <div class="mb-6" v-if="product.technicalSpecs">
                <h2 class="text-h6 font-weight-bold mb-2">Especificaciones Técnicas</h2>
                <v-card variant="outlined" class="pa-4">
                  <div class="text-body-1">
                    <p v-for="(spec, index) in formatSpecs(product.technicalSpecs)" :key="index" class="mb-1">{{ spec }}</p>
                  </div>
                </v-card>
              </div>

              <!-- Panel de cotización -->
              <v-card color="grey-lighten-4" class="quote-panel pa-4 mb-6">
                <div class="d-flex justify-space-between align-center mb-3">
                  <h2 class="text-h6 font-weight-bold">Solicitar Cotización</h2>
                  <v-chip v-if="product.requiresCustomQuote" color="info" size="small">Requiere cotización personalizada</v-chip>
                </div>

                <div v-if="!product.requiresCustomQuote && (product.priceMin || product.priceMax)" class="price-range mb-4">
                  <div class="d-flex align-center">
                    <span class="text-h5 font-weight-bold primary--text">
                      {{ formatPrice(product.priceMin) }}
                      <span v-if="product.priceMax && product.priceMax > product.priceMin">
                        - {{ formatPrice(product.priceMax) }}
                      </span>
                    </span>
                    <span class="text-caption ml-2">(precio referencial)</span>
                  </div>
                </div>

                <div class="quote-actions">
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model.number="quoteQuantity"
                        label="Cantidad"
                        type="number"
                        min="1"
                        variant="outlined"
                        density="compact"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8">
                      <v-btn
                        block
                        color="primary"
                        size="large"
                        prepend-icon="fa-solid fa-clipboard-list"
                        @click="addToQuote"
                      >
                        Agregar a Cotización
                      </v-btn>
                    </v-col>
                  </v-row>

                  <div class="note-text text-body-2 mt-3" v-if="product.pricingNotes">
                    <v-icon icon="fa-solid fa-info-circle" size="small" class="mr-1"></v-icon>
                    {{ product.pricingNotes }}
                  </div>
                </div>
              </v-card>

              <!-- Botones de acción -->
              <div class="product-actions">
                <v-btn
                  variant="text"
                  prepend-icon="fa-solid fa-share-nodes"
                  @click="shareProduct"
                >
                  Compartir
                </v-btn>
                <v-btn
                  variant="text"
                  prepend-icon="fa-solid fa-envelope"
                  @click="contactAboutProduct"
                >
                  Consultar
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Productos relacionados -->
        <div class="related-products mt-12">
          <div class="d-flex align-center mb-6">
            <h2 class="text-h5 font-weight-bold">Productos Relacionados</h2>
            <v-spacer></v-spacer>
            <v-btn 
              v-if="relatedProducts.length > 0" 
              variant="text" 
              color="primary"
              :to="`/categorias/${getCategorySlug(product.categoryId)}`"
              density="comfortable"
            >
              Ver más <v-icon icon="fa-solid fa-arrow-right" size="small" class="ml-1"></v-icon>
            </v-btn>
          </div>
          
          <div v-if="loadingRelated" class="d-flex justify-center my-4">
            <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
          </div>
          
          <div v-else-if="relatedProducts.length === 0" class="text-center pa-6 bg-grey-lighten-4 rounded">
            <v-icon icon="fa-solid fa-info-circle" size="large" color="grey" class="mb-2"></v-icon>
            <p class="text-body-1">No se encontraron productos relacionados.</p>
          </div>
          
          <v-row v-else>
            <v-col
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              cols="12"
              sm="6"
              md="3"
              class="px-2 mb-4"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :to="`/productos/${relatedProduct.slug}`"
                  :elevation="isHovering ? 4 : 1"
                  class="related-product-card h-100"
                  rounded="lg"
                >
                  <v-img
                    :src="relatedProduct.image"
                    height="180"
                    cover
                    class="product-image"
                  >
                    <div class="product-badge" v-if="relatedProduct.badge">
                      <span :class="`badge-${relatedProduct.badgeType}`">{{ relatedProduct.badge }}</span>
                    </div>
                    
                    <v-btn
                      v-if="isHovering"
                      color="primary"
                      icon="fa-solid fa-clipboard-list"
                      size="small"
                      class="quick-add-btn"
                      @click.stop="addRelatedToQuote(relatedProduct)"
                      title="Agregar a cotización"
                    ></v-btn>
                  </v-img>
                  
                  <v-card-text class="pa-3">
                    <h3 class="text-subtitle-1 font-weight-bold mb-1 product-title text-dark">
                      {{ relatedProduct.name }}
                    </h3>
                    
                    <!-- Mostrar por qué está relacionado -->
                    <div class="relation-tag mb-2">
                      <v-chip
                        size="x-small"
                        color="grey-lighten-3"
                        variant="flat"
                        class="text-caption"
                      >
                        <span v-if="relatedProduct.categoryId === product.categoryId">Misma categoría</span>
                        <span v-else-if="relatedProduct.brandId === product.brandId">Misma marca</span>
                        <span v-else>Recomendado</span>
                      </v-chip>
                    </div>
                    
                    <div class="d-flex justify-space-between align-center">
                      <div class="stock-indicator" :class="getStockClass(relatedProduct.stock)">
                        <v-icon :icon="getStockIcon(relatedProduct.stock)" size="x-small" class="mr-1"></v-icon>
                        <span class="text-caption">{{ getStockText(relatedProduct.stock) }}</span>
                      </div>
                      <v-btn
                        color="primary"
                        size="x-small"
                        variant="text"
                        @click.stop="addRelatedToQuote(relatedProduct)"
                        class="quote-btn"
                      >
                        Cotizar
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </div>

    <!-- Producto no encontrado -->
    <div v-else class="text-center py-12">
      <v-container>
        <v-icon size="x-large" icon="fa-solid fa-exclamation-triangle" color="warning" class="mb-4"></v-icon>
        <h2 class="text-h4 mb-2">Producto no encontrado</h2>
        <p class="text-body-1 mb-4">El producto que estás buscando no existe o no está disponible.</p>
        <v-btn color="primary" to="/productos" prepend-icon="fa-solid fa-arrow-left">
          Ver todos los productos
        </v-btn>
      </v-container>
    </div>

    <!-- Snackbar para notificaciones -->
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
        <v-btn
          color="white"
          variant="outlined"
          to="/mi-cotizacion"
        >
          Ver Cotización
        </v-btn>
      </template>
    </v-snackbar>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuoteStore } from '@/stores/quoteStore';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import { productService } from '@/services/productService';

const route = useRoute();
const router = useRouter();
const quoteStore = useQuoteStore();

// Estado
const loading = ref(true);
const loadingRelated = ref(false);
const product = ref(null);
const categories = ref([]);
const brands = ref([]);
const relatedProducts = ref([]);
const quoteQuantity = ref(1);

// Snackbar
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('fa-solid fa-check-circle');

// Obtener el id o slug del producto desde la URL
const productIdOrSlug = computed(() => route.params.id);

// Breadcrumbs para navegación
const breadcrumbs = computed(() => [
  {
    title: 'Inicio',
    disabled: false,
    to: '/'
  },
  {
    title: 'Productos',
    disabled: false,
    to: '/productos'
  },
  {
    title: product.value?.name || '',
    disabled: true
  }
]);

// Métodos para mostrar indicadores de stock
const getStockClass = (stock) => {
  if (stock <= 0) return 'stock-none';
  if (stock <= 5) return 'stock-low';
  return 'stock-available';
};

const getStockIcon = (stock) => {
  if (stock <= 0) return 'fa-solid fa-times-circle';
  if (stock <= 5) return 'fa-solid fa-exclamation-circle';
  return 'fa-solid fa-check-circle';
};

const getStockText = (stock) => {
  if (stock <= 0) return 'No disponible';
  if (stock <= 5) return 'Último stock';
  return 'Disponible';
};

const getStockColor = (stock) => {
  if (stock <= 0) return 'error';
  if (stock <= 5) return 'warning';
  return 'success';
};

// Validar rating
const validateRating = (rating) => {
  const numRating = Number(rating);
  return isNaN(numRating) ? 0 : Math.min(Math.max(numRating, 0), 5);
};

// Obtener el nombre de la categoría por su ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : 'Sin categoría';
};

// Obtener el slug de la categoría por su ID
const getCategorySlug = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.slug || category.id : categoryId;
};

// Obtener el nombre de la marca por su ID
const getBrandName = (brandId) => {
  const brand = brands.value.find(b => b.id === brandId);
  return brand ? brand.name : 'Sin especificar';
};

// Obtener el slug de la marca por su ID
const getBrandSlug = (brandId) => {
  const brand = brands.value.find(b => b.id === brandId);
  return brand ? brand.slug || brand.id : brandId;
};

// Formatear especificaciones técnicas
const formatSpecs = (technicalSpecs) => {
  if (!technicalSpecs) return [];
  return technicalSpecs.split('\n').filter(spec => spec.trim() !== '');
};

// Formatear precio
const formatPrice = (price) => {
  if (price === null || price === undefined) return 'Consultar';
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
};

// Agregar producto a cotización
const addToQuote = () => {
  if (!product.value) return;
  
  const quantity = Math.max(1, quoteQuantity.value);
  
  quoteStore.addToQuote({
    ...product.value,
    quantity: quantity
  });
  
  showNotification(`${product.value.name} agregado a tu cotización (${quantity} unidades)`);
};

// Agregar producto relacionado a cotización
const addRelatedToQuote = (relatedProduct) => {
  // Detener propagación para evitar navegación
  event.preventDefault();
  event.stopPropagation();
  
  quoteStore.addToQuote({
    ...relatedProduct,
    quantity: 1
  });
  
  showNotification(`${relatedProduct.name} agregado a tu cotización`);
};

// Mostrar notificación
const showNotification = (text, color = 'success', icon = 'fa-solid fa-check-circle') => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarIcon.value = icon;
  showSnackbar.value = true;
};

// Compartir producto
const shareProduct = async () => {
  if (!product.value) return;
  
  try {
    if (navigator.share) {
      await navigator.share({
        title: product.value.name,
        text: `Mira este producto: ${product.value.name}`,
        url: window.location.href
      });
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(window.location.href);
      showNotification('Enlace copiado al portapapeles', 'info', 'fa-solid fa-copy');
    }
  } catch (error) {
    console.error('Error al compartir:', error);
  }
};

// Contactar sobre producto
const contactAboutProduct = () => {
  if (!product.value) return;
  
  const subject = encodeURIComponent(`Consulta sobre producto: ${product.value.name}`);
  const body = encodeURIComponent(`Hola, estoy interesado en obtener más información sobre el producto ${product.value.name} (SKU: ${product.value.sku}).`);
  
  window.open(`mailto:contacto@incotex.cl?subject=${subject}&body=${body}`, '_blank');
};

// Cargar producto y datos relacionados
const loadProduct = async () => {
  loading.value = true;
  
  try {
    // Cargar categorías y marcas
    const [categoriesData, brandsData] = await Promise.all([
      productService.getCategories(),
      productService.getBrands()
    ]);
    
    categories.value = categoriesData;
    brands.value = brandsData;
    
    // Cargar producto usando el método que soporta slug o ID
    product.value = await productService.getProductById(productIdOrSlug.value);
    
    // Si encontramos el producto pero llegamos por ID y tiene slug, redirigir a la URL con slug
    if (product.value && product.value.slug && 
        productIdOrSlug.value !== product.value.slug && 
        productIdOrSlug.value === product.value.id) {
      router.replace(`/productos/${product.value.slug}`);
      return;
    }
    
    // Cargar productos relacionados
    await loadRelatedProducts();
    
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    product.value = null;
  } finally {
    loading.value = false;
  }
};

// Cargar productos relacionados
const loadRelatedProducts = async () => {
  if (!product.value) return;
  
  loadingRelated.value = true;
  
  try {
    // Usar el nuevo método específico para productos relacionados
    relatedProducts.value = await productService.getRelatedProducts(product.value.id, 4);
  } catch (error) {
    console.error('Error al cargar productos relacionados:', error);
    relatedProducts.value = [];
  } finally {
    loadingRelated.value = false;
  }
};

// Observadores para recargar cuando cambie la ruta
watch(productIdOrSlug, () => {
  loadProduct();
});

// Inicializar al montar
onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
.product-container {
  max-width: 1400px !important;
  padding-bottom: 64px;
}

.product-main-image {
  transition: transform 0.5s ease;
}

.product-main-image:hover {
  transform: scale(1.02);
}

.product-image-card {
  overflow: hidden;
  border-radius: 8px;
}

.product-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
}

.badge-discount, .badge-new, .badge-hot, .badge-featured, .badge-success, .badge-info {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
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

.quote-panel {
  border-radius: 8px;
}

.stock-indicator {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

.stock-available {
  color: #4CAF50;
}

.stock-low {
  color: #FF9800;
}

.stock-none {
  color: #F44336;
}

.product-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.related-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.text-dark {
  color: rgba(0, 0, 0, 0.8) !important;
}

.note-text {
  color: rgba(0, 0, 0, 0.6);
  font-style: italic;
}

.quick-add-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.quick-add-btn:hover {
  opacity: 1;
}

.relation-tag {
  min-height: 20px;
}

@media (max-width: 959px) {
  .product-container {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>