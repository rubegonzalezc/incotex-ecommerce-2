<template>
  <AdminLayout>
    <v-card>
      <v-card-title class="d-flex align-center py-4">
        <span class="text-h5">Gestión de Cotizaciones</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="quoteSearch"
          append-inner-icon="fa-solid fa-search"
          label="Buscar cotizaciones"
          hide-details
          density="compact"
          variant="outlined"
          class="max-width-search mr-2"
          style="max-width: 300px"
        ></v-text-field>
        <v-btn-group>
          <v-btn color="primary" prepend-icon="fa-solid fa-filter" @click="filterDialog = true">
            Filtros
          </v-btn>
          <v-btn color="success" prepend-icon="fa-solid fa-file-excel">
            Exportar
          </v-btn>
        </v-btn-group>
      </v-card-title>
      
      <v-data-table
        :headers="quoteHeaders"
        :items="filteredQuotes"
        :items-per-page="10"
        class="elevation-0"
      >
        <template v-slot:item.id="{ item }">
          <span class="font-weight-medium">#{{ item.id }}</span>
        </template>
        
        <template v-slot:item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        
        <template v-slot:item.total="{ item }">
          {{ formatCurrency(item.total) }}
        </template>
        
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-btn icon="fa-solid fa-eye" variant="text" color="info" size="small" @click="viewQuote(item)"></v-btn>
            <v-btn icon="fa-solid fa-check" variant="text" color="success" size="small" @click="approveQuote(item)" v-if="item.status === 'Pendiente'"></v-btn>
            <v-btn icon="fa-solid fa-times" variant="text" color="error" size="small" @click="rejectQuote(item)" v-if="item.status === 'Pendiente'"></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para ver detalles de cotización -->
    <v-dialog v-model="quoteDialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white">
          Detalles de Cotización #{{ selectedQuote.id }}
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">Información del Cliente</h3>
              <p><strong>Nombre:</strong> {{ selectedQuote.customer.name }}</p>
              <p><strong>Email:</strong> {{ selectedQuote.customer.email }}</p>
              <p><strong>Teléfono:</strong> {{ selectedQuote.customer.phone }}</p>
              <p><strong>Empresa:</strong> {{ selectedQuote.customer.company }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">Información de la Cotización</h3>
              <p><strong>Fecha:</strong> {{ formatDate(selectedQuote.date) }}</p>
              <p><strong>Estado:</strong> 
                <v-chip
                  :color="getStatusColor(selectedQuote.status)"
                  size="small"
                  class="ml-2"
                >
                  {{ selectedQuote.status }}
                </v-chip>
              </p>
              <p><strong>Nota:</strong> {{ selectedQuote.note || 'Sin notas' }}</p>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <h3 class="text-subtitle-1 font-weight-bold mb-2">Productos Cotizados</h3>
          <v-table>
            <thead>
              <tr>
                <th>Producto</th>
                <th class="text-center">Cantidad</th>
                <th class="text-end">Precio</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selectedQuote.items" :key="index">
                <td>{{ item.product }}</td>
                <td class="text-center">{{ item.quantity }}</td>
                <td class="text-end">{{ formatCurrency(item.price) }}</td>
                <td class="text-end">{{ formatCurrency(item.quantity * item.price) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-end font-weight-bold">Total:</td>
                <td class="text-end font-weight-bold">{{ formatCurrency(selectedQuote.total) }}</td>
              </tr>
            </tfoot>
          </v-table>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" variant="text" prepend-icon="fa-solid fa-file-pdf">
            Exportar PDF
          </v-btn>
          <v-btn color="info" variant="text" prepend-icon="fa-solid fa-envelope">
            Enviar Email
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="success" 
            variant="elevated" 
            @click="approveQuote(selectedQuote)"
            v-if="selectedQuote.status === 'Pendiente'"
          >
            Aprobar
          </v-btn>
          <v-btn 
            color="error" 
            variant="outlined" 
            @click="rejectQuote(selectedQuote)"
            v-if="selectedQuote.status === 'Pendiente'"
          >
            Rechazar
          </v-btn>
          <v-btn color="secondary" variant="text" @click="quoteDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de filtros -->
    <v-dialog v-model="filterDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Filtrar Cotizaciones</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions"
                  label="Estado"
                  multiple
                  chips
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="filters.dateFrom"
                  label="Fecha desde"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="filters.dateTo"
                  label="Fecha hasta"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="text" @click="clearFilters">Limpiar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="filterDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="applyFilters">Aplicar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminLayout from '@/components/admin/AdminLayout.vue';

// Datos para la tabla de cotizaciones
const quoteSearch = ref('');
const quoteHeaders = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Cliente', key: 'customer.name', align: 'start' },
  { title: 'Fecha', key: 'date', align: 'start' },
  { title: 'Total', key: 'total', align: 'end' },
  { title: 'Estado', key: 'status', align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
];

// Estados de cotización
const statusOptions = ['Pendiente', 'Aprobada', 'Rechazada', 'Expirada'];

// Filtros
const filterDialog = ref(false);
const filters = ref({
  status: [],
  dateFrom: '',
  dateTo: ''
});

// Datos de cotizaciones
const quotes = ref([
  {
    id: 10045,
    customer: {
      name: 'Juan Pérez',
      email: 'juan.perez@ejemplo.cl',
      phone: '+56 9 8765 4321',
      company: 'Constructora XYZ'
    },
    date: new Date(new Date().setHours(new Date().getHours() - 2)),
    total: 450000,
    status: 'Pendiente',
    note: 'Cliente necesita entrega urgente',
    items: [
      { product: 'Contactor Tripolar ABB AX09-30-10-80', quantity: 3, price: 75000 },
      { product: 'Relé Térmico Siemens 3RU1126-4DB0', quantity: 2, price: 28900 },
      { product: 'Cable Multiconductor LSHF 4x2.5mm2', quantity: 50, price: 1250 }
    ]
  },
  {
    id: 10044,
    customer: {
      name: 'María González',
      email: 'maria.gonzalez@empresa.cl',
      phone: '+56 9 1234 5678',
      company: 'Industrias Eléctricas S.A.'
    },
    date: new Date(new Date().setHours(new Date().getHours() - 8)),
    total: 380500,
    status: 'Aprobada',
    note: '',
    items: [
      { product: 'Interruptor Automático Schneider C60H-DC', quantity: 5, price: 48500 },
      { product: 'Transformador de Control Legrand 250VA', quantity: 1, price: 85000 },
      { product: 'Cable Multiconductor LSHF 4x2.5mm2', quantity: 30, price: 1250 }
    ]
  },
  {
    id: 10043,
    customer: {
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@ejemplo.cl',
      phone: '+56 9 5555 6666',
      company: 'Electricidad Rodriguez'
    },
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    total: 225000,
    status: 'Rechazada',
    note: 'Cliente solicitó otros modelos',
    items: [
      { product: 'Contactor Tripolar ABB AX09-30-10-80', quantity: 3, price: 75000 }
    ]
  },
  {
    id: 10042,
    customer: {
      name: 'Ana Martínez',
      email: 'ana.martinez@ejemplo.cl',
      phone: '+56 9 3333 4444',
      company: 'Servicios Técnicos AM'
    },
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    total: 183600,
    status: 'Pendiente',
    note: '',
    items: [
      { product: 'Relé Térmico Siemens 3RU1126-4DB0', quantity: 5, price: 28900 },
      { product: 'Cable Multiconductor LSHF 4x2.5mm2', quantity: 25, price: 1250 }
    ]
  },
  {
    id: 10041,
    customer: {
      name: 'Pedro Soto',
      email: 'pedro.soto@empresa.cl',
      phone: '+56 9 7777 8888',
      company: 'Minera Norte'
    },
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
    total: 520000,
    status: 'Expirada',
    note: 'No se recibió confirmación del cliente',
    items: [
      { product: 'Interruptor Automático Schneider C60H-DC', quantity: 4, price: 48500 },
      { product: 'Transformador de Control Legrand 250VA', quantity: 3, price: 85000 },
      { product: 'Contactor Tripolar ABB AX09-30-10-80', quantity: 1, price: 75000 }
    ]
  }
]);

// Cotizaciones filtradas según la búsqueda y filtros
const filteredQuotes = computed(() => {
  let result = quotes.value;
  
  // Aplicar búsqueda
  if (quoteSearch.value) {
    const searchTerm = quoteSearch.value.toLowerCase();
    result = result.filter(quote => 
      quote.id.toString().includes(searchTerm) ||
      quote.customer.name.toLowerCase().includes(searchTerm) ||
      quote.customer.company.toLowerCase().includes(searchTerm)
    );
  }
  
  // Aplicar filtros
  if (filters.value.status && filters.value.status.length > 0) {
    result = result.filter(quote => filters.value.status.includes(quote.status));
  }
  
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom);
    result = result.filter(quote => new Date(quote.date) >= fromDate);
  }
  
  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo);
    toDate.setHours(23, 59, 59);
    result = result.filter(quote => new Date(quote.date) <= toDate);
  }
  
  return result;
});

// Estado del diálogo de cotización
const quoteDialog = ref(false);
const selectedQuote = ref({
  id: 0,
  customer: {
    name: '',
    email: '',
    phone: '',
    company: ''
  },
  date: new Date(),
  total: 0,
  status: '',
  note: '',
  items: []
});

// Métodos
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pendiente': return 'warning';
    case 'Aprobada': return 'success';
    case 'Rechazada': return 'error';
    case 'Expirada': return 'grey';
    default: return 'primary';
  }
};

const viewQuote = (quote) => {
  selectedQuote.value = { ...quote };
  quoteDialog.value = true;
};

const approveQuote = (quote) => {
  // Buscar la cotización y actualizar su estado
  const index = quotes.value.findIndex(q => q.id === quote.id);
  if (index !== -1) {
    quotes.value[index].status = 'Aprobada';
    
    // Si el diálogo está abierto, actualizar también la cotización seleccionada
    if (quoteDialog.value && selectedQuote.value.id === quote.id) {
      selectedQuote.value.status = 'Aprobada';
    }
  }
};

const rejectQuote = (quote) => {
  // Buscar la cotización y actualizar su estado
  const index = quotes.value.findIndex(q => q.id === quote.id);
  if (index !== -1) {
    quotes.value[index].status = 'Rechazada';
    
    // Si el diálogo está abierto, actualizar también la cotización seleccionada
    if (quoteDialog.value && selectedQuote.value.id === quote.id) {
      selectedQuote.value.status = 'Rechazada';
    }
  }
};

const clearFilters = () => {
  filters.value = {
    status: [],
    dateFrom: '',
    dateTo: ''
  };
};

const applyFilters = () => {
  filterDialog.value = false;
};
</script>

<style scoped>
.max-width-search {
  max-width: 300px;
}
</style>