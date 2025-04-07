<template>
  <div>
    <AppHeader />

    <!-- Cabecera de la página -->
    <v-container fluid class="news-header py-8 mb-6">
      <v-container class="text-center">
        <h1 class="text-h3 font-weight-bold mb-2">Novedades</h1>
        <p class="text-subtitle-1">Descubre los últimos productos incorporados a nuestro catálogo</p>
      </v-container>
    </v-container>

    <v-container class="news-container">
      <!-- Loading state -->
      <div v-if="loading" class="d-flex justify-center my-16">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <div v-else>
        <!-- Filtros -->
        <v-card class="mb-6 pa-4" elevation="2">
          <v-row align="center">
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Categoría"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="fa-solid fa-tag"
                return-object
                clearable
                @update:modelValue="filterProducts"
              >
                <template v-slot:prepend>
                  <v-icon color="primary">fa-solid fa-filter</v-icon>
                </template>
              </v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-select
                v-model="sortOption"
                :items="sortOptions"
                label="Ordenar por"
                variant="outlined"
                density="comfortable"
                @update:modelValue="filterProducts"
              >
                <template v-slot:prepend>
                  <v-icon color="primary">fa-solid fa-arrow-up-wide-short</v-icon>
                </template>
              </v-select>
            </v-col>
            
            <v-col cols="12" sm="12" md="4" lg="3" class="d-flex align-center">
              <v-switch
                v-model="onlyInStock"
                color="primary"
                label="Solo productos en stock"
                hide-details
                density="comfortable"
                @update:modelValue="filterProducts"
              ></v-switch>
            </v-col>

            <v-col cols="12" lg="3" class="d-flex align-center justify-end">
              <v-chip-group v-model="viewMode">
                <v-chip
                  :value="'grid'"
                  filter
                  filter-icon="fa-solid fa-check"
                  prepend-icon="fa-solid fa-grip"
                  color="primary"
                >
                  Cuadrícula
                </v-chip>
                <v-chip
                  :value="'list'"
                  filter
                  filter-icon="fa-solid fa-check"
                  prepend-icon="fa-solid fa-list"
                  color="primary"
                >
                  Lista
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
        </v-card>

        <!-- Sin resultados -->
        <v-card v-if="filteredProducts.length === 0" class="pa-8 text-center">
          <v-icon icon="fa-solid fa-search" size="64" color="grey-lighten-2" class="mb-4"></v-icon>
          <h3 class="text-h5 font-weight-medium mb-2">No se encontraron productos nuevos</h3>
          <p class="text-body-1 mb-6">Prueba con otros filtros o vuelve más tarde</p>
          <v-btn color="primary" @click="resetFilters">
            Restablecer filtros
          </v-btn>
        </v-card>

        <!-- Vista de cuadrícula -->
        <div v-else-if="viewMode === 'grid'">
          <div class="d-flex align-center justify-space-between mb-4">
            <h2 class="text-h5 font-weight-medium">{{ totalProducts }} productos encontrados</h2>
            <span class="text-body-2 text-grey">Mostrando {{ paginationText }}</span>
          </div>
          
          <v-row>
            <v-col
              v-for="product in filteredProducts"
              :key="product.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  class="product-card h-100 d-flex flex-column"
                  :to="`/productos/${product.slug}`"
                  :elevation="isHovering ? 4 : 1"
                >
                  <!-- Badge de nuevo -->
                  <div class="new-badge">
                    <v-chip
                      color="amber-darken-2"
                      size="small"
                      class="font-weight-medium"
                    >
                      NUEVO
                    </v-chip>
                  </div>

                  <v-img
                    :src="product.image"
                    :alt="product.name"
                    class="product-image"
                    cover
                    height="200"
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </div>
                    </template>
                  </v-img>
                  
                  <v-card-text class="pb-0">
                    <div class="d-flex align-center mb-1">
                      <v-chip
                        size="x-small"
                        :color="getStockColor(product.stock)"
                        class="mr-2"
                        variant="flat"
                      >
                        {{ getStockText(product.stock) }}
                      </v-chip>
                      <span class="text-caption text-grey">SKU: {{ product.sku }}</span>
                    </div>
                    <h3 class="text-subtitle-1 font-weight-medium mb-1 text-truncate-2">
                      {{ product.name }}
                    </h3>
                    <p class="text-caption text-grey mb-2">
                      {{ getBrandName(product.brandId) }}
                    </p>
                  </v-card-text>
                  
                  <v-card-text class="pt-0 mt-auto">
                    <div class="d-flex flex-column">
                      <div class="d-flex align-center">
                        <v-icon icon="fa-solid fa-calendar-plus" size="small" color="grey" class="mr-2"></v-icon>
                        <span class="text-caption">Añadido: {{ formatDate(product.createdAt) }}</span>
                      </div>
                      <div class="d-flex align-center mt-1">
                        <v-icon icon="fa-solid fa-tag" size="small" color="grey" class="mr-2"></v-icon>
                        <span class="text-caption">{{ getCategoryName(product.categoryId) }}</span>
                      </div>
                    </div>
                  </v-card-text>
                  
                  <v-divider></v-divider>
                  
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      variant="text"
                      prepend-icon="fa-solid fa-eye"
                      :to="`/productos/${product.slug}`"
                    >
                      Ver detalles
                    </v-btn>
                    
                    <v-spacer></v-spacer>
                    
                    <v-btn
                      color="primary"
                      icon="fa-solid fa-clipboard-list"
                      size="small"
                      variant="text"
                      @click.stop="addToQuote(product)"
                      title="Añadir a cotización"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </div>

        <!-- Vista de lista -->
        <div v-else>
          <div class="d-flex align-center justify-space-between mb-4">
            <h2 class="text-h5 font-weight-medium">{{ totalProducts }} productos encontrados</h2>
            <span class="text-body-2 text-grey">Mostrando {{ paginationText }}</span>
          </div>
          
          <v-card v-for="product in filteredProducts" :key="product.id" class="mb-4 list-item-card" hover>
            <div class="d-flex flex-column flex-sm-row">
              <div class="product-list-image-container position-relative">
                <!-- Badge de nuevo -->
                <div class="new-badge-list">
                  <v-chip
                    color="amber-darken-2"
                    size="small"
                    class="font-weight-medium"
                  >
                    NUEVO
                  </v-chip>
                </div>
                
                <v-img
                  :src="product.image"
                  :alt="product.name"
                  width="200"
                  height="150"
                  class="flex-grow-0 flex-shrink-0"
                  cover
                  @click="navigateToProduct(product.slug)"
                  style="cursor: pointer;"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </div>
              
              <div class="flex-grow-1 pa-4 d-flex flex-column">
                <div class="d-flex align-center mb-2">
                  <v-chip
                    size="x-small"
                    :color="getStockColor(product.stock)"
                    class="mr-2"
                    variant="flat"
                  >
                    {{ getStockText(product.stock) }}
                  </v-chip>
                  <span class="text-caption text-grey">SKU: {{ product.sku }}</span>
                  
                  <v-spacer></v-spacer>
                  
                  <div class="d-flex align-center">
                    <v-icon icon="fa-solid fa-calendar-plus" size="small" color="grey" class="mr-1"></v-icon>
                    <span class="text-caption">Añadido: {{ formatDate(product.createdAt) }}</span>
                  </div>
                </div>
                
                <h3 
                  class="text-subtitle-1 font-weight-medium mb-1 product-name"
                  @click="navigateToProduct(product.slug)"
                  style="cursor: pointer;"
                >
                  {{ product.name }}
                </h3>
                
                <div class="d-flex align-center mb-3">
                  <span class="text-caption text-grey mr-3">{{ getBrandName(product.brandId) }}</span>
                  <v-icon icon="fa-solid fa-tag" size="x-small" color="grey" class="mr-1"></v-icon>
                  <span class="text-caption text-grey">{{ getCategoryName(product.categoryId) }}</span>
                </div>
                
                <p v-if="product.description" class="text-body-2 text-truncate-2 mb-4">
                  {{ product.description }}
                </p>

                <div class="mt-auto d-flex justify-end">
                  <v-btn
                    color="primary"
                    variant="text"
                    :to="`/productos/${product.slug}`"
                    prepend-icon="fa-solid fa-eye"
                  >
                    Ver detalles
                  </v-btn>
                  
                  <v-btn
                    color="primary"
                    variant="flat"
                    @click.stop="addToQuote(product)"
                    prepend-icon="fa-solid fa-clipboard-list"
                    class="ml-2"
                  >
                    Añadir a cotización
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            rounded="circle"
          ></v-pagination>
        </div>
      </div>
    </v-container>
    
    <!-- Snackbar para notificaciones de cotización -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="4000"
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
          to="/mis-cotizaciones"
        >
          Ver Cotización
        </v-btn>
      </template>
    </v-snackbar>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productService } from '@/services/productService';
import { useQuoteStore } from '@/stores/quoteStore';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

// Router
const router = useRouter();

// Store
const quoteStore = useQuoteStore();

// Estados
const loading = ref(true);
const products = ref([]);
const categories = ref([]);
const brands = ref([]); // Agregado para administrar marcas
const selectedCategory = ref(null);
const sortOption = ref({ title: 'Más recientes', value: 'newest' });
const onlyInStock = ref(false);
const viewMode = ref('grid');
const currentPage = ref(1);
const itemsPerPage = 12;

// Snackbar
const showSnackbar = ref(false);
const snackbarText = ref('');

// Opciones de ordenamiento
const sortOptions = [
  { title: 'Más recientes', value: 'newest' },
  { title: 'Alfabético: A-Z', value: 'az' },
  { title: 'Alfabético: Z-A', value: 'za' },
  { title: 'Marca', value: 'brand' },
];

// Total de productos filtrados (antes de paginación)
const totalProducts = computed(() => {
  let result = [...products.value];
  
  if (selectedCategory.value) {
    result = result.filter(p => p.categoryId === selectedCategory.value.id);
  }
  
  if (onlyInStock.value) {
    result = result.filter(p => p.stock > 0);
  }
  
  return result.length;
});

// Texto de paginación
const paginationText = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1;
  const end = Math.min(start + itemsPerPage - 1, totalProducts.value);
  return `${start}-${end} de ${totalProducts.value}`;
});

// Productos filtrados y paginados
const filteredProducts = computed(() => {
  // Aplicar filtros
  let result = [...products.value];
  
  // Filtrar por categoría
  if (selectedCategory.value) {
    result = result.filter(p => p.categoryId === selectedCategory.value.id);
  }
  
  // Filtrar solo disponibles
  if (onlyInStock.value) {
    result = result.filter(p => p.stock > 0);
  }
  
  // Ordenar
  switch (sortOption.value.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'az':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'brand':
      // Usar brandId para obtener nombre de marca
      result.sort((a, b) => {
        const brandA = getBrandName(a.brandId);
        const brandB = getBrandName(b.brandId);
        return brandA.localeCompare(brandB);
      });
      break;
  }
  
  // Aplicar paginación
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  return result.slice(start, end);
});

// Total de páginas para paginación
const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage);
});

// Métodos
const loadData = async () => {
  try {
    loading.value = true;
    
    // Cargar categorías, marcas y productos en paralelo
    const [categoriesData, brandsData, productsData] = await Promise.all([
      productService.getCategories(),
      productService.getBrands(),
      productService.getProducts()
    ]);
    
    categories.value = categoriesData;
    brands.value = brandsData;
    
    // Filtrar productos que son novedades (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    products.value = productsData.filter(product => {
      const createdDate = new Date(product.createdAt);
      return createdDate >= thirtyDaysAgo;
    });
    
    // Si no hay productos recientes, mostrar todos los productos
    if (products.value.length === 0) {
      console.log('No se encontraron productos recientes, mostrando todos los productos');
      products.value = productsData;
    }
    
    // Ordenar por más recientes por defecto
    products.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    loading.value = false;
  }
};

const filterProducts = () => {
  currentPage.value = 1; // Volver a la primera página al filtrar
};

const resetFilters = () => {
  selectedCategory.value = null;
  sortOption.value = { title: 'Más recientes', value: 'newest' };
  onlyInStock.value = false;
  currentPage.value = 1;
};

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Sin categoría';
};

const getBrandName = (brandId) => {
  const brand = brands.value.find(b => b.id === brandId);
  return brand ? brand.name : 'Sin marca';
};

const getStockText = (stock) => {
  if (stock <= 0) return 'Agotado';
  if (stock <= 5) return 'Último stock';
  return 'Disponible';
};

const getStockColor = (stock) => {
  if (stock <= 0) return 'error';
  if (stock <= 5) return 'warning';
  return 'success';
};

const navigateToProduct = (slug) => {
  router.push(`/productos/${slug}`);
};

const addToQuote = (product) => {
  // Detener la propagación para evitar navegación
  event.preventDefault();
  event.stopPropagation();
  
  quoteStore.addToQuote({
    ...product,
    quantity: 1
  });
  
  // Mostrar snackbar en lugar de alert
  snackbarText.value = `${product.name} añadido a tu cotización`;
  showSnackbar.value = true;
};

// Cargar datos al montar el componente
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.news-header {
  background-color: #f5f7fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.news-container {
  max-width: 1400px !important;
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.list-item-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.list-item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.new-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}

.new-badge-list {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}

.product-image {
  position: relative;
  overflow: hidden;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-list-image-container {
  width: 200px;
  min-width: 200px; /* Prevent shrinking */
  overflow: hidden;
  position: relative;
}

.product-name:hover {
  color: var(--v-primary-base);
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .product-list-image-container {
    width: 100%;
    height: 200px;
  }
  
  .news-container {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>