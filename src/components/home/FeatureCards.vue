<template>
  <v-container class="my-6 feature-container">
    <v-row>
      <v-col
        v-for="(feature, index) in features"
        :key="index"
        cols="12"
        sm="6"
        md="3"
        class="px-2"
      >
        <v-card class="feature-card d-flex flex-column align-center py-6 px-4" flat elevation="1">
          <v-icon
            :icon="feature.icon"
            size="x-large"
            color="primary"
            class="mb-4"
          ></v-icon>
          <h3 class="text-h6 font-weight-bold text-center mb-2 text-primary">{{ feature.title }}</h3>
          <p class="text-body-2 text-center text-dark">{{ feature.description }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productService } from '@/services/productService';

// Estado local para almacenar las features obtenidas
const features = ref([]);

// Props para permitir pasar features predeterminadas si es necesario
const props = defineProps({
  features: {
    type: Array,
    default: () => []
  }
});

// Función para cargar las features desde el productService
const loadFeatures = async () => {
  try {
    // Si se proporcionaron features como prop, usarlas
    if (props.features && props.features.length > 0) {
      features.value = props.features;
      return;
    }

    // De lo contrario, obtenerlas del servicio
    const featureData = await productService.getFeatures();
    features.value = featureData;
  } catch (error) {
    console.error('Error al cargar las características:', error);
    // Proporcionar datos de respaldo en caso de error
    features.value = [
      {
        icon: "fa-solid fa-truck-fast",
        title: "Envío Rápido",
        description: "Entrega en todo Chile con seguimiento en tiempo real."
      },
      {
        icon: "fa-solid fa-shield-halved",
        title: "Garantía de Calidad",
        description: "Todos nuestros productos cuentan con garantía."
      },
      {
        icon: "fa-solid fa-headset",
        title: "Soporte Técnico",
        description: "Asesoría especializada antes y después de tu compra."
      },
      {
        icon: "fa-solid fa-tag",
        title: "Mejores Precios",
        description: "Precios competitivos para proyectos."
      }
    ];
  }
};

// Cargar las features al montar el componente
onMounted(() => {
  loadFeatures();
});
</script>

<style scoped>
.feature-container {
  max-width: 1400px !important;
  width: 90%;
}

.feature-card {
  background-color: #f5f7fa;
  border-radius: 8px;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.text-dark {
  color: rgba(0, 0, 0, 0.8) !important;
}

.text-primary {
  color: #1867C0 !important;
}

@media (max-width: 599px) {
  .feature-container {
    width: 95%;
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>