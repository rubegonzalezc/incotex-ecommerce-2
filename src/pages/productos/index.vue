<template>
    <div>
      <AppHeader />
      
      <!-- Cabecera de la página de productos -->
      <v-container fluid class="products-header py-8 mb-8">
        <v-container class="text-center">
          <h1 class="text-h3 font-weight-bold mb-2">Catálogo de Productos</h1>
          <p class="text-subtitle-1">Solicita cotización para los productos que necesitas en tu proyecto</p>
        </v-container>
      </v-container>
      
      <v-container class="products-container">
        <!-- Barra de búsqueda global -->
        <v-card flat class="mb-4 pa-4">
          <v-text-field
            v-model="searchTerm"
            label="Buscar productos por nombre, código o descripción"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="fa-solid fa-magnifying-glass"
            clearable
            @click:clear="searchTerm = ''"
            @keyup.enter="currentPage = 1"
          ></v-text-field>
        </v-card>
        
        <v-row>
          <!-- Filtros laterales -->
          <v-col cols="12" md="3" class="hidden-sm-and-down">
            <v-card flat class="filter-sidebar pa-4">
              <h3 class="text-h6 font-weight-bold mb-4">Filtros</h3>
              
              <!-- Filtro de categorías -->
              <div class="mb-6">
                <h4 class="text-subtitle-1 font-weight-medium mb-3">Categorías</h4>
                <v-list density="compact">
                  <v-list-item
                    v-for="category in categories"
                    :key="category.id"
                    :value="category"
                    @click="setSelectedCategory(category.id)"
                    :class="{ 'selected-category': selectedCategory === category.id }"
                  >
                    <v-list-item-title>{{ category.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
              
              <!-- Filtro de marcas -->
              <div class="mb-6">
                <h4 class="text-subtitle-1 font-weight-medium mb-3">Marcas</h4>
                <v-checkbox
                  v-for="brand in brands"
                  :key="brand.id"
                  v-model="selectedBrands"
                  :label="brand.name"
                  :value="brand.id"
                  density="compact"
                  hide-details
                  class="mb-1"
                ></v-checkbox>
              </div>
              
              <!-- Botones de acción para filtros -->
              <div class="d-flex flex-column">
                <v-btn color="primary" variant="elevated" class="mb-2" prepend-icon="fa-solid fa-filter">
                  Aplicar Filtros
                </v-btn>
                <v-btn color="grey" variant="text" @click="resetFilters">
                  Limpiar Filtros
                </v-btn>
              </div>
            </v-card>
          </v-col>
          
          <!-- Productos -->
          <v-col cols="12" md="9">
            <!-- Barra de herramientas y ordenamiento -->
            <v-card flat class="mb-4 pa-4">
              <div class="d-flex align-center justify-space-between flex-wrap">
                <div class="results-info">
                  <span class="text-subtitle-2">{{ filteredProducts.length }} productos encontrados</span>
                </div>
                
                <div class="d-flex align-center">
                  <!-- Filtros móviles (solo visible en móvil) -->
                  <v-btn
                    class="mr-2 d-md-none"
                    prepend-icon="fa-solid fa-filter"
                    variant="outlined"
                    @click="showMobileFilters = true"
                  >
                    Filtros
                  </v-btn>
                  
                  <!-- Selector de ordenamiento -->
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    item-title="text"
                    item-value="value"
                    density="compact"
                    label="Ordenar por"
                    variant="outlined"
                    class="sort-select"
                  ></v-select>
                </div>
              </div>
            </v-card>
            
            <!-- Loading -->
            <div v-if="loading" class="d-flex justify-center my-8">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </div>
            
            <!-- Grid de productos -->
            <v-row v-else>
              <v-col
                v-for="product in paginatedProducts"
                :key="product.id"
                cols="12"
                sm="6"
                md="4"
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
                      @click="navigateToProduct(product.id)"
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
                      @click="navigateToProduct(product.id)"
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
                        Código: {{ product.code }}
                      </div>
                      <v-btn
                        color="primary"
                        size="small"
                        variant="text"
                        @click="addProductToQuote(product)"
                        class="quote-btn"
                      >
                        Cotizar <v-icon icon="fa-solid fa-clipboard-list" size="x-small" class="ml-1"></v-icon>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Mensaje si no hay productos -->
            <v-card v-if="!loading && filteredProducts.length === 0" class="pa-6 text-center">
              <v-icon icon="fa-solid fa-search" size="x-large" color="grey" class="mb-4"></v-icon>
              <h3 class="text-h6 mb-2">No se encontraron productos</h3>
              <p class="text-body-1">Prueba modificando los filtros de búsqueda</p>
              <v-btn color="primary" @click="resetFilters" class="mt-3">Ver todos los productos</v-btn>
            </v-card>
            
            <!-- Paginación -->
            <div class="d-flex justify-center my-6">
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                rounded="circle"
              ></v-pagination>
            </div>
          </v-col>
        </v-row>
      </v-container>
      
      <!-- Modal de filtros para móvil -->
      <v-dialog v-model="showMobileFilters" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-btn icon @click="showMobileFilters = false">
              <v-icon>fa-solid fa-times</v-icon>
            </v-btn>
            <v-toolbar-title>Filtros</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text @click="resetFilters">Limpiar</v-btn>
          </v-toolbar>
          <v-card-text class="pt-4">
            <!-- Campo de búsqueda para móvil -->
            <v-text-field
              v-model="searchTerm"
              label="Buscar productos"
              variant="outlined"
              density="comfortable"
              hide-details
              prepend-inner-icon="fa-solid fa-magnifying-glass"
              clearable
              @click:clear="searchTerm = ''"
              class="mb-4"
            ></v-text-field>
            
            <!-- Contenido de filtros móvil -->
            <div class="mb-6">
              <h4 class="text-subtitle-1 font-weight-medium mb-3">Categorías</h4>
              <v-list>
                <v-list-item
                  v-for="category in categories"
                  :key="category.id"
                  :value="category"
                  @click="setSelectedCategory(category.id)"
                  :class="{ 'selected-category': selectedCategory === category.id }"
                >
                  <v-list-item-title>{{ category.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
            
            <div class="mb-6">
              <h4 class="text-subtitle-1 font-weight-medium mb-3">Marcas</h4>
              <v-checkbox
                v-for="brand in brands"
                :key="brand.id"
                v-model="selectedBrands"
                :label="brand.name"
                :value="brand.id"
                density="compact"
                hide-details
                class="mb-1"
              ></v-checkbox>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="primary" @click="showMobileFilters = false">
              Aplicar Filtros ({{ filteredProducts.length }})
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Snackbar para confirmación -->
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
        </template>
      </v-snackbar>
    </div>
    <AppFooter />
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuoteStore } from '@/stores/quoteStore';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import { productService } from '@/services/productService';
  
  // Router y Quote Store
  const router = useRouter();
  const quoteStore = useQuoteStore();
  
  // Estados
  const loading = ref(true);
  const products = ref([]);
  const categories = ref([]);
  const brands = ref([]);
  const showSnackbar = ref(false);
  const snackbarText = ref('');
  const showMobileFilters = ref(false);
  
  // Estados para filtros
  const selectedCategory = ref(null);
  const selectedBrands = ref([]);
  const sortBy = ref('featured');
  const currentPage = ref(1);
  const itemsPerPage = ref(12);
  const searchTerm = ref('');
  
  // Opciones de ordenamiento (eliminado opciones de precio)
  const sortOptions = [
    { text: 'Destacados', value: 'featured' },
    { text: 'Nombre: A-Z', value: 'name_asc' },
    { text: 'Nombre: Z-A', value: 'name_desc' },
    { text: 'Más recientes', value: 'newest' },
    { text: 'Más valorados', value: 'rating' }
  ];
  
  // Computed properties
  const filteredProducts = computed(() => {
    let result = [...products.value];
    
    // Filtrar por búsqueda
    if (searchTerm.value.trim()) {
      const term = searchTerm.value.toLowerCase().trim();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.code.toLowerCase().includes(term) || 
        (product.description && product.description.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory.value) {
      result = result.filter(product => product.categoryId === selectedCategory.value);
    }
    
    // Filtrar por marcas
    if (selectedBrands.value.length > 0) {
      result = result.filter(product => selectedBrands.value.includes(product.brandId));
    }
    
    // Ordenar
    if (sortBy.value) {
      switch (sortBy.value) {
        case 'name_asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // featured - mantener el orden predeterminado
          break;
      }
    }
    
    return result;
  });
  
  const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
  });
  
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProducts.value.slice(start, end);
  });
  
  // Métodos
  const setSelectedCategory = (categoryId) => {
    selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId;
  };
  
  const resetFilters = () => {
    selectedCategory.value = null;
    selectedBrands.value = [];
    sortBy.value = 'featured';
    searchTerm.value = '';
    currentPage.value = 1;
  };
  
  const validateRating = (rating) => {
    const numRating = Number(rating);
    return isNaN(numRating) ? 0 : Math.min(Math.max(numRating, 0), 5);
  };
  
  const addProductToQuote = (product) => {
    quoteStore.addToQuote(product);
    snackbarText.value = `${product.name} añadido a tu cotización`;
    showSnackbar.value = true;
  };
  
  const navigateToProduct = (productId) => {
    router.push(`/productos/${productId}`);
  };
  
  // Observar cambios en los filtros y búsqueda para resetear la paginación
  watch([selectedCategory, selectedBrands, searchTerm], () => {
    currentPage.value = 1;
  });
  
  // Cargar datos
  onMounted(async () => {
    try {
      // Cargar productos
      const productsData = await productService.getProducts();
      products.value = productsData;
      
      // Cargar categorías
      const categoriesData = await productService.getCategories();
      categories.value = categoriesData;
      
      // Cargar marcas
      const brandsData = await productService.getBrands();
      brands.value = brandsData;
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style scoped>
  .products-header {
    background-color: #f5f7fa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .products-container {
    max-width: 1400px !important;
  }
  
  .filter-sidebar {
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .selected-category {
    background-color: rgba(24, 103, 192, 0.08);
    color: #1867C0;
    font-weight: bold;
  }
  
  .sort-select {
    max-width: 220px;
  }
  
  /* Estilos de producto (reutilizados de FeaturedProducts.vue) */
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
  
  .badge-discount, .badge-new, .badge-hot, .badge-featured {
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
  
  .badge-featured {
    background-color: #4CAF50;
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
  
  .quote-btn {
    font-weight: 500;
  }
  
  .quote-btn:hover {
    background-color: rgba(24, 103, 192, 0.1);
  }
  
  .product-code {
    color: rgba(0, 0, 0, 0.6);
  }
  
  .review-count {
    color: rgba(0, 0, 0, 0.6) !important;
  }
  
  @media (max-width: 959px) {
    .products-container {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  </style>