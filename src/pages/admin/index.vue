<template>
  <AdminLayout>
    <h1 class="text-h4 mb-6">Dashboard</h1>
    
    <v-row>
      <!-- Tarjetas de estadísticas -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="#E3F2FD">
          <v-card-text>
            <div class="text-overline mb-1">COTIZACIONES HOY</div>
            <div class="text-h4 mb-2">{{ stats.quotesToday }}</div>
            <div class="d-flex align-center">
              <v-icon
                :color="stats.quotesChange >= 0 ? 'success' : 'error'"
                class="mr-1"
              >
                {{ stats.quotesChange >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down' }}
              </v-icon>
              <span
                :class="stats.quotesChange >= 0 ? 'text-success' : 'text-error'"
              >
                {{ Math.abs(stats.quotesChange) }}%
              </span>
              <span class="text-caption ml-1">vs. ayer</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" to="/admin/cotizaciones">
              Ver cotizaciones
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="#E8F5E9">
          <v-card-text>
            <div class="text-overline mb-1">PRODUCTOS</div>
            <div class="text-h4 mb-2">{{ stats.products }}</div>
            <div class="d-flex align-center">
              <v-icon
                color="warning"
                class="mr-1"
              >
                fa-solid fa-circle-info
              </v-icon>
              <span class="text-caption">
                {{ stats.lowStock }} con stock bajo
              </span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" to="/admin/productos">
              Gestionar productos
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="#FFF3E0">
          <v-card-text>
            <div class="text-overline mb-1">USUARIOS</div>
            <div class="text-h4 mb-2">{{ stats.users }}</div>
            <div class="d-flex align-center">
              <v-icon
                color="success"
                class="mr-1"
              >
                fa-solid fa-arrow-up
              </v-icon>
              <span class="text-success">{{ stats.newUsers }}</span>
              <span class="text-caption ml-1">nuevos hoy</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" to="/admin/usuarios">
              Ver usuarios
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="#FFEBEE">
          <v-card-text>
            <div class="text-overline mb-1">VENTAS MENSUALES</div>
            <div class="text-h4 mb-2">{{ formatCurrency(stats.monthlySales) }}</div>
            <div class="d-flex align-center">
              <v-icon
                :color="stats.salesChange >= 0 ? 'success' : 'error'"
                class="mr-1"
              >
                {{ stats.salesChange >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down' }}
              </v-icon>
              <span
                :class="stats.salesChange >= 0 ? 'text-success' : 'text-error'"
              >
                {{ Math.abs(stats.salesChange) }}%
              </span>
              <span class="text-caption ml-1">vs. mes anterior</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" to="/admin/ventas">
              Ver reportes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Gráficos y actividad reciente -->
    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span>Cotizaciones y Ventas</span>
            <v-spacer></v-spacer>
            <v-select
              v-model="chartPeriod"
              :items="chartPeriods"
              density="compact"
              variant="outlined"
              hide-details
              class="max-width-select"
            ></v-select>
          </v-card-title>
          <v-card-text>
            <div class="chart-container" style="height: 300px">
              <div class="text-center text-body-1 mt-8">
                [Aquí iría un gráfico de cotizaciones y ventas]
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <span>Actividad Reciente</span>
          </v-card-title>
          <v-list lines="two">
            <v-list-item
              v-for="(activity, index) in recentActivity"
              :key="index"
              :subtitle="formatDate(activity.date)"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" size="36">
                  <v-icon color="white" size="small">{{ activity.icon }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>{{ activity.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              variant="text" 
              color="primary"
              to="/admin/actividad"
            >
              Ver toda la actividad
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '@/components/admin/AdminLayout.vue';

// Estadísticas del dashboard
const stats = ref({
  quotesToday: 18,
  quotesChange: 12.5,
  products: 358,
  lowStock: 24,
  users: 1254,
  newUsers: 7,
  monthlySales: 34589000,
  salesChange: -3.2,
});

// Períodos para el gráfico
const chartPeriod = ref('month');
const chartPeriods = [
  { title: 'Última semana', value: 'week' },
  { title: 'Último mes', value: 'month' },
  { title: 'Último trimestre', value: 'quarter' },
  { title: 'Último año', value: 'year' },
];

// Actividad reciente
const recentActivity = ref([
  {
    title: 'Nueva cotización #10045 de Juan Pérez',
    date: new Date(new Date().setHours(new Date().getHours() - 2)),
    icon: 'fa-solid fa-clipboard-list',
  },
  {
    title: 'Nuevo usuario registrado: María González',
    date: new Date(new Date().setHours(new Date().getHours() - 5)),
    icon: 'fa-solid fa-user-plus',
  },
  {
    title: 'Producto "Contactor ABB" actualizado',
    date: new Date(new Date().setHours(new Date().getHours() - 8)),
    icon: 'fa-solid fa-edit',
  },
  {
    title: 'Cotización #10033 aprobada',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    icon: 'fa-solid fa-check',
  },
]);

// Métodos de formato
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

const formatDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return `Hoy, ${date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Ayer, ${date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('es-CL', { 
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};
</script>

<style scoped>
.max-width-select {
  max-width: 200px;
}

.chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>