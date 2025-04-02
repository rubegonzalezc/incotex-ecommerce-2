<template>
  <div>
    <AppHeader />
    
    <!-- Hero Banner con carga condicional -->
    <div v-if="loading.banner" class="d-flex justify-center my-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <HeroBanner 
      v-else
      :mainBanner="bannerData.mainBanner" 
      :secondaryBanners="bannerData.secondaryBanners" 
    />
    
    <!-- Feature Cards con carga condicional -->
    <div v-if="loading.features" class="d-flex justify-center my-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <FeatureCards 
      v-else
      :features="featuresData" 
    />
    
    <!-- Popular Categories con carga condicional -->
    <div v-if="loading.categories" class="d-flex justify-center my-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <PopularCategories 
      v-else
      :categories="categoriesData" 
    />
    
    <div v-if="loading.products" class="d-flex justify-center my-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <FeaturedProducts 
      v-else
      :products="productsData" 
    />
    <!-- Aquí puedes agregar más secciones de la página de inicio -->
  </div>
  <AppFooter />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import HeroBanner from '@/components/home/HeroBanner.vue';
import FeatureCards from '@/components/home/FeatureCards.vue';
import PopularCategories from '@/components/home/PopularCategories.vue';
import FeaturedProducts from '@/components/home/FeaturedProducts.vue'; // Add this import
import { contentService } from '@/services/contentService';

// Estado de carga para diferentes secciones
const loading = ref({
  banner: true,
  features: true,
  categories: true,
  products: true // Add this loading state
});

// Datos para los productos destacados
const productsData = ref([]);

// Datos para el banner principal y secundario
const bannerData = ref({
  mainBanner: {
    title: "Soluciones Eléctricas Profesionales",
    subtitle: "Encuentra todo lo que necesitas para tus proyectos eléctricos con las mejores marcas y asesoría especializada",
    buttonText: "Ver Productos",
    buttonLink: "/productos",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  secondaryBanners: [
    {
      title: "Proyectos Industriales",
      subtitle: "Soluciones a medida para la industria",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Asesoría Técnica",
      subtitle: "Expertos a tu servicio",
      image: "https://images.unsplash.com/photo-1581092160607-ee22731c2eaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    }
  ]
});

// Datos para las tarjetas de características (datos de respaldo)
const featuresData = ref([
  {
    icon: "fa-solid fa-truck-fast",
    title: "Envío Rápido",
    description: "Entrega en todo Chile con seguimiento en tiempo real de tus pedidos."
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Garantía de Calidad",
    description: "Todos nuestros productos cuentan con garantía y certificaciones."
  },
  {
    icon: "fa-solid fa-headset",
    title: "Soporte Técnico",
    description: "Asesoría especializada antes, durante y después de tu compra."
  },
  {
    icon: "fa-solid fa-tag",
    title: "Mejores Precios",
    description: "Precios competitivos y descuentos especiales para proyectos."
  }
]);

// Datos para las categorías populares (datos de respaldo)
const categoriesData = ref([
  {
    name: "Automatización Industrial",
    link: "/categorias/automatizacion",
    image: "https://images.unsplash.com/photo-1581092160607-ee22731c2eaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    name: "Iluminación",
    link: "/categorias/iluminacion",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    name: "Protección Eléctrica",
    link: "/categorias/proteccion",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  }
]);

onMounted(async () => {
  try {
    console.log('Intentando cargar datos del banner...');
    const data = await contentService.getHeroBannerContent();
    console.log('Datos recibidos del banner:', data);
    
    // Solo actualizamos si recibimos datos válidos de la API
    if (data && data.mainBanner && data.secondaryBanners) {
      bannerData.value = data;
    }
  } catch (error) {
    console.error('Error cargando datos del banner:', error);
    // Usaremos los datos de respaldo definidos arriba
  } finally {
    loading.value.banner = false;
  }
  
  try {
    console.log('Intentando cargar datos de las características...');
    const featuresResult = await contentService.getFeatureCardsContent();
    console.log('Datos recibidos de características:', featuresResult);
    
    // Solo actualizamos si recibimos datos válidos de la API
    if (featuresResult && featuresResult.length > 0) {
      featuresData.value = featuresResult;
    }
  } catch (error) {
    console.error('Error cargando datos de las características:', error);
    // Usaremos los datos de respaldo definidos arriba
  } finally {
    loading.value.features = false;
  }
  
  try {
    console.log('Intentando cargar datos de categorías populares...');
    const categoriesResult = await contentService.getPopularCategoriesContent();
    console.log('Datos recibidos de categorías:', categoriesResult);
    
    // Solo actualizamos si recibimos datos válidos de la API
    if (categoriesResult && categoriesResult.length > 0) {
      categoriesData.value = categoriesResult;
    }
  } catch (error) {
    console.error('Error cargando datos de categorías:', error);
    // Usaremos los datos de respaldo definidos arriba
  } finally {
    loading.value.categories = false;
  }

  try {
    console.log('Intentando cargar datos de productos destacados...');
    const productsResult = await contentService.getFeaturedProductsContent();
    console.log('Datos recibidos de productos destacados:', productsResult);
    
    // Solo actualizamos si recibimos datos válidos de la API
    if (productsResult && productsResult.length > 0) {
      productsData.value = productsResult;
    }
  } catch (error) {
    console.error('Error cargando datos de productos destacados:', error);
    // Usaremos los datos de respaldo si hubieran sido definidos
    productsData.value = []; // Or define fallback data if needed
  } finally {
    loading.value.products = false;
  }
});
</script>
