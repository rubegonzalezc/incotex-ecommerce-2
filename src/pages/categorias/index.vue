<template>
    <div>
      <AppHeader />
  
      <!-- Cabecera de la página -->
      <v-container fluid class="categories-header py-8 mb-8">
        <v-container class="text-center">
          <h1 class="text-h3 font-weight-bold mb-2">Categorías de Productos</h1>
          <p class="text-subtitle-1">Explora nuestras categorías para encontrar los productos que necesitas</p>
        </v-container>
      </v-container>
  
      <v-container class="categories-container">
        <!-- Loading indicator -->
        <div v-if="loading" class="d-flex justify-center my-16">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>
  
        <template v-else>
          <!-- Búsqueda de categorías (opcional) -->
          <v-text-field
            v-model="searchTerm"
            label="Buscar categorías"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="fa-solid fa-magnifying-glass"
            clearable
            @click:clear="searchTerm = ''"
            class="mb-6"
            v-if="allCategories.length > 5"
          ></v-text-field>
  
          <!-- Grid de categorías -->
          <v-row v-if="filteredCategories.length > 0">
            <v-col 
              v-for="category in filteredCategories" 
              :key="category.id"
              cols="12" 
              sm="6"
              md="4"
              lg="3"
              class="px-2 mb-4"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :to="`/categorias/${category.slug || category.id}`"
                  class="category-card h-100"
                  :elevation="isHovering ? 6 : 2"
                  rounded="lg"
                >
                  <v-img
                    :src="category.image || getPlaceholderImage(category.name)"
                    height="180"
                    cover
                    class="category-image"
                  >
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                      </v-row>
                    </template>
                    <div class="category-overlay d-flex align-end">
                      <div class="category-title-container pa-4 w-100">
                        <h2 class="text-h5 font-weight-bold text-white mb-1">{{ category.name }}</h2>
                        <div class="d-flex justify-space-between align-center">
                          <span v-if="category.productCount !== undefined" class="text-body-2 text-white">
                            {{ category.productCount }} productos
                          </span>
                          <v-btn
                            variant="text"
                            color="white"
                            class="px-0 text-body-2"
                            density="comfortable"
                          >
                            Ver productos <v-icon icon="fa-solid fa-arrow-right" size="small" class="ml-1"></v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-img>
  
                  <v-card-text v-if="category.description" class="pt-4">
                    <p class="text-truncate-2 text-body-2 text-grey-darken-1">
                      {{ category.description }}
                    </p>
                  </v-card-text>
  
                  <v-card-text v-if="category.subcategories && category.subcategories.length > 0" class="pt-2">
                    <div class="subcategories">
                      <div class="text-subtitle-2 font-weight-medium mb-2">Subcategorías:</div>
                      <v-chip-group>
                        <v-chip
                          v-for="subcategory in category.subcategories.slice(0, 3)"
                          :key="subcategory.id"
                          size="small"
                          color="primary"
                          variant="outlined"
                          :to="`/categorias/${subcategory.slug || subcategory.id}`"
                          class="mr-1 mb-1"
                        >
                          {{ subcategory.name }}
                        </v-chip>
                        <v-chip
                          v-if="category.subcategories.length > 3"
                          size="small"
                          variant="flat"
                          class="mr-1 mb-1"
                        >
                          +{{ category.subcategories.length - 3 }} más
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
  
          <!-- Mensaje si no hay categorías -->
          <v-card v-else class="text-center pa-6">
            <v-icon icon="fa-solid fa-folder-open" size="x-large" color="grey" class="mb-4"></v-icon>
            <h3 class="text-h5 mb-2">No se encontraron categorías</h3>
            <p class="text-body-1 mb-4" v-if="searchTerm">
              No hay categorías que coincidan con "{{ searchTerm }}". Intenta con otro término.
            </p>
            <p class="text-body-1 mb-4" v-else>
              Actualmente no hay categorías disponibles.
            </p>
            <v-btn color="primary" @click="searchTerm = ''" v-if="searchTerm">Limpiar búsqueda</v-btn>
          </v-card>
        </template>
      </v-container>
  
      <AppFooter />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { productService } from '@/services/productService';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
  
  // Estado
  const loading = ref(true);
  const allCategories = ref([]);
  const searchTerm = ref('');
  
  // Método para generar imagen placeholder para categorías
  const getPlaceholderImage = (categoryName) => {
    const colors = [
      '1867C0/FFFFFF', // azul/blanco
      '4CAF50/FFFFFF', // verde/blanco
      'FFC107/000000', // amarillo/negro
      '9C27B0/FFFFFF', // morado/blanco
      'FF5722/FFFFFF'  // naranja/blanco
    ];
    
    // Usar el primer carácter del nombre para elegir un color (cierta consistencia)
    const colorIndex = categoryName.charCodeAt(0) % colors.length;
    const colorCombo = colors[colorIndex];
    
    return `https://via.placeholder.com/400x180/${colorCombo}?text=${encodeURIComponent(categoryName)}`;
  };
  
  // Filtrar categorías basado en la búsqueda
  const filteredCategories = computed(() => {
    if (!searchTerm.value.trim()) {
      return allCategories.value;
    }
    
    const term = searchTerm.value.toLowerCase().trim();
    return allCategories.value.filter(category => 
      category.name.toLowerCase().includes(term) || 
      (category.description && category.description.toLowerCase().includes(term))
    );
  });
  
  // Cargar categorías
  const loadCategories = async () => {
    try {
      // Obtener todas las categorías
      const categoriesData = await productService.getCategories();
      
      // Obtener todos los productos para calcular productos por categoría
      const productsData = await productService.getProducts();
      
      // Enriquecer las categorías con conteo de productos e imágenes
      const enhancedCategories = categoriesData.map(category => {
        // Contar productos en esta categoría
        const productCount = productsData.filter(p => p.categoryId === category.id).length;
        
        // Asignar una imagen si no tiene
        const image = category.image || getPlaceholderImage(category.name);
        
        // Descripción por defecto si no tiene
        const description = category.description || `Explora nuestra selección de productos en la categoría ${category.name}.`;
        
        // Retornar categoría con datos adicionales
        return {
          ...category,
          productCount,
          image,
          description
        };
      });
      
      // Ordenar por número de productos (de mayor a menor)
      enhancedCategories.sort((a, b) => b.productCount - a.productCount);
      
      allCategories.value = enhancedCategories;
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      allCategories.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  // Inicializar componente
  onMounted(() => {
    loadCategories();
  });
  </script>
  
  <style scoped>
  .categories-header {
    background-color: #f5f7fa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .categories-container {
    max-width: 1400px !important;
    padding-bottom: 64px;
  }
  
  .category-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
  }
  
  .category-card:hover {
    transform: translateY(-5px);
  }
  
  .category-image {
    position: relative;
  }
  
  .category-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%);
  }
  
  .category-title-container {
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 0 0 8px 8px;
    transition: padding 0.3s ease;
  }
  
  .category-card:hover .category-title-container {
    padding-top: 24px !important;
    padding-bottom: 24px !important;
  }
  
  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Ajustes responsive */
  @media (max-width: 959px) {
    .categories-container {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  
  @media (max-width: 599px) {
    .category-card {
      min-height: auto;
    }
  }
  </style>