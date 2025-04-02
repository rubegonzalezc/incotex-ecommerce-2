<template>
  <v-app-bar
    color="primary"
    density="compact"
    flat
    elevation="1"
  >
    <v-app-bar-title>Panel de Administración</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="$emit('toggle-theme')">
      <v-icon>{{ isDarkTheme ? 'fa-solid fa-sun' : 'fa-solid fa-moon' }}</v-icon>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          class="ml-2"
          prepend-icon="fa-solid fa-user"
        >
          {{ adminName }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$emit('go-to-website')">
          <v-list-item-title>
            <v-icon class="mr-2" size="small">fa-solid fa-globe</v-icon>
            Ver sitio web
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="$emit('logout')">
          <v-list-item-title>
            <v-icon class="mr-2" size="small" color="error">fa-solid fa-sign-out-alt</v-icon>
            <span class="text-error">Cerrar sesión</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  adminName: {
    type: String,
    required: true
  },
  isDarkTheme: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-theme', 'go-to-website', 'logout']);
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>