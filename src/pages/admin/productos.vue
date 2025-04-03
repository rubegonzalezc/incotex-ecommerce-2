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
        
        <template v-slot:item.priceRange="{ item }">
          <span v-if="item.priceMin && item.priceMax">
            {{ formatCurrency(item.priceMin) }} - {{ formatCurrency(item.priceMax) }}
          </span>
          <span v-else-if="item.priceMin">
            Desde {{ formatCurrency(item.priceMin) }}
          </span>
          <span v-else>
            <v-chip color="grey-lighten-1" size="x-small" variant="flat">Cotizar</v-chip>
          </span>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-btn icon="fa-solid fa-eye" variant="text" color="info" size="small" @click="viewProduct(item)" title="Ver detalles"></v-btn>
            <v-btn icon="fa-solid fa-edit" variant="text" color="primary" size="small" @click="editProduct(item)" title="Editar producto"></v-btn>
            <v-btn icon="fa-solid fa-trash" variant="text" color="error" size="small" @click="confirmDeleteProduct(item)" title="Eliminar producto"></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para nuevo producto -->
    <v-dialog v-model="productDialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white">
          {{ editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto' }}
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="productForm" v-model="formValid">
              <v-tabs v-model="activeTab">
                <v-tab value="general">Información General</v-tab>
                <v-tab value="pricing">Cotización</v-tab>
                <v-tab value="specs">Especificaciones</v-tab>
              </v-tabs>
              
              <v-window v-model="activeTab" class="mt-4">
                <!-- Pestaña de información general -->
                <v-window-item value="general">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nombre del producto"
                        :rules="[v => !!v || 'Nombre requerido']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.sku"
                        label="SKU / Código"
                        :rules="[v => !!v || 'SKU requerido']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="editedItem.category"
                        :items="categories"
                        label="Categoría"
                        :rules="[v => !!v || 'Categoría requerida']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="editedItem.brand"
                        :items="brands"
                        label="Marca"
                        :rules="[v => !!v || 'Marca requerida']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model.number="editedItem.stock"
                        label="Stock"
                        type="number"
                        min="0"
                        :rules="[v => v >= 0 || 'El stock no puede ser negativo']"
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
                        counter
                        :rules="[v => !!v || 'Descripción requerida']"
                        required
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-window-item>
                
                <!-- Pestaña de precios y cotización -->
                <v-window-item value="pricing">
                  <v-alert type="info" variant="tonal" density="compact" class="mb-4">
                    <p>Configure la información relevante para la cotización de este producto. Puede establecer rangos de precios referenciales o dejar en blanco para cotizar según cliente.</p>
                  </v-alert>
                  
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model.number="editedItem.priceMin"
                        label="Precio mínimo referencial"
                        type="number"
                        min="0"
                        prefix="$"
                        hint="Precio mínimo para cotizar este producto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model.number="editedItem.priceMax"
                        label="Precio máximo referencial"
                        type="number"
                        min="0"
                        prefix="$"
                        hint="Precio máximo para cotizar este producto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="editedItem.priceTier"
                        :items="priceTiers"
                        label="Nivel de precio"
                        hint="Categoría de precio para este producto"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model.number="editedItem.cost"
                        label="Costo (interno)"
                        type="number"
                        min="0"
                        prefix="$"
                        hint="Costo interno del producto (solo visible para administradores)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.pricingNotes"
                        label="Notas de cotización (internas)"
                        rows="2"
                        hint="Información interna para ayudar a cotizar este producto"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="editedItem.requiresCustomQuote"
                        label="Requiere cotización personalizada"
                        hint="Marcar si el producto siempre debe cotizarse individualmente"
                        persistent-hint
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-window-item>
                
                <!-- Pestaña de especificaciones técnicas -->
                <v-window-item value="specs">
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.technicalSpecs"
                        label="Especificaciones técnicas"
                        rows="4"
                        hint="Incluya especificaciones técnicas detalladas del producto"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.weight"
                        label="Peso (kg)"
                        type="number"
                        min="0"
                        step="0.01"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.dimensions"
                        label="Dimensiones"
                        hint="Formato: LxAxA (cm)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-file-input
                        label="Ficha técnica (PDF)"
                        accept="application/pdf"
                        prepend-icon="fa-solid fa-file-pdf"
                        show-size
                        truncate-length="25"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="editedItem.featured"
                        label="Producto destacado"
                        hint="Marcar para mostrar en secciones destacadas"
                        persistent-hint
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeProductDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveProduct" :disabled="!formValid">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para ver detalles del producto -->
    <v-dialog v-model="viewDialog" max-width="700px">
      <v-card>
        <v-card-title class="text-h5 bg-info text-white d-flex align-center">
          <span>Detalles del Producto</span>
          <v-spacer></v-spacer>
          <v-btn icon="fa-solid fa-edit" color="white" variant="text" size="small" 
                @click="editFromView()" title="Editar este producto"></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="4" class="text-center">
              <v-img
                :src="viewItem.image || 'https://via.placeholder.com/300x300?text=No+Image'"
                :alt="viewItem.name"
                max-height="200"
                contain
                class="mx-auto mb-4 rounded"
              ></v-img>
              <v-chip
                :color="getStockColor(viewItem.stock)"
                variant="outlined"
                class="mb-2"
              >
                Stock: {{ viewItem.stock }} unidades
              </v-chip>
            </v-col>
            
            <v-col cols="12" md="8">
              <h3 class="text-h5 mb-2">{{ viewItem.name }}</h3>
              <p class="text-subtitle-1 text-grey">SKU: {{ viewItem.sku }}</p>
              
              <v-divider class="my-3"></v-divider>
              
              <div class="d-flex mb-2">
                <strong class="me-2">Categoría:</strong> {{ viewItem.category }}
              </div>
              <div class="d-flex mb-2">
                <strong class="me-2">Marca:</strong> {{ viewItem.brand }}
              </div>
              
              <v-divider class="my-3"></v-divider>
              
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Información de cotización</h4>
              <div class="d-flex mb-2" v-if="viewItem.priceMin || viewItem.priceMax">
                <strong class="me-2">Rango de precio:</strong> 
                <span v-if="viewItem.priceMin && viewItem.priceMax">
                  {{ formatCurrency(viewItem.priceMin) }} - {{ formatCurrency(viewItem.priceMax) }}
                </span>
                <span v-else-if="viewItem.priceMin">
                  Desde {{ formatCurrency(viewItem.priceMin) }}
                </span>
              </div>
              <div class="d-flex mb-2" v-if="viewItem.cost">
                <strong class="me-2">Costo interno:</strong> {{ formatCurrency(viewItem.cost) }}
              </div>
              <div class="d-flex mb-2" v-if="viewItem.priceTier">
                <strong class="me-2">Nivel de precio:</strong> {{ viewItem.priceTier }}
              </div>
              <div class="d-flex mb-2" v-if="viewItem.requiresCustomQuote">
                <strong>Requiere cotización personalizada</strong>
              </div>
              
              <v-divider class="my-3"></v-divider>
              
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Descripción</h4>
              <p class="text-body-1">{{ viewItem.description }}</p>
              
              <div v-if="viewItem.technicalSpecs">
                <h4 class="text-subtitle-1 font-weight-bold mt-3 mb-2">Especificaciones técnicas</h4>
                <p class="text-body-1">{{ viewItem.technicalSpecs }}</p>
              </div>
              
              <div class="d-flex flex-wrap gap-2 mt-3" v-if="viewItem.weight || viewItem.dimensions">
                <v-chip v-if="viewItem.weight" size="small" color="grey-lighten-1">
                  <v-icon size="small" start>fa-solid fa-weight-hanging</v-icon>
                  {{ viewItem.weight }} kg
                </v-chip>
                <v-chip v-if="viewItem.dimensions" size="small" color="grey-lighten-1">
                  <v-icon size="small" start>fa-solid fa-ruler-combined</v-icon>
                  {{ viewItem.dimensions }}
                </v-chip>
              </div>
              
              <div v-if="viewItem.pricingNotes" class="mt-4 pa-3 bg-grey-lighten-4 rounded">
                <p class="text-caption mb-0"><strong>Notas internas:</strong> {{ viewItem.pricingNotes }}</p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="viewDialog = false">Cerrar</v-btn>
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
  { title: 'Rango de precio', key: 'priceRange', align: 'end' },
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

// Lista de marcas
const brands = [
  'ABB',
  'Schneider Electric',
  'Siemens',
  'Legrand',
  'General Electric',
  'Bticino',
  'Philips',
  'Osram',
  'Chint',
  'Eaton'
];

// Niveles de precio
const priceTiers = [
  'Económico',
  'Estándar',
  'Premium',
  'Industrial',
  'Especializado'
];

// Datos de productos
const products = ref([
  {
    id: 1,
    name: 'Contactor Tripolar ABB AX09-30-10-80',
    sku: 'CTR-ABB-093010',
    category: 'Contactores',
    brand: 'ABB',
    image: 'https://www.electromaterial.cl/wp-content/uploads/2021/01/AX09-30-10-80-300x300.jpg',
    stock: 35,
    priceMin: 65000,
    priceMax: 85000,
    cost: 45000,
    priceTier: 'Industrial',
    description: 'Contactor tripolar ABB 9A 220V 50/60Hz. Ideal para aplicaciones industriales.',
    technicalSpecs: 'Corriente nominal: 9A\nVoltaje de bobina: 220V AC\nFrecuencia: 50/60Hz\nContactos auxiliares: 1NO+1NC\nMontaje en riel DIN',
    weight: 0.5,
    dimensions: '45x75x90',
    pricingNotes: 'Aplicar descuentos para proyectos grandes. Verificar disponibilidad antes de cotizar.',
    requiresCustomQuote: false,
    featured: true
  },
  {
    id: 2,
    name: 'Interruptor Automático Schneider C60H-DC',
    sku: 'INT-SCH-C60HDC',
    category: 'Interruptores',
    brand: 'Schneider Electric',
    image: 'https://www.se.com/cl/es/product/%7B%7Bitem.productUrlPath%7D%7D/image/C60H-DC.JPG',
    stock: 12,
    priceMin: 38000,
    priceMax: 55000,
    cost: 32000,
    priceTier: 'Estándar',
    description: 'Interruptor automático Schneider Electric para protección de circuitos DC.',
    technicalSpecs: 'Corriente nominal: 10A\nCurva tipo C\nCapacidad de ruptura: 10kA\nNúmero de polos: 2\nTensión nominal: 500V DC',
    weight: 0.3,
    dimensions: '36x80x70',
    pricingNotes: 'Stock limitado, verificar disponibilidad',
    requiresCustomQuote: false,
    featured: false
  },
  {
    id: 3,
    name: 'Relé Térmico Siemens 3RU1126-4DB0',
    sku: 'RLT-SIE-3RU1126',
    category: 'Relés',
    brand: 'Siemens',
    image: 'https://assets.new.siemens.com/siemens/assets/api/uuid:743bc897040fa975e4d014d4ebae15416ef25c01/width:1125/crop:0,0165:0,3965:1/quality:high/3ru11-26-4db0-relai-thermique-cl10-17-6-22a-pour-contacteur-3rt1-o-3rt2-montage-direct.jpg',
    stock: 5,
    priceMin: 25000,
    priceMax: 35000,
    cost: 18000,
    priceTier: 'Industrial',
    description: 'Relé térmico Siemens para protección de motores contra sobrecargas.',
    technicalSpecs: 'Rango de ajuste: 17.6-22A\nClase de disparo: Clase 10\nComplemento para contactor: 3RT1 o 3RT2\nContactos auxiliares: 1NO+1NC',
    weight: 0.25,
    dimensions: '45x82x70',
    pricingNotes: 'Stock crítico, revisar inventario. Para precios especiales, consultar con gerencia.',
    requiresCustomQuote: false,
    featured: false
  },
  {
    id: 4,
    name: 'Transformador de Control Legrand 250VA',
    sku: 'TRF-LEG-250VA',
    category: 'Transformadores',
    brand: 'Legrand',
    image: 'https://multimedia.legrand.com/multimedia/content/cr-photo/b-/legrand/productselector/products/42225-s.jpg',
    stock: 8,
    priceMin: 75000,
    priceMax: 95000,
    cost: 60000,
    priceTier: 'Premium',
    description: 'Transformador de control Legrand 250VA para aplicaciones industriales y residenciales.',
    technicalSpecs: 'Potencia: 250VA\nPrimario: 380-400-415V\nSecundario: 230-240V\nFrecuencia: 50-60Hz\nProtección térmica integrada',
    weight: 3.2,
    dimensions: '105x120x115',
    pricingNotes: 'Para pedidos superiores a 3 unidades consultar precios especiales',
    requiresCustomQuote: false,
    featured: true
  },
  {
    id: 5,
    name: 'Cable Multiconductor LSHF 4x2.5mm2',
    sku: 'CBL-LSHF-4X25',
    category: 'Cables',
    brand: 'General Electric',
    image: 'https://www.cobrex.cl/wp-content/uploads/2018/05/cables-electricos-multiconductores-1.jpg',
    stock: 450,
    priceMin: 1000,
    priceMax: 1500,
    cost: 720,
    priceTier: 'Estándar',
    description: 'Cable multiconductor LSHF (Low Smoke Halogen Free) 4x2.5mm2, precio por metro.',
    technicalSpecs: 'Sección: 4x2.5mm²\nTipo: LSHF\nAislación: Poliolefina\nCubierta exterior: Compuesto termoplástico\nTensión nominal: 0.6/1 kV\nTemperatura máxima: 90°C',
    weight: 0.15,
    dimensions: 'Diámetro 12mm',
    pricingNotes: 'Precio por metro. Para rollos completos (100m) aplicar descuento del 15%',
    requiresCustomQuote: false,
    featured: false
  },
  {
    id: 6,
    name: 'Sistema de Control Industrial Personalizado',
    sku: 'SIS-CTRL-CUSTOM',
    category: 'Conectores',
    brand: 'Siemens',
    image: 'https://new.siemens.com/global/en/products/automation/systems/industrial/plc/_jcr_content/root/responsivegrid/tabs/items/tab_912393233_copy_/tabPar/productcarouselteasers/productcarouselteaser/teaserbox/image.component.proportional.medium.jpg/1700570172404/simatic-s7-1500-cpu-1518f-4-pn-dp.jpg',
    stock: 0,
    priceMin: null,
    priceMax: null,
    cost: null,
    priceTier: 'Especializado',
    description: 'Sistema de control industrial personalizado según las necesidades específicas de cada cliente. Incluye diseño, programación y puesta en marcha.',
    technicalSpecs: 'A definir según requerimientos del cliente',
    weight: null,
    dimensions: null,
    pricingNotes: 'Requiere levantamiento técnico antes de cotizar. Contactar al departamento de ingeniería.',
    requiresCustomQuote: true,
    featured: true
  },
]);

// Productos filtrados según la búsqueda
const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value;
  
  const searchTerm = productSearch.value.toLowerCase();
  return products.value.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.sku.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm)
  );
});

// Estado de los diálogos
const productDialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const formValid = ref(true);
const activeTab = ref("general");

// Items en edición/visualización/eliminación
const editedIndex = ref(-1);
const editedItem = ref({
  id: null,
  name: '',
  sku: '',
  category: '',
  brand: '',
  image: '',
  stock: 0,
  priceMin: null,
  priceMax: null,
  cost: null,
  priceTier: '',
  description: '',
  technicalSpecs: '',
  weight: null,
  dimensions: '',
  pricingNotes: '',
  requiresCustomQuote: false,
  featured: false
});
const viewItem = ref({});
const deleteItem = ref({});

// Valores por defecto para nuevo producto
const defaultItem = {
  id: null,
  name: '',
  sku: '',
  category: '',
  brand: '',
  image: '',
  stock: 0,
  priceMin: null,
  priceMax: null,
  cost: null,
  priceTier: '',
  description: '',
  technicalSpecs: '',
  weight: null,
  dimensions: '',
  pricingNotes: '',
  requiresCustomQuote: false,
  featured: false
};

// Métodos
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

const getStockColor = (stock) => {
  if (stock <= 0) return 'error';
  if (stock <= 5) return 'error';
  if (stock <= 15) return 'warning';
  return 'success';
};

const openNewProductDialog = () => {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
  activeTab.value = "general";
  productDialog.value = true;
};

const editProduct = (item) => {
  editedIndex.value = products.value.findIndex(p => p.id === item.id);
  editedItem.value = JSON.parse(JSON.stringify(item));
  activeTab.value = "general";
  productDialog.value = true;
};

const viewProduct = (item) => {
  viewItem.value = JSON.parse(JSON.stringify(item));
  viewDialog.value = true;
};

const editFromView = () => {
  viewDialog.value = false;
  editProduct(viewItem.value);
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

.v-card-text {
  padding-top: 20px;
}

.gap-2 {
  gap: 8px;
}
</style>