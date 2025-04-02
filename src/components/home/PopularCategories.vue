<template>
  <v-container class="my-8 popular-categories-container">
    <div class="text-center mb-6">
      <h2 class="text-h4 font-weight-bold mb-2 section-title">Categorías Populares</h2>
      <p class="text-subtitle-1 section-subtitle">Encuentra todo lo que necesitas para tu proyecto</p>
    </div>

    <v-row>
      <v-col 
        v-for="(category, index) in categories" 
        :key="index"
        cols="12" 
        md="4" 
        class="px-2 mb-4"
      >
        <v-card
          :to="category.link"
          class="category-card"
          height="200"
          :style="`background-image: url(${category.image})`"
          rounded="lg"
        >
          <div class="category-overlay d-flex flex-column justify-end">
            <div class="category-content pa-4">
              <h3 class="text-h5 font-weight-bold text-white mb-2">{{ category.name }}</h3>
              <v-btn 
                variant="text" 
                color="white" 
                class="px-0 text-body-2 category-btn"
                :to="category.link"
              >
                Ver productos <v-icon icon="fa-solid fa-arrow-right" size="small" class="ml-1"></v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  }
})
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
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: scale(1.03);
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