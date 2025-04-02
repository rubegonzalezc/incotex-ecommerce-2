<template>
    <div>
      <AppHeader />
  
      <!-- Banner de mi cuenta -->
      <v-container fluid class="account-header py-8 mb-6">
        <v-container class="text-center">
          <h1 class="text-h3 font-weight-bold mb-2">Mi Cuenta</h1>
          <p class="text-subtitle-1">Administra tu información personal y revisa el estado de tus cotizaciones</p>
        </v-container>
      </v-container>
  
      <v-container class="account-container">
        <!-- Estado de carga -->
        <div v-if="loading" class="d-flex justify-center py-16">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>
  
        <div v-else>
          <v-row>
            <!-- Panel lateral con menú -->
            <v-col cols="12" md="3" order="2" order-md="1">
              <v-card class="mb-6">
                <!-- Información del usuario -->
                <v-list-item>
                  <template v-slot:prepend>
                    <v-avatar color="primary" class="text-white">
                      {{ userInitials }}
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ userProfile.firstName }} {{ userProfile.lastName }}</v-list-item-title>
                  <v-list-item-subtitle>{{ userProfile.email }}</v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                
                <!-- Menú de navegación -->
                <v-list density="compact" nav>
                  <v-list-item
                    v-for="(item, i) in menuItems"
                    :key="i"
                    @click="activeTab = item.value"
                    :active="activeTab === item.value"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    color="primary"
                    rounded="lg"
                  ></v-list-item>
                </v-list>
                <v-divider class="my-3"></v-divider>
<v-list-item @click="logout" color="error">
  <template v-slot:prepend>
    <v-icon icon="fa-solid fa-sign-out-alt" color="error"></v-icon>
  </template>
  <v-list-item-title>Cerrar sesión</v-list-item-title>
</v-list-item>
              </v-card>
  
              <!-- Panel de ayuda -->
              <v-card class="support-card pa-4">
                <div class="d-flex align-center mb-3">
                  <v-icon icon="fa-solid fa-headset" color="primary" size="large" class="mr-3"></v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">¿Necesitas ayuda?</div>
                    <div class="text-body-2">Estamos aquí para asistirte</div>
                  </div>
                </div>
                <div class="d-flex align-center mb-3">
                  <v-icon icon="fa-solid fa-phone" size="small" color="grey" class="mr-3"></v-icon>
                  <span>+56 9 1234 5678</span>
                </div>
                <div class="d-flex align-center mb-3">
                  <v-icon icon="fa-solid fa-envelope" size="small" color="grey" class="mr-3"></v-icon>
                  <span>soporte@incotexhv.cl</span>
                </div>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  prepend-icon="fa-solid fa-comment-dots"
                  variant="text"
                  color="primary"
                  block
                  @click="showContactForm = true"
                >
                  Contactar soporte
                </v-btn>
              </v-card>
            </v-col>
  
            <!-- Panel principal con contenido de pestañas -->
            <v-col cols="12" md="9" order="1" order-md="2">
              <!-- TAB: DASHBOARD -->
              <div v-if="activeTab === 'dashboard'">
                <v-row>
                  <!-- Tarjeta de bienvenida -->
                  <v-col cols="12">
                    <v-card class="mb-6 pa-4">
                      <div class="d-flex flex-column flex-sm-row">
                        <div class="welcome-text flex-grow-1">
                          <h2 class="text-h4 font-weight-medium mb-2">Bienvenido, {{ userProfile.firstName }}</h2>
                          <p class="mb-4">Desde aquí podrás gestionar tus cotizaciones y actualizar tu información personal.</p>
                          <div class="d-flex align-center mb-3">
                            <v-icon icon="fa-solid fa-clipboard-list" color="primary" class="mr-2"></v-icon>
                            <span>{{ quoteCounts.all }} cotizaciones realizadas</span>
                            <v-chip class="ml-3" color="primary" size="small" variant="flat">
                              {{ quoteCounts.pending }} pendientes
                            </v-chip>
                          </div>
                        </div>
                        <div class="welcome-image ml-sm-4 mt-4 mt-sm-0 d-flex justify-center">
                          <v-img
                            src="https://cdn-icons-png.flaticon.com/512/4646/4646510.png"
                            alt="Bienvenido"
                            max-width="150"
                            class="elevation-0"
                          ></v-img>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
  
                  <!-- Resumen de cotizaciones -->
                  <v-col cols="12" sm="6" lg="3">
                    <v-card class="dashboard-stat-card text-center pa-4">
                      <v-avatar color="primary" class="mb-4" size="56">
                        <v-icon icon="fa-solid fa-clipboard-list" color="white" size="24"></v-icon>
                      </v-avatar>
                      <h3 class="text-h4 font-weight-bold mb-1">{{ quoteCounts.all }}</h3>
                      <div class="text-subtitle-1 font-weight-medium">Total cotizaciones</div>
                    </v-card>
                  </v-col>
  
                  <v-col cols="12" sm="6" lg="3">
                    <v-card class="dashboard-stat-card text-center pa-4">
                      <v-avatar color="warning" class="mb-4" size="56">
                        <v-icon icon="fa-solid fa-clock" color="white" size="24"></v-icon>
                      </v-avatar>
                      <h3 class="text-h4 font-weight-bold mb-1">{{ quoteCounts.pending }}</h3>
                      <div class="text-subtitle-1 font-weight-medium">Pendientes</div>
                    </v-card>
                  </v-col>
  
                  <v-col cols="12" sm="6" lg="3">
                    <v-card class="dashboard-stat-card text-center pa-4">
                      <v-avatar color="success" class="mb-4" size="56">
                        <v-icon icon="fa-solid fa-check-circle" color="white" size="24"></v-icon>
                      </v-avatar>
                      <h3 class="text-h4 font-weight-bold mb-1">{{ quoteCounts.approved }}</h3>
                      <div class="text-subtitle-1 font-weight-medium">Aprobadas</div>
                    </v-card>
                  </v-col>
  
                  <v-col cols="12" sm="6" lg="3">
                    <v-card class="dashboard-stat-card text-center pa-4">
                      <v-avatar color="error" class="mb-4" size="56">
                        <v-icon icon="fa-solid fa-times-circle" color="white" size="24"></v-icon>
                      </v-avatar>
                      <h3 class="text-h4 font-weight-bold mb-1">{{ quoteCounts.rejected }}</h3>
                      <div class="text-subtitle-1 font-weight-medium">Rechazadas</div>
                    </v-card>
                  </v-col>
  
                  <!-- Cotizaciones recientes -->
                  <v-col cols="12">
                    <h2 class="text-h5 mb-4">Cotizaciones recientes</h2>
                    <v-card v-if="recentQuotes.length === 0" class="pa-4 text-center">
                      <v-icon icon="fa-solid fa-clipboard" size="56" color="grey-lighten-2" class="mb-3"></v-icon>
                      <div class="text-h6 mb-2">No tienes cotizaciones recientes</div>
                      <p class="mb-4 text-grey">Comienza a añadir productos a tu cotización</p>
                      <v-btn color="primary" to="/productos" prepend-icon="fa-solid fa-box-open">
                        Explorar productos
                      </v-btn>
                    </v-card>
                    <div v-else>
                      <v-table class="rounded mb-3">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Productos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="quote in recentQuotes" :key="quote.id">
                            <td class="font-weight-medium">#{{ quote.id }}</td>
                            <td>{{ formatDate(quote.date) }}</td>
                            <td>{{ quote.items.length }} productos</td>
                            <td>
                              <v-chip
                                :color="getStatusColor(quote.status)"
                                size="small"
                                variant="flat"
                              >
                                {{ getStatusText(quote.status) }}
                              </v-chip>
                            </td>
                            <td>
                              <v-btn
                                icon="fa-solid fa-eye"
                                variant="text"
                                color="primary"
                                size="small"
                                @click="viewQuote(quote)"
                              ></v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                      <div class="text-center">
                        <v-btn
                          color="primary"
                          variant="text"
                          prepend-icon="fa-solid fa-list"
                          @click="activeTab = 'quotes'"
                        >
                          Ver todas las cotizaciones
                        </v-btn>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
  
              <!-- TAB: MIS COTIZACIONES -->
              <div v-if="activeTab === 'quotes'">
                <v-card class="mb-6">
                  <div class="d-flex pa-4 flex-column flex-sm-row align-center">
                    <h2 class="text-h5 font-weight-medium mr-auto mb-3 mb-sm-0">Mis Cotizaciones</h2>
                    <div class="d-flex">
                      <v-select
                        v-model="quoteFilter"
                        :items="statusFilters"
                        label="Filtrar"
                        density="compact"
                        hide-details
                        variant="outlined"
                        class="max-width-select mr-2"
                      ></v-select>
                      <v-text-field
                        v-model="quoteSearch"
                        label="Buscar"
                        append-inner-icon="fa-solid fa-search"
                        density="compact"
                        hide-details
                        variant="outlined"
                        class="max-width-search"
                      ></v-text-field>
                    </div>
                  </div>
  
                  <v-divider></v-divider>
  
                  <div v-if="filteredQuotes.length === 0" class="pa-8 text-center">
                    <v-icon icon="fa-solid fa-clipboard" size="56" color="grey-lighten-2" class="mb-3"></v-icon>
                    <div class="text-h6 mb-2">No se encontraron cotizaciones</div>
                    <p class="mb-4 text-grey">Intenta con otro filtro o comienza a crear cotizaciones</p>
                    <v-btn color="primary" to="/productos" prepend-icon="fa-solid fa-box-open">
                      Explorar productos
                    </v-btn>
                  </div>
  
                  <div v-else>
                    <v-table hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Fecha</th>
                          <th>Productos</th>
                          <th>Estado</th>
                          <th>Última actualización</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="quote in paginatedQuotes" :key="quote.id">
                          <td class="font-weight-medium">#{{ quote.id }}</td>
                          <td>{{ formatDate(quote.date) }}</td>
                          <td>{{ quote.items.length }} productos</td>
                          <td>
                            <v-chip
                              :color="getStatusColor(quote.status)"
                              size="small"
                              variant="flat"
                            >
                              {{ getStatusText(quote.status) }}
                            </v-chip>
                          </td>
                          <td>{{ formatDate(quote.updatedAt || quote.date) }}</td>
                          <td>
                            <v-btn
                              icon="fa-solid fa-eye"
                              variant="text"
                              color="primary"
                              size="small"
                              class="mr-1"
                              @click="viewQuote(quote)"
                              :title="'Ver cotización #' + quote.id"
                            ></v-btn>
                            <v-btn
                              v-if="quote.status === 'approved'"
                              icon="fa-solid fa-download"
                              variant="text"
                              color="success"
                              size="small"
                              @click="downloadQuote(quote)"
                              :title="'Descargar PDF'"
                            ></v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
  
                    <div class="d-flex justify-center pt-4 pb-3">
                      <v-pagination
                        v-model="quotesPage"
                        :length="Math.ceil(filteredQuotes.length / quotesPerPage)"
                        :total-visible="7"
                        rounded="circle"
                      ></v-pagination>
                    </div>
                  </div>
                </v-card>
              </div>
  
              <!-- TAB: MI PERFIL -->
              <div v-if="activeTab === 'profile'">
                <v-card>
                  <v-tabs v-model="profileTab">
                    <v-tab value="personal">Información Personal</v-tab>
                    <v-tab value="password">Cambiar Contraseña</v-tab>
                    <v-tab value="company">Información de Empresa</v-tab>
                  </v-tabs>
  
                  <v-card-text>
                    <v-window v-model="profileTab">
                      <!-- Pestaña: Información Personal -->
                      <v-window-item value="personal">
                        <v-form ref="personalForm" @submit.prevent="updatePersonalInfo" v-model="personalFormValid">
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="personalInfo.firstName"
                                label="Nombre"
                                variant="outlined"
                                required
                                :rules="[v => !!v || 'Nombre es requerido']"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="personalInfo.lastName"
                                label="Apellido"
                                variant="outlined"
                                required
                                :rules="[v => !!v || 'Apellido es requerido']"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="personalInfo.email"
                                label="Email"
                                type="email"
                                variant="outlined"
                                required
                                :rules="emailRules"
                                disabled
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="personalInfo.phone"
                                label="Teléfono"
                                variant="outlined"
                                :rules="[v => !v || /^\+?[0-9\s-]{7,}$/.test(v) || 'Teléfono no válido']"
                                placeholder="+56 9 1234 5678"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12">
                              <v-divider class="mb-3"></v-divider>
                              <v-btn
                                color="primary"
                                type="submit"
                                :loading="personalInfoUpdating"
                                :disabled="!personalFormValid"
                              >
                                Guardar cambios
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-window-item>
                      
                      <!-- Pestaña: Cambiar Contraseña -->
                      <v-window-item value="password">
                        <v-form ref="passwordForm" @submit.prevent="updatePassword" v-model="passwordFormValid">
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                v-model="passwordInfo.currentPassword"
                                label="Contraseña actual"
                                type="password"
                                variant="outlined"
                                required
                                :rules="[v => !!v || 'Contraseña actual es requerida']"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12">
                              <v-text-field
                                v-model="passwordInfo.newPassword"
                                label="Nueva contraseña"
                                type="password"
                                variant="outlined"
                                required
                                :rules="passwordRules"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12">
                              <v-text-field
                                v-model="passwordInfo.confirmPassword"
                                label="Confirmar nueva contraseña"
                                type="password"
                                variant="outlined"
                                required
                                :rules="[
                                  v => !!v || 'Confirmación requerida',
                                  v => v === passwordInfo.newPassword || 'Las contraseñas no coinciden'
                                ]"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12">
                              <v-divider class="mb-3"></v-divider>
                              <v-btn
                                color="primary"
                                type="submit"
                                :loading="passwordUpdating"
                                :disabled="!passwordFormValid"
                              >
                                Actualizar contraseña
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-window-item>
                      
                      <!-- Pestaña: Información de Empresa -->
                      <v-window-item value="company">
                        <v-form ref="companyForm" @submit.prevent="updateCompanyInfo" v-model="companyFormValid">
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="companyInfo.name"
                                label="Nombre de empresa"
                                variant="outlined"
                                :rules="[v => !!v || 'Nombre de empresa es requerido']"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="companyInfo.rut"
                                label="RUT de empresa"
                                variant="outlined"
                                :rules="[
                                  v => !!v || 'RUT es requerido',
                                  v => /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/.test(v) || 'RUT no válido (ej: 12.345.678-9)'
                                ]"
                                placeholder="12.345.678-9"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="companyInfo.industry"
                                label="Industria"
                                variant="outlined"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12" sm="6">
                              <v-text-field
                                v-model="companyInfo.website"
                                label="Sitio web"
                                variant="outlined"
                                placeholder="https://www.ejemplo.cl"
                                :rules="[
                                  v => !v || /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/.test(v) || 'URL no válida'
                                ]"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12">
                              <v-textarea
                                v-model="companyInfo.address"
                                label="Dirección"
                                variant="outlined"
                                rows="2"
                                auto-grow
                              ></v-textarea>
                            </v-col>
                            
                            <v-col cols="12">
                              <v-divider class="mb-3"></v-divider>
                              <v-btn
                                color="primary"
                                type="submit"
                                :loading="companyUpdating"
                                :disabled="!companyFormValid"
                              >
                                Guardar información
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-window-item>
                    </v-window>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
  
      <!-- Modal de detalle de cotización -->
      <v-dialog v-model="quoteDetailDialog" max-width="900" scrollable>
        <v-card v-if="selectedQuote">
          <v-card-title class="d-flex align-center">
            <div>
              <span class="text-h5">Cotización #{{ selectedQuote.id }}</span>
              <div class="d-flex align-center mt-1">
                <v-chip
                  :color="getStatusColor(selectedQuote.status)"
                  size="small"
                  variant="flat"
                  class="mr-2"
                >
                  {{ getStatusText(selectedQuote.status) }}
                </v-chip>
                <span class="text-caption">
                  Realizada el {{ formatDate(selectedQuote.date) }}
                </span>
              </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              v-if="selectedQuote.status === 'approved'"
              icon="fa-solid fa-download"
              density="compact"
              color="primary"
              @click="downloadQuote(selectedQuote)"
              class="mr-2"
            ></v-btn>
            <v-btn 
              icon="fa-solid fa-xmark"
              variant="text"
              density="compact"
              @click="quoteDetailDialog = false"
            ></v-btn>
          </v-card-title>
  
          <v-divider></v-divider>
  
          <v-card-text>
            <div class="py-2">
              <v-table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th class="text-center">Cantidad</th>
                    <th v-if="selectedQuote.status === 'approved'" class="text-right">Precio Unit.</th>
                    <th v-if="selectedQuote.status === 'approved'" class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in selectedQuote.items" :key="index">
                    <td>
                      <div class="d-flex align-center">
                        <div class="mr-3" style="width: 40px; height: 40px;">
                          <v-img
                            :src="item.image"
                            :alt="item.name"
                            width="40"
                            height="40"
                            contain
                            class="bg-grey-lighten-4 rounded"
                          ></v-img>
                        </div>
                        <div>
                          <div class="font-weight-medium">{{ item.name }}</div>
                          <div class="text-caption text-grey">Código: {{ item.code }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td v-if="selectedQuote.status === 'approved'" class="text-right">
                      {{ formatCurrency(item.price || 0) }}
                    </td>
                    <td v-if="selectedQuote.status === 'approved'" class="text-right">
                      {{ formatCurrency((item.price || 0) * item.quantity) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="selectedQuote.status === 'approved'">
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-right font-weight-bold">Total Neto:</td>
                    <td class="text-right font-weight-medium">{{ formatCurrency(calculateTotal(selectedQuote)) }}</td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-right font-weight-bold">IVA (19%):</td>
                    <td class="text-right font-weight-medium">{{ formatCurrency(calculateTotal(selectedQuote) * 0.19) }}</td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-right font-weight-bold">Total:</td>
                    <td class="text-right font-weight-bold text-primary text-h6">
                      {{ formatCurrency(calculateTotal(selectedQuote) * 1.19) }}
                    </td>
                  </tr>
                </tfoot>
              </v-table>
  
              <!-- Mensaje para cotizaciones pendientes -->
              <v-alert
                v-if="selectedQuote.status === 'pending'"
                type="info"
                variant="tonal"
                class="mt-4"
              >
                <div class="font-weight-medium mb-1">Cotización en proceso</div>
                <p class="mb-0">Estamos trabajando en tu cotización. En breve recibirás un correo con los precios y condiciones para estos productos.</p>
              </v-alert>
  
              <!-- Mensaje para cotizaciones aprobadas -->
              <v-alert
                v-if="selectedQuote.status === 'approved'"
                type="success"
                variant="tonal"
                class="mt-4"
              >
                <div class="font-weight-medium mb-1">Cotización aprobada</div>
                <p class="mb-0">Tu cotización ha sido procesada. Puedes descargar el PDF con todos los detalles o contactar con tu ejecutivo de ventas para proceder con la compra.</p>
              </v-alert>
  
              <!-- Mensaje para cotizaciones rechazadas -->
              <v-alert
                v-if="selectedQuote.status === 'rejected'"
                type="error"
                variant="tonal"
                class="mt-4"
              >
                <div class="font-weight-medium mb-1">Cotización no procesada</div>
                <p class="mb-0">No pudimos procesar tu cotización por falta de disponibilidad de algunos productos. Por favor, contacta con nuestro equipo para más información.</p>
              </v-alert>
  
              <!-- Comentarios de la cotización -->
              <div v-if="selectedQuote.comments && selectedQuote.comments.length" class="mt-6">
                <h3 class="text-h6 mb-3">Historial de comunicaciones</h3>
                <div
                  v-for="(comment, i) in selectedQuote.comments"
                  :key="i"
                  class="comment-item pa-3 mb-2 rounded"
                  :class="{'comment-user': comment.type === 'user', 'comment-admin': comment.type === 'admin'}"
                >
                  <div class="d-flex align-center mb-2">
                    <v-avatar size="30" :color="comment.type === 'user' ? 'primary' : 'grey'" class="mr-2">
                      <v-icon size="small" color="white">
                        {{ comment.type === 'user' ? 'fa-solid fa-user' : 'fa-solid fa-headset' }}
                      </v-icon>
                    </v-avatar>
                    <div class="font-weight-medium">{{ comment.type === 'user' ? 'Tú' : 'Ejecutivo Incotex' }}</div>
                    <v-spacer></v-spacer>
                    <div class="text-caption text-grey">{{ formatDateTime(comment.date) }}</div>
                  </div>
                  <div>{{ comment.text }}</div>
                </div>
              </div>
  
              <!-- Formulario para añadir comentario -->
              <div v-if="selectedQuote.status !== 'rejected'" class="mt-4">
                <v-divider class="mb-4"></v-divider>
                <h3 class="text-subtitle-1 mb-3">Añadir comentario</h3>
                <v-textarea
                  v-model="newComment"
                  label="Escribe tu consulta o comentario"
                  hint="Nuestro equipo te responderá en breve"
                  persistent-hint
                  variant="outlined"
                  rows="2"
                  auto-grow
                  :loading="commentSending"
                ></v-textarea>
                <div class="d-flex justify-end mt-2">
                  <v-btn
                    color="primary"
                    :loading="commentSending"
                    @click="addComment"
                    :disabled="!newComment.trim()"
                  >
                    Enviar comentario
                  </v-btn>
                </div>
              </div>
  
            </div>
          </v-card-text>
  
          <v-card-actions class="pa-4">
            <v-btn
              v-if="selectedQuote.status === 'pending'"
              color="error"
              @click="cancelQuote"
              :loading="quoteCancelling"
              class="mr-2"
              variant="outlined"
            >
              Cancelar cotización
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="default"
              variant="text"
              @click="quoteDetailDialog = false"
            >
              Cerrar
            </v-btn>
            <v-btn
              v-if="selectedQuote.status === 'approved'"
              color="primary"
              @click="contactSales"
            >
              Contactar a ventas
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Modal de contacto con soporte -->
      <v-dialog v-model="showContactForm" max-width="600">
        <v-card>
          <v-card-title class="text-h5">Contactar a soporte</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <v-form @submit.prevent="submitSupportForm" ref="supportForm" v-model="supportFormValid">
              <v-select
                v-model="supportForm.topic"
                :items="supportTopics"
                label="Asunto"
                required
                :rules="[v => !!v || 'Selecciona un asunto']"
                variant="outlined"
              ></v-select>
              
              <v-textarea
                v-model="supportForm.message"
                label="Mensaje"
                required
                :rules="[v => !!v || 'El mensaje es necesario']"
                variant="outlined"
                rows="4"
                auto-grow
              ></v-textarea>
              
              <v-file-input
                v-model="supportForm.attachments"
                label="Adjuntos (opcional)"
                accept="image/png, image/jpeg, application/pdf"
                variant="outlined"
                prepend-icon="fa-solid fa-paperclip"
                show-size
                multiple
              ></v-file-input>
            </v-form>
          </v-card-text>
          
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              color="default"
              variant="text"
              @click="showContactForm = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              :loading="supportFormSubmitting"
              @click="submitSupportForm"
              :disabled="!supportFormValid"
            >
              Enviar consulta
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <AppFooter />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
  import { useQuoteStore } from '@/stores/quoteStore';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // Estado general
  const loading = ref(true);
  const activeTab = ref('dashboard');
  const menuItems = [
    { title: 'Dashboard', value: 'dashboard', icon: 'fa-solid fa-home' },
    { title: 'Mis Cotizaciones', value: 'quotes', icon: 'fa-solid fa-clipboard-list' },
    { title: 'Perfil', value: 'profile', icon: 'fa-solid fa-user' }
  ];
  
  // Tab de Perfil
  const profileTab = ref('personal');
  
  // Datos del usuario
  const userProfile = ref({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@empresa.cl',
    phone: '+56 9 8765 4321'
  });
  
  // Formulario de información personal
  const personalForm = ref(null);
  const personalFormValid = ref(true);
  const personalInfoUpdating = ref(false);
  const personalInfo = ref({ ...userProfile.value });
  
  // Formulario de contraseña
  const passwordForm = ref(null);
  const passwordFormValid = ref(false);
  const passwordUpdating = ref(false);
  const passwordInfo = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Formulario de información de empresa
  const companyForm = ref(null);
  const companyFormValid = ref(true);
  const companyUpdating = ref(false);
  const companyInfo = ref({
    name: 'Industrias XYZ Ltda.',
    rut: '76.543.210-8',
    industry: 'Manufactura',
    website: 'www.industriasxyz.cl',
    address: 'Av. Las Industrias 1234, Santiago, Chile'
  });
  
  // Reglas de validación
  const emailRules = [
    v => !!v || 'El email es requerido',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email no válido'
  ];
  
  const passwordRules = [
    v => !!v || 'La contraseña es requerida',
    v => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
    v => /[A-Z]/.test(v) || 'Debe contener al menos una mayúscula',
    v => /[0-9]/.test(v) || 'Debe contener al menos un número'
  ];
  
  // Datos de cotizaciones
  const quotesPage = ref(1);
  const quotesPerPage = 10;
  const quoteFilter = ref('all');
  const quoteSearch = ref('');
  const userQuotes = ref([]);
  const quoteDetailDialog = ref(false);
  const selectedQuote = ref(null);
  const commentSending = ref(false);
  const newComment = ref('');
  const quoteCancelling = ref(false);
  
  // Filtros de estado para cotizaciones
  const statusFilters = [
    { title: 'Todas', value: 'all' },
    { title: 'Pendientes', value: 'pending' },
    { title: 'Aprobadas', value: 'approved' },
    { title: 'Rechazadas', value: 'rejected' }
  ];
  
  // Formulario de contacto con soporte
  const showContactForm = ref(false);
  const supportForm = ref({
    topic: '',
    message: '',
    attachments: []
  });
  const supportTopics = [
    'Problema con una cotización',
    'Consulta sobre productos',
    'Problema de acceso a la cuenta',
    'Facturación',
    'Otro'
  ];
  const supportFormValid = ref(false);
  const supportFormSubmitting = ref(false);
  
  // Computed properties
  const userInitials = computed(() => {
    return `${userProfile.value.firstName.charAt(0)}${userProfile.value.lastName.charAt(0)}`;
  });
  
  const quoteCounts = computed(() => {
    return {
      all: userQuotes.value.length,
      pending: userQuotes.value.filter(q => q.status === 'pending').length,
      approved: userQuotes.value.filter(q => q.status === 'approved').length,
      rejected: userQuotes.value.filter(q => q.status === 'rejected').length
    };
  });
  
  const recentQuotes = computed(() => {
    return userQuotes.value
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  });
  
  const filteredQuotes = computed(() => {
    let filtered = [...userQuotes.value];
    
    // Aplicar filtro por estado
    if (quoteFilter.value !== 'all') {
      filtered = filtered.filter(q => q.status === quoteFilter.value);
    }
    
    // Aplicar búsqueda
    if (quoteSearch.value) {
      const searchTerm = quoteSearch.value.toLowerCase();
      filtered = filtered.filter(q => 
        q.id.toString().includes(searchTerm) || 
        q.items.some(item => 
          item.name.toLowerCase().includes(searchTerm) || 
          item.code.toLowerCase().includes(searchTerm)
        )
      );
    }
    
    // Ordenar por fecha (más recientes primero)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  });
  
  const paginatedQuotes = computed(() => {
    const start = (quotesPage.value - 1) * quotesPerPage;
    const end = start + quotesPerPage;
    return filteredQuotes.value.slice(start, end);
  });
  
  // Métodos
  const loadData = async () => {
    try {
      loading.value = true;

      // Verificar autenticación
      const userData = localStorage.getItem('user_data');
      
      if (!userData) {
        console.log('Usuario no autenticado, redirigiendo a login');
        // Redirigir al login con parámetro de redirección
        router.replace({ 
          path: '/iniciar-sesion', 
          query: { redirect: '/mi-cuenta' } 
        });
        return; // Detener la carga de datos
      }
      
      console.log('Usuario autenticado, cargando datos');
      
      // Si hay sesión, parsear los datos del usuario
      const user = JSON.parse(userData);
      userProfile.value = {
        firstName: user.firstName || 'Usuario',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '+56 9 8765 4321'
      };
      
      // Actualizar el formulario con los datos del usuario
      personalInfo.value = { ...userProfile.value };
      
      // En una aplicación real, aquí cargaríamos los datos del usuario y sus cotizaciones
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de carga
      
      // Simular datos de cotizaciones
      userQuotes.value = generateMockQuotes();
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const generateMockQuotes = () => {
    // Función para generar datos simulados de cotizaciones
    const mockQuotes = [];
    
    // Crear algunas cotizaciones con diferentes estados
    const today = new Date();
    
    // Cotización pendiente reciente
    mockQuotes.push({
      id: 10045,
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString(),
      status: 'pending',
      items: [
        {
          id: 1,
          name: 'Contactor Tripolar ABB AX09-30-10-80',
          code: 'CTR-ABB-093010',
          image: 'https://www.electromaterial.cl/wp-content/uploads/2021/01/AX09-30-10-80-300x300.jpg',
          quantity: 3
        },
        {
          id: 2,
          name: 'Interruptor Automático Schneider C60H-DC',
          code: 'INT-SCH-C60HDC',
          image: 'https://www.se.com/cl/es/product/%7B%7Bitem.productUrlPath%7D%7D/image/C60H-DC.JPG',
          quantity: 2
        }
      ],
      comments: [
        {
          type: 'user',
          text: 'Necesito estos productos con urgencia, ¿podrían indicarme disponibilidad y tiempos de entrega?',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 15).toISOString()
        },
        {
          type: 'admin',
          text: 'Buen día. Estamos verificando stock de estos productos. Le enviaremos la cotización dentro de 24 horas.',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 9, 30).toISOString()
        }
      ]
    });
    
    // Cotización aprobada
    mockQuotes.push({
      id: 10033,
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15).toISOString(),
      updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13).toISOString(),
      status: 'approved',
      items: [
        {
          id: 3,
          name: 'Relé Térmico Siemens 3RU1126-4DB0',
          code: 'RLT-SIE-3RU1126',
          image: 'https://assets.new.siemens.com/siemens/assets/api/uuid:743bc897040fa975e4d014d4ebae15416ef25c01/width:1125/crop:0,0165:0,3965:1/quality:high/3ru11-26-4db0-relai-thermique-cl10-17-6-22a-pour-contacteur-3rt1-o-3rt2-montage-direct.jpg',
          quantity: 5,
          price: 28900
        },
        {
          id: 5,
          name: 'Cable Multiconductor LSHF 4x2.5mm2',
          code: 'CBL-LSHF-4X25',
          image: 'https://www.cobrex.cl/wp-content/uploads/2018/05/cables-electricos-multiconductores-1.jpg',
          quantity: 100,
          price: 1250
        },
        {
          id: 7,
          name: 'Transformador de Control Legrand 250VA',
          code: 'TRF-LEG-250VA',
          image: 'https://multimedia.legrand.com/multimedia/content/cr-photo/b-/legrand/productselector/products/42225-s.jpg',
          quantity: 1,
          price: 85000
        }
      ],
      comments: [
        {
          type: 'user',
          text: 'Necesito estos productos para un proyecto importante.',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15, 14, 22).toISOString()
        },
        {
          type: 'admin',
          text: 'Cotización aprobada. Hemos enviado los precios y condiciones a su correo electrónico.',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13, 10, 45).toISOString()
        },
        {
          type: 'user',
          text: '¿Podrían indicarme los tiempos de entrega estimados para estos productos?',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13, 11, 30).toISOString()
        },
        {
          type: 'admin',
          text: 'Tenemos todos los productos disponibles en stock. Tiempo de entrega estimado: 48 horas hábiles después de confirmado el pago.',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13, 15, 20).toISOString()
        }
      ]
    });
    
    // Cotización rechazada
    mockQuotes.push({
      id: 9987,
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30).toISOString(),
      updatedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 28).toISOString(),
      status: 'rejected',
      items: [
        {
          id: 9,
          name: 'Variador de Frecuencia ABB ACS380-04E-02A4-4',
          code: 'VDF-ABB-ACS380',
          image: 'https://new.abb.com/products/3AXD50000419015/acs380-04e-02a4-4-three-phase-ac-drive-0-75-kw-380-480-v-ip20-ul-open-type/overview',
          quantity: 1
        }
      ],
      comments: [
        {
          type: 'user',
          text: 'Necesito cotizar este variador de frecuencia.',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, 16, 45).toISOString()
        },
        {
          type: 'admin',
          text: 'Lamentamos informarle que este producto se encuentra actualmente sin stock. Podemos ofrecerle un modelo alternativo o gestionar una importación con un plazo de 4 semanas.',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 28, 11, 10).toISOString()
        }
      ]
    });
    
    // Más cotizaciones pendientes para rellenar
    for (let i = 0; i < 8; i++) {
      mockQuotes.push({
        id: 10000 - i,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (45 + i * 5)).toISOString(),
        status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'approved' : 'rejected',
        items: [
          {
            id: 10 + i,
            name: `Producto ejemplo ${i + 1}`,
            code: `PRD-${1000 + i}`,
            image: `https://via.placeholder.com/100?text=PRD${1000 + i}`,
            quantity: Math.floor(Math.random() * 5) + 1,
            price: i % 3 === 1 ? Math.round((Math.random() * 50000 + 10000) / 100) * 100 : null
          }
        ],
        comments: []
      });
    }
    
    return mockQuotes;
  };
  
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  const formatDateTime = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleString('es-ES', options);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      default: return 'Desconocido';
    }
  };
  
  const calculateTotal = (quote) => {
    return quote.items.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };
  
  const viewQuote = (quote) => {
    selectedQuote.value = quote;
    quoteDetailDialog.value = true;
    newComment.value = '';
  };
  
  const updatePersonalInfo = async () => {
    try {
      personalInfoUpdating.value = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de guardado
      
      // Actualizar datos del usuario
      userProfile.value = { ...personalInfo.value };
      
      // Mostrar mensaje de éxito
      alert('Información personal actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando información:', error);
      alert('Error al actualizar la información');
    } finally {
      personalInfoUpdating.value = false;
    }
  };
  
  const updatePassword = async () => {
    try {
      passwordUpdating.value = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de guardado
      
      // Mostrar mensaje de éxito
      alert('Contraseña actualizada correctamente');
      
      // Limpiar formulario
      passwordInfo.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      alert('Error al actualizar la contraseña');
    } finally {
      passwordUpdating.value = false;
    }
  };
  
  const updateCompanyInfo = async () => {
    try {
      companyUpdating.value = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de guardado
      
      // Mostrar mensaje de éxito
      alert('Información de empresa actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando información de empresa:', error);
      alert('Error al actualizar la información de empresa');
    } finally {
      companyUpdating.value = false;
    }
  };
  
  const addComment = async () => {
    if (!newComment.value.trim()) return;
    
    try {
      commentSending.value = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      
      // Añadir comentario a la cotización
      selectedQuote.value.comments = selectedQuote.value.comments || [];
      selectedQuote.value.comments.push({
        type: 'user',
        text: newComment.value.trim(),
        date: new Date().toISOString()
      });
      
      // Limpiar campo
      newComment.value = '';
      
      // Simular respuesta automática después de 2 segundos
      setTimeout(() => {
        if (selectedQuote.value && quoteDetailDialog.value) {
          selectedQuote.value.comments.push({
            type: 'admin',
            text: 'Gracias por tu mensaje. Un ejecutivo revisará tu consulta y te responderá a la brevedad.',
            date: new Date().toISOString()
          });
        }
      }, 2000);
    } catch (error) {
      console.error('Error enviando comentario:', error);
      alert('Error al enviar el comentario');
    } finally {
      commentSending.value = false;
    }
  };
  
  const cancelQuote = async () => {
    if (!confirm('¿Está seguro que desea cancelar esta cotización?')) return;
    
    try {
      quoteCancelling.value = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      
      // Cambiar estado a rechazado
      selectedQuote.value.status = 'rejected';
      selectedQuote.value.updatedAt = new Date().toISOString();
      
      // Añadir comentario
      selectedQuote.value.comments = selectedQuote.value.comments || [];
      selectedQuote.value.comments.push({
        type: 'user',
        text: 'Cotización cancelada por el cliente.',
        date: new Date().toISOString()
      });
      
      alert('Cotización cancelada correctamente');
    } catch (error) {
      console.error('Error cancelando cotización:', error);
      alert('Error al cancelar la cotización');
    } finally {
      quoteCancelling.value = false;
    }
  };
  
  const downloadQuote = (quote) => {
    // En una aplicación real, aquí se generaría un PDF
    alert(`Descargando cotización #${quote.id} en formato PDF...`);
  };
  
  const contactSales = () => {
    alert('Se abrirá una ventana de chat con el departamento de ventas.');
  };
  
  const submitSupportForm = async () => {
    try {
      supportFormSubmitting.value = true;
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
      
      alert('Tu consulta ha sido enviada. Te responderemos a la brevedad.');
      supportForm.value = {
        topic: '',
        message: '',
        attachments: []
      };
      showContactForm.value = false;
    } catch (error) {
      console.error('Error enviando formulario:', error);
      alert('Error al enviar el formulario');
    } finally {
      supportFormSubmitting.value = false;
    }
  };
  
  const logout = () => {
    // Eliminar datos de usuario
    localStorage.removeItem('user_data');
    
    // Disparar evento para actualizar otros componentes
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user_data',
      newValue: null
    }));
    
    // Redirigir a la página de inicio
    router.push('/');
    
    // Mostrar mensaje de despedida
    alert('Has cerrado sesión correctamente');
  };
  
  // Cargar datos al montar el componente
  onMounted(() => {
    // Verificar autenticación antes de cargar datos
    const userData = localStorage.getItem('user_data');
    
    if (!userData) {
      console.log('Usuario no autenticado, redirigiendo a login');
      // Redirigir al login con parámetro de redirección
      router.replace({ 
        path: '/iniciar-sesion', 
        query: { redirect: '/mi-cuenta' } 
      });
      return; // No cargar datos
    }
    
    // Si hay sesión, cargar datos
    loadData();
  });
  </script>
  
  <style scoped>
  .account-header {
    background-color: #f5f7fa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .account-container {
    max-width: 1400px !important;
  }
  
  .max-width-select {
    max-width: 200px;
  }
  
  .max-width-search {
    max-width: 250px;
  }
  
  .dashboard-stat-card {
    height: 100%;
    transition: transform 0.3s, box-shadow 0.3s;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  
  .dashboard-stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  .comment-item {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
  
  .comment-user {
    background-color: #f0f4ff;
    border-left: 3px solid var(--v-primary-base);
  }
  
  .comment-admin {
    background-color: #f5f5f5;
    border-left: 3px solid #5c6bc0;
  }
  
  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .support-card {
    background-color: #f8fafc;
    border-left: 4px solid var(--v-primary-base);
  }
  </style>