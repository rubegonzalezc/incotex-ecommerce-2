<template>
  <v-container class="my-8 popular-categories-container">
    <div class="text-center mb-6">
      <h2 class="text-h4 font-weight-bold mb-2 section-title">Categorías Populares</h2>
      <p class="text-subtitle-1 section-subtitle">Encuentra todo lo que necesitas para tu proyecto</p>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="d-flex justify-center my-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <v-row v-else>
      <v-col 
        v-for="(category, index) in categories" 
        :key="category.id || index"
        cols="12" 
        sm="6"
        md="4" 
        class="px-2 mb-4"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :to="`/categorias/${category.slug}`"
            class="category-card"
            height="200"
            :style="`background-image: url(${category.image || getPlaceholderImage(category.name)})`"
            rounded="lg"
            :elevation="isHovering ? 8 : 2"
          >
            <div class="category-overlay d-flex flex-column justify-end">
              <div class="category-content pa-4">
                <h3 class="text-h5 font-weight-bold text-white mb-2">{{ category.name }}</h3>
                <div class="d-flex justify-space-between align-center">
                  <span v-if="category.productCount" class="text-caption text-white">
                    {{ category.productCount }} productos
                  </span>
                  <v-btn 
                    variant="text" 
                    color="white" 
                    class="px-0 text-body-2 category-btn"
                    :to="`/categorias/${category.slug}`"
                  >
                    Ver productos <v-icon icon="fa-solid fa-arrow-right" size="small" class="ml-1"></v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Botón para ver todas las categorías -->
    <div class="text-center mt-4">
      <v-btn
        color="primary"
        variant="outlined"
        :to="'/categorias'"
        class="px-6"
      >
        Ver todas las categorías <v-icon icon="fa-solid fa-list" size="small" class="ml-2"></v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productService } from '@/services/productService';

// Estado
const loading = ref(true);
const categories = ref([]);

// Props para permitir pasar categorías predeterminadas si es necesario
const props = defineProps({
  preloadedCategories: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 6
  }
});

// Método para generar imagen de placeholder si no hay imagen disponible
const getPlaceholderImage = (categoryName) => {
  return `https://via.placeholder.com/400x200/1867C0/FFFFFF?text=${encodeURIComponent(categoryName)}`;
};

// Función para cargar las categorías desde el productService
const loadCategories = async () => {
  try {
    // Si se proporcionaron categorías como prop, usarlas
    if (props.preloadedCategories && props.preloadedCategories.length > 0) {
      categories.value = props.preloadedCategories.slice(0, props.limit);
      loading.value = false;
      return;
    }

    // De lo contrario, obtenerlas del servicio
    const allCategories = await productService.getCategories();
    const allProducts = await productService.getProducts();
    
    // Calcular el número de productos por categoría
    const categoriesWithCount = allCategories.map(category => {
      const productCount = allProducts.filter(p => p.categoryId === category.id).length;
      return {
        ...category,
        productCount,
        image: category.image || getPlaceholderImage(category.name)
      };
    });

    // Ordenar por número de productos (de mayor a menor)
    categoriesWithCount.sort((a, b) => b.productCount - a.productCount);
    
    // Limitar al número especificado
    categories.value = categoriesWithCount.slice(0, props.limit);
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.popular-categories-container {
  max-width: 1400px !important;
  width: 90%;
}

.category-card {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%);
}

.category-content {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 0 0 8px 8px;
  transition: padding 0.3s ease;
}

.category-card:hover .category-content {
  padding-top: 24px !important;
  padding-bottom: 24px !important;
}

.category-content h3 {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.category-btn {
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.category-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 959px) {
  .category-card {
    height: 180px !important;
  }
}

@media (max-width: 599px) {
  .popular-categories-container {
    width: 95%;
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .category-card {
    height: 160px !important;
  }
}

.section-title {
  color: #1867C0;
}

.section-subtitle {
  color: rgba(0, 0, 0, 0.7);
}
</style>