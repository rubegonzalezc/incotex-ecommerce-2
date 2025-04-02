<template>
  <AdminLayout>
    <v-card>
      <v-card-title class="d-flex align-center py-4">
        <span class="text-h5">Gestión de Productos</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="productSearch"
          append-inner-icon="fa-solid fa-search"
          label="Buscar productos"
          hide-details
          density="compact"
          variant="outlined"
          class="max-width-search mr-2"
          style="max-width: 300px"
        ></v-text-field>
        <v-btn color="primary" prepend-icon="fa-solid fa-plus" @click="openNewProductDialog">
          Nuevo Producto
        </v-btn>
      </v-card-title>
      
      <v-data-table
        :headers="productHeaders"
        :items="filteredProducts"
        :items-per-page="10"
        class="elevation-0"
      >
        <template v-slot:item.image="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="40" class="bg-grey-lighten-3">
              <v-img :src="item.image" :alt="item.name" contain></v-img>
            </v-avatar>
          </div>
        </template>
        
        <template v-slot:item.stock="{ item }">
          <v-chip
            :color="getStockColor(item.stock)"
            size="small"
            variant="outlined"
          >
            {{ item.stock }}
          </v-chip>
        </template>
        
        <template v-slot:item.price="{ item }">
          {{ formatCurrency(item.price) }}
        </template>
        
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-btn icon="fa-solid fa-edit" variant="text" color="primary" size="small" @click="editProduct(item)"></v-btn>
            <v-btn icon="fa-solid fa-trash" variant="text" color="error" size="small" @click="confirmDeleteProduct(item)"></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para nuevo producto -->
    <v-dialog v-model="productDialog" max-width="700px">
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white">
          {{ editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto' }}
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="Nombre del producto"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.sku"
                  label="SKU"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.category"
                  :items="categories"
                  label="Categoría"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="editedItem.stock"
                  label="Stock"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="editedItem.price"
                  label="Precio"
                  type="number"
                  prefix="$"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.image"
                  label="URL de imagen"
                  hint="Ingrese la URL de la imagen del producto"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Descripción"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeProductDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveProduct">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">¿Estás seguro de que quieres eliminar este producto?</v-card-title>
        <v-card-text>
          Esta acción no se puede deshacer. Se eliminará el producto <strong>{{ deleteItem.name }}</strong>.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteProduct">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminLayout from '@/components/admin/AdminLayout.vue';

// Datos para la tabla de productos
const productSearch = ref('');
const productHeaders = [
  { title: 'Imagen', key: 'image', sortable: false, align: 'start' },
  { title: 'Nombre', key: 'name', align: 'start' },
  { title: 'SKU', key: 'sku', align: 'start' },
  { title: 'Categoría', key: 'category', align: 'start' },
  { title: 'Stock', key: 'stock', align: 'center' },
  { title: 'Precio', key: 'price', align: 'end' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
];

// Lista de categorías
const categories = [
  'Contactores',
  'Interruptores',
  'Relés',
  'Transformadores',
  'Cables',
  'Baterías',
  'Herramientas',
  'Conectores',
  'Iluminación',
  'Seguridad'
];

// Datos de productos
const products = ref([
  {
    id: 1,
    name: 'Contactor Tripolar ABB AX09-30-10-80',
    sku: 'CTR-ABB-093010',
    category: 'Contactores',
    image: 'https://www.electromaterial.cl/wp-content/uploads/2021/01/AX09-30-10-80-300x300.jpg',
    stock: 35,
    price: 75000,
    description: 'Contactor tripolar ABB 9A 220V 50/60Hz. Ideal para aplicaciones industriales.'
  },
  {
    id: 2,
    name: 'Interruptor Automático Schneider C60H-DC',
    sku: 'INT-SCH-C60HDC',
    category: 'Interruptores',
    image: 'https://www.se.com/cl/es/product/%7B%7Bitem.productUrlPath%7D%7D/image/C60H-DC.JPG',
    stock: 12,
    price: 48500,
    description: 'Interruptor automático Schneider Electric para protección de circuitos DC.'
  },
  {
    id: 3,
    name: 'Relé Térmico Siemens 3RU1126-4DB0',
    sku: 'RLT-SIE-3RU1126',
    category: 'Relés',
    image: 'https://assets.new.siemens.com/siemens/assets/api/uuid:743bc897040fa975e4d014d4ebae15416ef25c01/width:1125/crop:0,0165:0,3965:1/quality:high/3ru11-26-4db0-relai-thermique-cl10-17-6-22a-pour-contacteur-3rt1-o-3rt2-montage-direct.jpg',
    stock: 5,
    price: 28900,
    description: 'Relé térmico Siemens para protección de motores contra sobrecargas.'
  },
  {
    id: 4,
    name: 'Transformador de Control Legrand 250VA',
    sku: 'TRF-LEG-250VA',
    category: 'Transformadores',
    image: 'https://multimedia.legrand.com/multimedia/content/cr-photo/b-/legrand/productselector/products/42225-s.jpg',
    stock: 8,
    price: 85000,
    description: 'Transformador de control Legrand 250VA para aplicaciones industriales y residenciales.'
  },
  {
    id: 5,
    name: 'Cable Multiconductor LSHF 4x2.5mm2',
    sku: 'CBL-LSHF-4X25',
    category: 'Cables',
    image: 'https://www.cobrex.cl/wp-content/uploads/2018/05/cables-electricos-multiconductores-1.jpg',
    stock: 450,
    price: 1250,
    description: 'Cable multiconductor LSHF (Low Smoke Halogen Free) 4x2.5mm2, precio por metro.'
  },
]);

// Productos filtrados según la búsqueda
const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value;
  
  const searchTerm = productSearch.value.toLowerCase();
  return products.value.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.sku.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
});

// Estado del diálogo de producto
const productDialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  id: null,
  name: '',
  sku: '',
  category: '',
  image: '',
  stock: 0,
  price: 0,
  description: ''
});
const defaultItem = {
  id: null,
  name: '',
  sku: '',
  category: '',
  image: '',
  stock: 0,
  price: 0,
  description: ''
};

// Estado del diálogo de eliminación
const deleteDialog = ref(false);
const deleteItem = ref({});

// Métodos
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

const getStockColor = (stock) => {
  if (stock <= 5) return 'error';
  if (stock <= 15) return 'warning';
  return 'success';
};

const openNewProductDialog = () => {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
  productDialog.value = true;
};

const editProduct = (item) => {
  editedIndex.value = products.value.findIndex(p => p.id === item.id);
  editedItem.value = { ...item };
  productDialog.value = true;
};

const closeProductDialog = () => {
  productDialog.value = false;
  // Esperar a que la animación del diálogo termine
  setTimeout(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  }, 300);
};

const saveProduct = () => {
  // Validación básica
  if (!editedItem.value.name || !editedItem.value.sku || !editedItem.value.category) {
    alert('Por favor complete los campos requeridos');
    return;
  }

  if (editedIndex.value > -1) {
    // Actualizar producto existente
    Object.assign(products.value[editedIndex.value], editedItem.value);
  } else {
    // Crear nuevo producto
    const newId = Math.max(0, ...products.value.map(p => p.id)) + 1;
    products.value.push({
      ...editedItem.value,
      id: newId
    });
  }
  
  closeProductDialog();
};

const confirmDeleteProduct = (item) => {
  deleteItem.value = item;
  deleteDialog.value = true;
};

const deleteProduct = () => {
  const index = products.value.findIndex(p => p.id === deleteItem.value.id);
  products.value.splice(index, 1);
  deleteDialog.value = false;
};
</script>

<style scoped>
.max-width-search {
  max-width: 300px;
}
</style>