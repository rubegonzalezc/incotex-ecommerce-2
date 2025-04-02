<template>
  <v-container class="my-6 hero-container">
    <v-row>
      <!-- Banner Principal -->
      <v-col cols="12" md="8" class="pr-md-3 mb-3 mb-md-0">
        <v-card
          :style="`background-image: url(${mainBanner.image})`"
          class="main-banner d-flex align-end"
          height="600"
          rounded="lg"
        >
          <div class="banner-content">
            <h1 class="text-h3 text-md-h2 font-weight-bold text-white mb-2">{{ mainBanner.title }}</h1>
            <p class="text-body-1 text-md-subtitle-1 text-white mb-6">{{ mainBanner.subtitle }}</p>
            <v-btn 
              :to="mainBanner.buttonLink"
              color="orange-darken-2"
              size="large"
              class="text-white text-body-2 text-md-body-1 px-4 px-md-6 py-2"
            >
              {{ mainBanner.buttonText }}
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Banners Secundarios -->
      <v-col cols="12" md="4">
        <v-row no-gutters>
          <v-col 
            v-for="(banner, index) in secondaryBanners" 
            :key="index" 
            cols="12" 
            class="mb-3"
          >
            <v-card
              :style="`background-image: url(${banner.image})`"
              class="secondary-banner d-flex align-center"
              height="290"
              rounded="lg"
            >
              <div class="banner-content text-center">
                <h2 class="text-h5 text-md-h4 font-weight-bold text-white mb-2">{{ banner.title }}</h2>
                <p class="text-subtitle-1 text-md-h6 text-white">{{ banner.subtitle }}</p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
defineProps({
  mainBanner: {
    type: Object,
    required: true
  },
  secondaryBanners: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.main-banner, .secondary-banner {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.main-banner:hover, .secondary-banner:hover {
  transform: scale(1.02);
}

.main-banner::before, .secondary-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
  width: 100%;
}

.main-banner .banner-content {
  max-width: 600px;
}

.secondary-banner .banner-content {
  text-align: center;
}

/* Estilos responsivos mejorados */
@media (min-width: 600px) {
  .banner-content {
    padding: 2rem;
  }
}

@media (min-width: 960px) {
  .banner-content {
    padding: 3rem;
  }
}

@media (max-width: 959px) {
  .main-banner {
    height: 400px !important;
  }
  
  .secondary-banner {
    height: 200px !important;
  }
}

@media (max-width: 599px) {
  .main-banner {
    height: 300px !important;
  }
  
  .secondary-banner {
    height: 180px !important;
  }
  
  .hero-container {
    width: 95%;
    padding-left: 8px;
    padding-right: 8px;
  }
}

.hero-container {
  max-width: 1400px !important;
  width: 90%;
}
</style>