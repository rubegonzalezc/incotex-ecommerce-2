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
            <v-btn icon="fa-solid fa-eye" variant="text" color="info" size="small" @click="viewQuote(item)" 
                  :disabled="item.status === 'Borrador'" title="Ver detalles"></v-btn>
            <v-btn icon="fa-solid fa-pencil" variant="text" color="warning" size="small" @click="editQuote(item)" 
                  :disabled="['Enviada', 'Aceptada', 'Rechazada'].includes(item.status)" title="Editar cotización"></v-btn>
            <v-btn icon="fa-solid fa-paper-plane" variant="text" color="success" size="small" @click="sendQuote(item)"
                  :disabled="item.status !== 'Pendiente de envío'" title="Enviar cotización"></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para ver detalles de cotización -->
    <v-dialog v-model="quoteDialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white d-flex align-center">
          <span>Detalles de Cotización #{{ selectedQuote.id }}</span>
          <v-chip
            :color="getStatusColor(selectedQuote.status)"
            size="small"
            class="ml-2"
          >
            {{ selectedQuote.status }}
          </v-chip>
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
              <p><strong>Fecha solicitud:</strong> {{ formatDate(selectedQuote.date) }}</p>
              <p v-if="selectedQuote.sendDate"><strong>Fecha envío:</strong> {{ formatDate(selectedQuote.sendDate) }}</p>
              <p v-if="selectedQuote.validUntil"><strong>Válida hasta:</strong> {{ formatDate(selectedQuote.validUntil) }}</p>
              <p><strong>Nota del cliente:</strong> {{ selectedQuote.customerNote || 'Sin notas' }}</p>
              <p v-if="selectedQuote.adminNote"><strong>Nota interna:</strong> {{ selectedQuote.adminNote }}</p>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <h3 class="text-subtitle-1 font-weight-bold mb-2">Productos Cotizados</h3>
          <v-table>
            <thead>
              <tr>
                <th>Producto</th>
                <th class="text-center">Cantidad</th>
                <th class="text-end" v-if="quoteHasPrices">Precio Unitario</th>
                <th class="text-end" v-if="quoteHasPrices">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selectedQuote.items" :key="index">
                <td>{{ item.product }}</td>
                <td class="text-center">{{ item.quantity }}</td>
                <td class="text-end" v-if="quoteHasPrices">{{ formatCurrency(item.price) }}</td>
                <td class="text-end" v-if="quoteHasPrices">{{ formatCurrency(item.quantity * item.price) }}</td>
              </tr>
            </tbody>
            <tfoot v-if="quoteHasPrices">
              <tr>
                <td colspan="3" class="text-end font-weight-bold">Subtotal:</td>
                <td class="text-end font-weight-bold">{{ formatCurrency(calculateSubtotal) }}</td>
              </tr>
              <tr v-if="selectedQuote.discount">
                <td colspan="3" class="text-end font-weight-bold">Descuento ({{ selectedQuote.discountPercent }}%):</td>
                <td class="text-end font-weight-bold text-error">-{{ formatCurrency(selectedQuote.discount) }}</td>
              </tr>
              <tr v-if="selectedQuote.tax">
                <td colspan="3" class="text-end font-weight-bold">IVA (19%):</td>
                <td class="text-end font-weight-bold">{{ formatCurrency(selectedQuote.tax) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-end font-weight-bold">Total:</td>
                <td class="text-end font-weight-bold">{{ formatCurrency(selectedQuote.total) }}</td>
              </tr>
            </tfoot>
          </v-table>

          <div v-if="!quoteHasPrices" class="text-center py-4 my-4 bg-grey-lighten-4 rounded">
            <v-icon icon="fa-solid fa-info-circle" color="info" class="mb-2"></v-icon>
            <p class="text-body-1">Esta cotización aún no tiene precios asignados. <br>Puede asignar precios haciendo clic en el botón "Editar cotización".</p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" variant="text" prepend-icon="fa-solid fa-file-pdf" 
                :disabled="!quoteHasPrices || selectedQuote.status === 'Borrador'">
            Exportar PDF
          </v-btn>
          <v-btn color="info" variant="text" prepend-icon="fa-solid fa-envelope"
                :disabled="!quoteHasPrices || selectedQuote.status === 'Borrador'">
            Enviar Email
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="warning" 
            variant="elevated" 
            @click="editQuote(selectedQuote)"
            v-if="['Borrador', 'Pendiente de envío'].includes(selectedQuote.status)"
          >
            Editar Cotización
          </v-btn>
          <v-btn 
            color="success" 
            variant="elevated" 
            @click="sendQuote(selectedQuote)"
            v-if="selectedQuote.status === 'Pendiente de envío'"
          >
            Enviar al Cliente
          </v-btn>
          <v-btn color="secondary" variant="text" @click="quoteDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para editar cotización -->
    <v-dialog v-model="editDialog" max-width="900px" persistent>
      <v-card>
        <v-card-title class="text-h5 bg-warning-darken-1 text-white">
          Editar Cotización #{{ editQuoteData.id }}
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="editForm" v-model="formValid">
            <v-tabs v-model="activeTab">
              <v-tab value="productos">Productos</v-tab>
              <v-tab value="detalles">Detalles</v-tab>
            </v-tabs>

            <v-window v-model="activeTab" class="mt-4">
              <!-- Pestaña de productos -->
              <v-window-item value="productos">
                <v-alert type="info" variant="tonal" density="compact" class="mb-4">
                  Asigne precios a los productos solicitados. Puede ajustar las cantidades si es necesario.
                </v-alert>

                <v-table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th style="width: 120px;">Cantidad</th>
                      <th style="width: 180px;">Precio Unitario</th>
                      <th style="width: 140px;">Subtotal</th>
                      <th style="width: 50px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in editQuoteData.items" :key="index">
                      <td>{{ item.product }}</td>
                      <td>
                        <v-text-field
                          v-model.number="item.quantity"
                          type="number"
                          min="1"
                          hide-details
                          density="compact"
                          variant="outlined"
                          class="my-1"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model.number="item.price"
                          type="number"
                          min="0"
                          hide-details
                          density="compact"
                          variant="outlined"
                          class="my-1"
                          prefix="$"
                        ></v-text-field>
                      </td>
                      <td class="text-end">
                        {{ formatCurrency(item.quantity * item.price) }}
                      </td>
                      <td>
                        <v-btn icon="fa-solid fa-trash" variant="text" color="error" size="small" 
                              @click="removeItem(index)" title="Eliminar producto"></v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <v-btn color="primary" variant="text" class="mt-4" prepend-icon="fa-solid fa-plus" @click="addNewItem">
                  Agregar Producto
                </v-btn>

                <v-divider class="my-4"></v-divider>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editQuoteData.discountPercent"
                      label="Descuento (%)"
                      type="number"
                      min="0"
                      max="100"
                      hint="Descuento aplicado al total"
                      persistent-hint
                      @input="calculatePrices"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-checkbox
                      v-model="editQuoteData.includeTax"
                      label="Incluir IVA (19%)"
                      @change="calculatePrices"
                    ></v-checkbox>
                  </v-col>
                </v-row>

                <v-card class="mt-4 pa-4 bg-grey-lighten-4">
                  <v-row>
                    <v-col cols="12" md="8">
                      <h3 class="text-subtitle-1 font-weight-bold">Resumen</h3>
                      <div class="d-flex justify-space-between mt-2">
                        <span>Subtotal:</span>
                        <span>{{ formatCurrency(calculateEditSubtotal) }}</span>
                      </div>
                      <div v-if="editQuoteData.discount" class="d-flex justify-space-between mt-1">
                        <span>Descuento ({{ editQuoteData.discountPercent }}%):</span>
                        <span class="text-error">-{{ formatCurrency(editQuoteData.discount) }}</span>
                      </div>
                      <div v-if="editQuoteData.tax" class="d-flex justify-space-between mt-1">
                        <span>IVA (19%):</span>
                        <span>{{ formatCurrency(editQuoteData.tax) }}</span>
                      </div>
                      <div class="d-flex justify-space-between mt-1 font-weight-bold">
                        <span>Total:</span>
                        <span>{{ formatCurrency(editQuoteData.total) }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-window-item>

              <!-- Pestaña de detalles -->
              <v-window-item value="detalles">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editQuoteData.validDays"
                      label="Validez de la cotización (días)"
                      type="number"
                      min="1"
                      max="90"
                      hint="Días de validez a partir de la fecha de envío"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editQuoteData.adminNote"
                      label="Nota interna (solo visible para administradores)"
                      auto-grow
                      rows="3"
                      variant="outlined"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editQuoteData.clientMessage"
                      label="Mensaje para el cliente"
                      auto-grow
                      rows="4"
                      variant="outlined"
                      hint="Este mensaje se incluirá en el email y el PDF de la cotización"
                      persistent-hint
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-alert type="info" variant="tonal" density="compact" class="mt-4">
                  <p class="mb-0">
                    <strong>Nota:</strong> Puede guardar esta cotización como borrador o marcarla como lista para enviar. 
                    Una vez enviada al cliente, no podrá editarla.
                  </p>
                </v-alert>
              </v-window-item>
            </v-window>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" variant="text" @click="cancelEdit">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="outlined" @click="saveAsDraft">
            Guardar como Borrador
          </v-btn>
          <v-btn color="success" variant="elevated" :disabled="!formValid || !allItemsHavePrices" @click="finalizeQuote">
            Finalizar Cotización
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de envío de cotización -->
    <v-dialog v-model="sendDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 bg-success text-white">
          Enviar Cotización #{{ selectedQuote.id }}
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-alert type="warning" variant="tonal" class="mb-4">
            Una vez enviada, la cotización no podrá ser modificada. El cliente recibirá una notificación por email.
          </v-alert>

          <v-text-field
            v-model="sendData.email"
            label="Email del cliente"
            prepend-inner-icon="fa-solid fa-envelope"
            variant="outlined"
            :rules="emailRules"
          ></v-text-field>

          <v-text-field
            v-model="sendData.subject"
            label="Asunto del email"
            prepend-inner-icon="fa-solid fa-heading"
            variant="outlined"
          ></v-text-field>

          <v-textarea
            v-model="sendData.message"
            label="Mensaje"
            auto-grow
            rows="5"
            variant="outlined"
          ></v-textarea>

          <v-checkbox
            v-model="sendData.attachPdf"
            label="Adjuntar PDF de la cotización"
          ></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" variant="text" @click="sendDialog = false">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" variant="elevated" :loading="sending" @click="confirmSendQuote">
            Enviar Cotización
          </v-btn>
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

    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import AdminLayout from '@/components/admin/AdminLayout.vue';

// Datos para la tabla de cotizaciones
const quoteSearch = ref('');
const quoteHeaders = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Cliente', key: 'customer.name', align: 'start' },
  { title: 'Fecha', key: 'date', align: 'start' },
  { title: 'Estado', key: 'status', align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
];

// Estados de cotización
const statusOptions = ['Borrador', 'Pendiente de envío', 'Enviada', 'Aceptada', 'Rechazada', 'Expirada'];

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
    sendDate: null,
    validUntil: null,
    status: 'Borrador',
    customerNote: 'Necesito cotización para proyecto de remodelación',
    adminNote: '',
    clientMessage: '',
    items: [
      { product: 'Contactor Tripolar ABB AX09-30-10-80', quantity: 3, price: null },
      { product: 'Relé Térmico Siemens 3RU1126-4DB0', quantity: 2, price: null },
      { product: 'Cable Multiconductor LSHF 4x2.5mm2', quantity: 50, price: null }
    ],
    discountPercent: 0,
    discount: 0,
    includeTax: true,
    tax: 0,
    total: 0,
    validDays: 15
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
    sendDate: new Date(new Date().setHours(new Date().getHours() - 7)),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 15)),
    status: 'Enviada',
    customerNote: '',
    adminNote: 'Cliente preferencial, aplicar descuento',
    clientMessage: 'Estimada María, adjuntamos la cotización solicitada para su proyecto. No dude en contactarnos ante cualquier consulta.',
    items: [
      { product: 'Interruptor Automático Schneider C60H-DC', quantity: 5, price: 48500 },
      { product: 'Transformador de Control Legrand 250VA', quantity: 1, price: 85000 },
      { product: 'Cable Multiconductor LSHF 4x2.5mm2', quantity: 30, price: 1250 }
    ],
    discountPercent: 5,
    discount: 19025,
    includeTax: true,
    tax: 68529,
    total: 380500,
    validDays: 15
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
    sendDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 14)),
    status: 'Rechazada',
    customerNote: 'Cotización urgente para obra en Las Condes',
    adminNote: 'Cliente rechazó por precios elevados',
    clientMessage: 'Estimado Carlos, le enviamos la cotización para el material solicitado. Quedamos atentos a sus comentarios.',
    items: [
      { product: 'Contactor Tripolar ABB AX09-30-10-80', quantity: 3, price: 75000 }
    ],
    discountPercent: 0,
    discount: 0,
    includeTax: true,
    tax: 42750,
    total: 225000,
    validDays: 15
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
    sendDate: null,
    validUntil: null,
    status: 'Pendiente de envío',
    customerNote: '',
    adminNote: 'Verificar disponibilidad de relés antes de enviar',
    clientMessage: 'Estimada Ana, le enviamos la cotización solicitada. Los materiales están disponibles para entrega inmediata.',
    items: [
      { product: 'Relé Térmico Siemens 3RU1126-4DB0', quantity: 5, price: 28900 },
      { product: 'Cable Multiconductor LSHF 4x2.5mm2', quantity: 25, price: 1250 }
    ],
    discountPercent: 0,
    discount: 0,
    includeTax: true,
    tax: 29260,
    total: 183600,
    validDays: 15
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
    sendDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: 'Aceptada',
    customerNote: 'Necesitamos estos materiales para mantención preventiva',
    adminNote: 'Cliente aceptó el mismo día, coordinar despacho urgente',
    clientMessage: 'Estimado Pedro, adjuntamos cotización para los materiales solicitados. Tenemos todo en stock para entrega inmediata.',
    items: [
      { product: 'Interruptor Automático Schneider C60H-DC', quantity: 4, price: 48500 },
      { product: 'Transformador de Control Legrand 250VA', quantity: 3, price: 85000 },
      { product: 'Contactor Tripolar ABB AX09-30-10-80', quantity: 1, price: 75000 }
    ],
    discountPercent: 0,
    discount: 0,
    includeTax: true,
    tax: 98800,
    total: 520000,
    validDays: 15
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
      quote.customer.company.toLowerCase().includes(searchTerm) ||
      quote.customer.email.toLowerCase().includes(searchTerm)
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
  sendDate: null,
  validUntil: null,
  status: '',
  customerNote: '',
  adminNote: '',
  clientMessage: '',
  items: [],
  discountPercent: 0,
  discount: 0,
  includeTax: true,
  tax: 0,
  total: 0,
  validDays: 15
});

// Verificar si la cotización tiene precios asignados
const quoteHasPrices = computed(() => {
  if (!selectedQuote.value.items.length) return false;
  return selectedQuote.value.items.every(item => item.price !== null && item.price !== undefined);
});

// Calcular subtotal
const calculateSubtotal = computed(() => {
  if (!selectedQuote.value.items.length) return 0;
  return selectedQuote.value.items.reduce((total, item) => {
    return total + (item.quantity * (item.price || 0));
  }, 0);
});

// Estado del diálogo de edición
const editDialog = ref(false);
const formValid = ref(true);
const activeTab = ref("productos");
const editQuoteData = ref({
  id: 0,
  items: [],
  discountPercent: 0,
  discount: 0,
  includeTax: true,
  tax: 0,
  total: 0,
  validDays: 15,
  adminNote: '',
  clientMessage: ''
});

// Calcular subtotal en modo edición
const calculateEditSubtotal = computed(() => {
  if (!editQuoteData.value.items.length) return 0;
  return editQuoteData.value.items.reduce((total, item) => {
    return total + (item.quantity * (item.price || 0));
  }, 0);
});

// Verificar si todos los items tienen precios asignados
const allItemsHavePrices = computed(() => {
  if (!editQuoteData.value.items.length) return false;
  return editQuoteData.value.items.every(item => 
    item.price !== null && 
    item.price !== undefined && 
    item.price > 0
  );
});

// Estado del diálogo de envío
const sendDialog = ref(false);
const sending = ref(false);
const sendData = ref({
  email: '',
  subject: '',
  message: '',
  attachPdf: true
});

// Reglas de validación
const emailRules = [
  v => !!v || 'El email es requerido',
  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'El email no es válido'
];

// Snackbar para notificaciones
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000
});

// Mostrar notificación
const showNotification = (text, color = 'success', timeout = 3000) => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.timeout = timeout;
  snackbar.show = true;
};

// Métodos de formato
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

const formatDate = (date) => {
  if (!date) return '';
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
    case 'Borrador': return 'grey';
    case 'Pendiente de envío': return 'info';
    case 'Enviada': return 'primary';
    case 'Aceptada': return 'success';
    case 'Rechazada': return 'error';
    case 'Expirada': return 'grey-darken-1';
    default: return 'primary';
  }
};

// Ver detalles de cotización
const viewQuote = (quote) => {
  selectedQuote.value = { ...JSON.parse(JSON.stringify(quote)) };
  quoteDialog.value = true;
};

// Editar cotización
const editQuote = (quote) => {
  // Cerrar diálogo de vista si está abierto
  quoteDialog.value = false;
  
  // Clonar los datos para edición
  editQuoteData.value = JSON.parse(JSON.stringify(quote));
  
  // Abrir diálogo de edición
  editDialog.value = true;
};

// Calcular precios (descuentos, impuestos, total)
const calculatePrices = () => {
  const subtotal = editQuoteData.value.items.reduce((total, item) => {
    return total + (item.quantity * (item.price || 0));
  }, 0);
  
  // Calcular descuento
  if (editQuoteData.value.discountPercent > 0) {
    editQuoteData.value.discount = subtotal * (editQuoteData.value.discountPercent / 100);
  } else {
    editQuoteData.value.discount = 0;
  }
  
  const afterDiscount = subtotal - editQuoteData.value.discount;
  
  // Calcular impuestos si aplica
  if (editQuoteData.value.includeTax) {
    editQuoteData.value.tax = afterDiscount * 0.19; // 19% IVA en Chile
  } else {
    editQuoteData.value.tax = 0;
  }
  
  // Calcular total
  editQuoteData.value.total = afterDiscount + editQuoteData.value.tax;
};

// Agregar nuevo item a la cotización
const addNewItem = () => {
  editQuoteData.value.items.push({
    product: '',
    quantity: 1,
    price: 0
  });
};

// Eliminar item de la cotización
const removeItem = (index) => {
  editQuoteData.value.items.splice(index, 1);
  calculatePrices();
};

// Cancelar edición
const cancelEdit = () => {
  if (confirm('¿Está seguro de cancelar? Los cambios no guardados se perderán.')) {
    editDialog.value = false;
  }
};

// Guardar como borrador
const saveAsDraft = () => {
  // Calcular precios antes de guardar
  calculatePrices();
  
  // Buscar la cotización original
  const index = quotes.value.findIndex(q => q.id === editQuoteData.value.id);
  
  if (index !== -1) {
    // Actualizar la cotización
    const updatedQuote = { ...editQuoteData.value, status: 'Borrador' };
    quotes.value[index] = updatedQuote;
    
    // Mostrar notificación
    showNotification('Cotización guardada como borrador');
    
    // Cerrar diálogo
    editDialog.value = false;
  }
};

// Finalizar cotización (marcarla como lista para enviar)
const finalizeQuote = () => {
  // Calcular precios antes de finalizar
  calculatePrices();
  
  // Buscar la cotización original
  const index = quotes.value.findIndex(q => q.id === editQuoteData.value.id);
  
  if (index !== -1) {
    // Actualizar la cotización
    const updatedQuote = { ...editQuoteData.value, status: 'Pendiente de envío' };
    quotes.value[index] = updatedQuote;
    
    // Mostrar notificación
    showNotification('Cotización lista para enviar al cliente');
    
    // Cerrar diálogo
    editDialog.value = false;
  }
};

// Preparar envío de cotización
const sendQuote = (quote) => {
  // Cerrar otros diálogos
  quoteDialog.value = false;
  
  // Establecer datos preseleccionados
  selectedQuote.value = { ...quote };
  sendData.value = {
    email: quote.customer.email,
    subject: `Cotización #${quote.id} - Incotex HV`,
    message: quote.clientMessage || `Estimado/a ${quote.customer.name},\n\nAdjuntamos la cotización solicitada. Quedamos atentos a sus comentarios.\n\nSaludos cordiales,\nEquipo Incotex`,
    attachPdf: true
  };
  
  // Abrir diálogo de envío
  sendDialog.value = true;
};

// Enviar cotización
const confirmSendQuote = async () => {
  sending.value = true;
  
  try {
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Buscar la cotización original
    const index = quotes.value.findIndex(q => q.id === selectedQuote.value.id);
    
    if (index !== -1) {
      // Actualizar la cotización
      const now = new Date();
      const validUntil = new Date();
      validUntil.setDate(now.getDate() + selectedQuote.value.validDays);
      
      quotes.value[index] = {
        ...quotes.value[index],
        status: 'Enviada',
        sendDate: now,
        validUntil: validUntil
      };
      
      // Mostrar notificación
      showNotification('Cotización enviada exitosamente al cliente');
      
      // Cerrar diálogo
      sendDialog.value = false;
    }
  } catch (error) {
    showNotification('Error al enviar la cotización. Intente nuevamente.', 'error');
  } finally {
    sending.value = false;
  }
};

// Limpiar filtros
const clearFilters = () => {
  filters.value = {
    status: [],
    dateFrom: '',
    dateTo: ''
  };
};

// Aplicar filtros
const applyFilters = () => {
  filterDialog.value = false;
};
</script>

<style scoped>
.max-width-search {
  max-width: 300px;
}
</style>