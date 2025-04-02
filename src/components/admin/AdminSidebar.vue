<template>
  <v-navigation-drawer
    v-model="drawerModel"
    permanent
    :rail="isMobile ? !drawerModel : false"
    :expand-on-hover="isMobile ? false : true"
    color="background"
    width="260"
  >
    <v-list-item
      prepend-avatar="https://www.incotexhv.cl/wp-content/uploads/2022/08/logo-negro-2.png"
      title="Incotex"
      nav
      class="py-2"
    >
      <template v-slot:append>
        <v-btn
          variant="text"
          icon="fa-solid fa-bars"
          @click.stop="toggleDrawer"
          v-if="isMobile"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, i) in navItems"
        :key="i"
        :value="item.value"
        :title="item.title"
        :prepend-icon="item.icon"
        :to="item.link"
        color="primary"
        rounded="lg"
        :active="activeSection === item.value"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          block
          color="error"
          prepend-icon="fa-solid fa-sign-out-alt"
          @click="$emit('logout')"
        >
          Cerrar sesión
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps({
  drawer: {
    type: Boolean,
    default: true
  },
  activeSection: {
    type: String,
    required: true
  },
  navItems: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:drawer', 'logout']);

// Usar v-model con drawer
const drawerModel = computed({
  get: () => props.drawer,
  set: (value) => emit('update:drawer', value)
});

const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);

const toggleDrawer = () => {
  emit('update:drawer', !props.drawer);
};
</script>

<style scoped>
/* Estilos específicos del sidebar si son necesarios */
</style>