<template>
    <div>
      <AppHeader />
  
      <v-container>
        <!-- Cabecera de la página -->
        <v-row class="mb-8">
          <v-col cols="12">
            <h1 class="text-h3 mb-2">Nuestras Marcas</h1>
            <p class="text-subtitle-1">
              Trabajamos con las mejores marcas del mercado para ofrecerte soluciones eléctricas de calidad y confiabilidad.
            </p>
          </v-col>
        </v-row>
  
        <!-- Filtrado y búsqueda -->
        <v-row class="mb-6">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="fa-solid fa-search"
              label="Buscar marcas"
              hide-details
              density="compact"
              variant="outlined"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
  
        <!-- Loading indicator -->
        <div v-if="loading" class="d-flex justify-center align-center pa-10">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>
  
        <!-- Lista de marcas -->
        <v-row v-else-if="filteredBrands.length > 0">
          <v-col 
            v-for="brand in filteredBrands" 
            :key="brand.id" 
            cols="12" sm="6" md="4" lg="3"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :to="`/marcas/${brand.slug}`"
                :elevation="isHovering ? 8 : 2"
                height="100%"
                class="d-flex flex-column"
              >
                <div class="d-flex justify-center align-center pa-8 bg-grey-lighten-4" style="height: 180px;">
                  <v-img
                    :src="brand.logo || `https://via.placeholder.com/250x120/f0f0f0/808080?text=${brand.name}`"
                    :alt="brand.name"
                    contain
                    class="brand-logo"
                    max-height="100px"
                    :class="{ 'scale-up': isHovering }"
                    transition="scale-transition"
                  ></v-img>
                </div>
                
                <v-card-item>
                  <v-card-title class="text-center">{{ brand.name }}</v-card-title>
                </v-card-item>
                
                <v-card-text class="flex-grow-1">
                  <p class="text-truncate-2">{{ brand.description || `Productos y soluciones ${brand.name} para la industria eléctrica y automatización.` }}</p>
                </v-card-text>
                
                <v-card-actions>
                  <v-btn
                    block
                    color="primary"
                    variant="tonal"
                    class="mx-2 mb-2"
                  >
                    Ver productos
                    <v-icon end icon="fa-solid fa-arrow-right"></v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
  
        <!-- No se encontraron marcas -->
        <v-row v-else-if="!loading">
          <v-col cols="12">
            <v-alert
              type="info"
              variant="tonal"
              border="start"
              class="mx-auto my-8"
              max-width="600"
            >
              <div class="text-center">
                <v-icon size="large" icon="fa-solid fa-tag" class="mb-4"></v-icon>
                <h3 class="text-h5 mb-2">No se encontraron marcas</h3>
                <p v-if="searchQuery">No hay resultados para "{{ searchQuery }}". Intenta con otra búsqueda.</p>
                <p v-else>En este momento no hay marcas disponibles. Por favor, vuelve más tarde.</p>
              </div>
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
  
      <AppFooter />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
  import { productService } from '@/services/productService';
  
  // Estado
  const loading = ref(true);
  const searchQuery = ref('');
  const brands = ref([]);
  
  // Datos filtrados
  const filteredBrands = computed(() => {
    if (!searchQuery.value) return brands.value;
    
    const query = searchQuery.value.toLowerCase();
    return brands.value.filter(brand => 
      brand.name.toLowerCase().includes(query) ||
      (brand.description && brand.description.toLowerCase().includes(query))
    );
  });
  
  // Cargar marcas usando el productService
  const fetchBrands = async () => {
    loading.value = true;
    try {
      // Obtener marcas del servicio
      const brandsData = await productService.getBrands();
      
      // Agregar slugs a las marcas que no los tengan
      brands.value = brandsData.map(brand => ({
        ...brand,
        slug: brand.slug || generateSlug(brand.name),
        logo: brand.logo || `https://via.placeholder.com/250x120/f0f0f0/808080?text=${brand.name}`,
        description: brand.description || `Productos y soluciones ${brand.name} para la industria eléctrica y automatización.`,
        website: brand.website || '#'
      }));
    } catch (error) {
      console.error('Error al cargar las marcas:', error);
      brands.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  // Función para generar slug si es necesario
  const generateSlug = (text) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .trim();
  };
  
  onMounted(() => {
    fetchBrands();
  });
  </script>
  
  <style scoped>
  .brand-logo {
    transition: transform 0.3s ease;
  }
  
  .scale-up {
    transform: scale(1.1);
  }
  
  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>