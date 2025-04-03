<template>
    <div>
      <AppHeader />
  
      <v-container>
        <!-- Loading indicator -->
        <div v-if="loading" class="d-flex justify-center align-center pa-12">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>
        
        <!-- Contenido de la marca -->
        <div v-else-if="brand">
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
  
          <!-- Cabecera de la marca -->
          <v-row class="align-center mb-8">
            <v-col cols="12" sm="4" md="3" class="text-center">
              <v-card class="pa-4 mx-auto" max-width="250" flat>
                <v-img
                  :src="brand.logo || `https://via.placeholder.com/250x120/f0f0f0/808080?text=${brand.name}`"
                  :alt="brand.name"
                  contain
                  max-height="120"
                  class="mx-auto mb-4"
                ></v-img>
                <v-btn 
                  v-if="brand.website" 
                  :href="brand.website" 
                  target="_blank" 
                  color="primary" 
                  variant="tonal"
                  block
                  prepend-icon="fa-solid fa-globe"
                >
                  Sitio oficial
                </v-btn>
              </v-card>
            </v-col>
            
            <v-col cols="12" sm="8" md="9">
              <h1 class="text-h3 mb-4">{{ brand.name }}</h1>
              <p class="text-body-1 mb-3">{{ brand.description || `Productos y soluciones ${brand.name} para la industria eléctrica y automatización.` }}</p>
            </v-col>
          </v-row>
          
          <v-divider class="mb-8"></v-divider>
          
          <!-- Barra de búsqueda y filtros -->
          <v-row class="mb-6">
            <v-col cols="12" md="8" lg="6">
              <v-text-field
                v-model="productSearch"
                prepend-inner-icon="fa-solid fa-search"
                label="Buscar productos de esta marca"
                hide-details
                density="compact"
                variant="outlined"
                clearable
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-select
                v-model="categoryFilter"
                :items="categoryOptions"
                label="Categoría"
                hide-details
                density="compact"
                variant="outlined"
                clearable
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-select
                v-model="sortOption"
                :items="sortOptions"
                label="Ordenar por"
                hide-details
                density="compact"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          
          <!-- Productos de la marca -->
          <h2 class="text-h4 mb-4">Productos {{ brand.name }}</h2>
          
          <div v-if="isLoadingProducts" class="d-flex justify-center align-center pa-8">
            <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          </div>
          
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <v-icon size="x-large" icon="fa-solid fa-box-open" color="grey-lighten-1" class="mb-4"></v-icon>
            <h3 class="text-h5 text-grey mb-2">No hay productos disponibles</h3>
            <p class="text-body-1 mb-4" v-if="productSearch || categoryFilter">
              No se encontraron productos con los filtros actuales. Prueba con otros criterios de búsqueda.
            </p>
            <p class="text-body-1 mb-4" v-else>
              Actualmente no hay productos disponibles para esta marca.
            </p>
            <v-btn color="primary" to="/productos" prepend-icon="fa-solid fa-grip">
              Ver todos los productos
            </v-btn>
          </div>
          
          <v-row v-else>
            <v-col 
              v-for="product in filteredProducts" 
              :key="product.id" 
              cols="12" sm="6" md="4" lg="3"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card 
  v-bind="props"
  :elevation="isHovering ? 6 : 2"
  :to="`/productos/${product.slug}`" 
  height="100%"
  class="product-card d-flex flex-column"
>
                  <div class="position-relative">
                    <v-img
                      :src="product.image"
                      height="200"
                      cover
                      class="align-end"
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
                    
                    <v-btn
                      class="add-to-quote-btn"
                      :class="{ 'show-btn': isHovering }"
                      color="primary"
                      icon="fa-solid fa-clipboard-list"
                      size="small"
                      @click.stop="addToQuote(product)"
                      title="Agregar a cotización"
                    ></v-btn>
                  </div>
                  
                  <v-card-item class="flex-grow-1">
                    <v-card-title class="text-subtitle-1 text-truncate-2">{{ product.name }}</v-card-title>
                    <v-card-subtitle>{{ getCategoryName(product.categoryId) }}</v-card-subtitle>
                  </v-card-item>
                  
                  <v-card-text>
                    <div class="d-flex justify-space-between align-center">
                      <div class="stock-indicator" :class="getStockClass(product.stock)">
                        <v-icon :icon="getStockIcon(product.stock)" size="small" class="mr-1"></v-icon>
                        <span>{{ getStockText(product.stock) }}</span>
                      </div>
                      <div class="price-indicator" v-if="showPriceIndicator(product)">
                        {{ getPriceText(product) }}
                      </div>
                      <v-chip v-else color="info" size="x-small" variant="outlined">Cotizar</v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
          
          <!-- Paginación -->
          <div v-if="filteredProducts.length > 0" class="text-center mt-6">
            <v-pagination
              v-model="page"
              :length="totalPages"
              rounded="circle"
            ></v-pagination>
          </div>
        </div>
        
        <!-- Marca no encontrada -->
        <div v-else class="text-center py-12">
          <v-icon size="x-large" icon="fa-solid fa-exclamation-triangle" color="warning" class="mb-4"></v-icon>
          <h2 class="text-h4 mb-2">Marca no encontrada</h2>
          <p class="text-body-1 mb-4">La marca que estás buscando no existe o no está disponible.</p>
          <v-btn color="primary" to="/marcas" prepend-icon="fa-solid fa-arrow-left">
            Ver todas las marcas
          </v-btn>
        </div>
      </v-container>
      
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
  const isLoadingProducts = ref(true);
  const brand = ref(null);
  const products = ref([]);
  const categories = ref([]);
  const page = ref(1);
  const itemsPerPage = ref(12);
  const totalPages = ref(1);
  
  // Filtros y búsqueda
  const productSearch = ref('');
  const categoryFilter = ref('');
  const sortOption = ref('relevance');
  
  // Snackbar
  const showSnackbar = ref(false);
  const snackbarText = ref('');
  const snackbarColor = ref('success');
  const snackbarIcon = ref('fa-solid fa-check-circle');
  
  // Obtener el id de la marca desde la URL
  const brandId = computed(() => route.params.brand);
  
  // Opciones para ordenamiento
  const sortOptions = [
    { title: 'Relevancia', value: 'relevance' },
    { title: 'Nombre: A-Z', value: 'name_asc' },
    { title: 'Nombre: Z-A', value: 'name_desc' },
    { title: 'Más recientes', value: 'newest' }
  ];
  
  // Opciones de categorías (se cargará dinámicamente)
  const categoryOptions = computed(() => {
    return categories.value.map(cat => cat.name);
  });
  
  // Breadcrumbs para navegación
  const breadcrumbs = computed(() => [
    {
      title: 'Inicio',
      disabled: false,
      to: '/'
    },
    {
      title: 'Marcas',
      disabled: false,
      to: '/marcas'
    },
    {
      title: brand.value?.name || '',
      disabled: true
    }
  ]);
  
  // Productos filtrados y ordenados
  const filteredProducts = computed(() => {
    let result = [...products.value];
    
    // Aplicar búsqueda
    if (productSearch.value) {
      const search = productSearch.value.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(search) || 
        (p.description && p.description.toLowerCase().includes(search)) ||
        p.sku.toLowerCase().includes(search)
      );
    }
    
    // Aplicar filtro de categoría
    if (categoryFilter.value) {
      const categoryId = getCategoryId(categoryFilter.value);
      if (categoryId) {
        result = result.filter(p => p.categoryId === categoryId);
      }
    }
    
    // Aplicar ordenamiento
    switch (sortOption.value) {
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      // El caso 'relevance' no necesita ordenarse (ya viene ordenado)
    }
    
    return result;
  });
  
  // Obtener el nombre de la categoría por su ID
  const getCategoryName = (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };
  
  // Obtener el ID de la categoría por su nombre
  const getCategoryId = (categoryName) => {
    const category = categories.value.find(cat => cat.name === categoryName);
    return category ? category.id : null;
  };
  
  // Métodos para indicadores de stock
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
  
  // Métodos para mostrar indicadores de precio
  const showPriceIndicator = (product) => {
    return product.priceMin !== null && product.priceMin !== undefined;
  };
  
  const getPriceText = (product) => {
    if (product.priceMin && product.priceMax) {
      return `${formatCurrency(product.priceMin)} - ${formatCurrency(product.priceMax)}`;
    } else if (product.priceMin) {
      return `Desde ${formatCurrency(product.priceMin)}`;
    }
    return 'Cotizar';
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };
  
  // Mostrar notificación
  const showNotification = (text, color = 'success', icon = 'fa-solid fa-check-circle') => {
    snackbarText.value = text;
    snackbarColor.value = color;
    snackbarIcon.value = icon;
    showSnackbar.value = true;
  };
  
  // Cargar datos de la marca
  const fetchBrand = async () => {
    loading.value = true;
    try {
      // Obtener las categorías
      categories.value = await productService.getCategories();
      
      // Usar el método getBrandBySlugOrId en lugar de buscar manualmente
      brand.value = await productService.getBrandBySlugOrId(brandId.value);
      
      if (brand.value) {
        // Si encontramos la marca, cargar sus productos
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error al cargar la marca:', error);
      brand.value = null;
    } finally {
      loading.value = false;
    }
  };
  
  // Cargar productos de la marca
  const fetchProducts = async () => {
    isLoadingProducts.value = true;
    try {
      // Usar el método específico para obtener productos por marca
      products.value = await productService.getProductsByBrand(brand.value.id);
      
      // Calcular el total de páginas para la paginación
      totalPages.value = Math.ceil(products.value.length / itemsPerPage.value);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      products.value = [];
    } finally {
      isLoadingProducts.value = false;
    }
  };
  
  // Agregar producto a cotización
  const addToQuote = (product) => {
    // Detener propagación para evitar navegación
    event.preventDefault();
    event.stopPropagation();
    
    // Agregar a la cotización
    quoteStore.addToQuote({
      ...product,
      quantity: 1
    });
    
    // Mostrar notificación
    showNotification(`${product.name} agregado a tu cotización`);
  };
  
  // Observadores para recargar cuando cambien parámetros
  watch(brandId, () => {
    fetchBrand();
  });
  
  watch([page, productSearch, categoryFilter, sortOption], () => {
    // Actualizar paginación si fuera necesario
    console.log('Filtros cambiados, actualizando productos visibles...');
  });
  
  // Inicializar al montar
  onMounted(() => {
    fetchBrand();
  });
  </script>
  
  <style scoped>
  .product-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
  }
  
  .position-relative {
    position: relative;
  }
  
  .add-to-quote-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .show-btn {
    opacity: 1;
  }
  
  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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
  
  .product-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
  }
  
  .badge-success {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
  }
  
  .badge-new {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #2196F3;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
  }
  
  .badge-info {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #9C27B0;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
  }
  
  .price-indicator {
    font-size: 0.8rem;
    font-weight: bold;
    color: #1976D2;
  }
  </style>