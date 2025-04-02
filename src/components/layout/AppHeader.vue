<template>
    <header>
      <!-- Top Bar - Barra azul con contacto y redes sociales (se oculta en móviles) -->
      <v-sheet class="top-bar d-none d-sm-block" color="primary">
        <div class="container d-flex justify-space-between align-center py-2">
          <div class="contact-info d-flex align-center">
            <v-btn variant="text" color="white" href="tel:+56912345678" class="px-2 text-body-2" density="compact">
              <v-icon icon="fa-solid fa-phone" size="small" class="mr-2" />
              +56 9 1234 5678
            </v-btn>
            <v-btn variant="text" color="white" href="mailto:contacto@ferrepro.cl" class="px-2 text-body-2" density="compact">
              <v-icon icon="fa-solid fa-envelope" size="small" class="mr-2" />
              contacto@ferrepro.cl
            </v-btn>
            <div class="welcome-message ml-2">
              <span v-if="isLoggedIn" class="text-white text-body-2">
                ¡Hola {{ currentUserName }}!
              </span>
              <span v-else class="text-white text-body-2">
                ¡Hola invitado!
              </span>
            </div>
          </div>
          <div class="social-links d-flex">
            <v-btn icon variant="text" color="white" href="#" size="small" class="social-btn">
              <v-icon icon="fa-brands fa-facebook-f" size="small" />
            </v-btn>
            <v-btn icon variant="text" color="white" href="#" size="small" class="social-btn">
              <v-icon icon="fa-brands fa-instagram" size="small" />
            </v-btn>
            <v-btn icon variant="text" color="white" href="#" size="small" class="social-btn">
              <v-icon icon="fa-brands fa-whatsapp" size="small" />
            </v-btn>
          </div>
        </div>
      </v-sheet>
  
      <!-- Mobile Header -->
      <v-sheet color="white" elevation="1" class="d-flex d-md-none mobile-header">
        <div class="container d-flex align-center justify-space-between py-2">
          <!-- Mobile menu button -->
          <v-btn
            icon
            variant="text"
            @click="mobileDrawer = !mobileDrawer"
            color="primary"
          >
            <v-icon icon="fa-solid fa-bars" />
          </v-btn>
  
          <!-- Logo -->
          <div class="logo-mobile">
            <router-link to="/">
              <v-img
                :src="logoUrl"
                alt="INCOTEX HV SERVICIOS SPA"
                width="140"
                height="40"
                contain
                eager
                @error="handleLogoError"
                class="custom-logo"
              />
            </router-link>
          </div>
  
          <!-- Cotización icon (antes Cart icon) -->
          <div class="d-flex align-center">
            <v-btn
              icon
              variant="text"
              color="primary"
              @click="mobileSearch = !mobileSearch"
              class="mr-2"
            >
              <v-icon icon="fa-solid fa-magnifying-glass" />
            </v-btn>
            
            <v-btn
              icon
              variant="text"
              color="primary"
              to="/mis-cotizaciones"
            >
              <v-badge :content="quoteItemCount.toString()" color="error" location="top end" offset-x="5" offset-y="5">
                <v-icon icon="fa-solid fa-file-invoice" />
              </v-badge>
            </v-btn>
          </div>
        </div>
      </v-sheet>
  
      <!-- Mobile Search Bar (aparece cuando se hace clic en el icono de búsqueda) -->
      <v-expand-transition>
        <v-sheet v-if="mobileSearch" color="white" class="d-md-none py-2 px-4">
          <div class="d-flex align-center">
            <v-text-field
              variant="outlined"
              density="compact"
              hide-details
              placeholder="¿Qué estás buscando?"
              class="search-input"
              color="primary"
              autofocus
              append-inner-icon="fa-solid fa-times"
              @click:append-inner="mobileSearch = false"
            />
            <v-btn color="primary" class="ml-2" size="small">
              <v-icon icon="fa-solid fa-magnifying-glass" />
            </v-btn>
          </div>
        </v-sheet>
      </v-expand-transition>
  
      <!-- Mobile Navigation Drawer -->
      <v-navigation-drawer
        v-model="mobileDrawer"
        temporary
        location="left"
        width="280"
      >
        <v-list>
          <v-list-item>
            <v-list-item-title class="text-h6 font-weight-bold">Menú</v-list-item-title>
            <template v-slot:append>
              <v-btn icon variant="text" @click="mobileDrawer = false">
                <v-icon icon="fa-solid fa-times" />
              </v-btn>
            </template>
          </v-list-item>
          
          <v-divider class="my-2"></v-divider>
          
          <v-list-item to="/" @click="mobileDrawer = false">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-home" class="mr-2" />
            </template>
            <v-list-item-title>Inicio</v-list-item-title>
          </v-list-item>
          
          <v-list-item to="/mi-cuenta" @click="mobileDrawer = false">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-user" class="mr-2" />
            </template>
            <v-list-item-title>Mi Cuenta</v-list-item-title>
          </v-list-item>
          
          <v-list-item to="/mis-cotizaciones" @click="mobileDrawer = false">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-shopping-cart" class="mr-2" />
            </template>
            <v-list-item-title>Mis cotizaciones</v-list-item-title>
          </v-list-item>
          
          <v-divider class="my-2"></v-divider>
          
          <v-list-subheader>Categorías</v-list-subheader>
          
          <!-- Categorías dinámicas para móvil -->
          <v-list-group
            v-for="category in categoriesList"
            :key="category.id"
            :value="category.name"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :title="category.name"
                @click="navigateToCategory(category.id, category.slug)"
              >
                <template v-slot:prepend>
                  <v-icon :icon="getCategoryIcon(category.id)" class="mr-2" />
                </template>
              </v-list-item>
            </template>
            
            <!-- Si hay subcategorías, mostrarlas -->
            <v-list-item
              v-for="subcategory in category.subcategories || []"
              :key="subcategory.id"
              :title="subcategory.name"
              @click="navigateToCategory(subcategory.id, subcategory.slug); mobileDrawer = false"
              class="pl-4"
            />
          </v-list-group>
          
          <v-divider class="my-2"></v-divider>
          
          <v-list-item to="/productos" @click="mobileDrawer = false">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-boxes-stacked" class="mr-2" />
            </template>
            <v-list-item-title>Productos</v-list-item-title>
          </v-list-item>
                
          <v-list-item to="/novedades" @click="mobileDrawer = false">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-file-invoice" class="mr-2" />
            </template>
            <v-list-item-title>Novedades</v-list-item-title>
          </v-list-item>
          
          <v-list-item to="/marcas" @click="mobileDrawer = false">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-certificate" class="mr-2" />
            </template>
            <v-list-item-title>Marcas</v-list-item-title>
          </v-list-item>
          
          <v-list-item to="/contacto" @click="mobileDrawer = false">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-envelope" class="mr-2" />
            </template>
            <v-list-item-title>Contacto</v-list-item-title>
          </v-list-item>
          
          <v-divider class="my-2"></v-divider>
          
          <v-list-item href="tel:+56912345678">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-phone" class="mr-2" />
            </template>
            <v-list-item-title>+56 9 1234 5678</v-list-item-title>
          </v-list-item>
          
          <v-list-item href="mailto:contacto@ferrepro.cl">
            <template v-slot:prepend>
              <v-icon icon="fa-solid fa-envelope" class="mr-2" />
            </template>
            <v-list-item-title>contacto@ferrepro.cl</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <!-- Main Navigation - Logo, búsqueda y cuenta/carrito (se oculta en móviles) -->
      <v-sheet color="white" elevation="0" class="py-3 d-none d-md-block">
        <div class="container d-flex align-center">
          <div class="logo mr-6">
            <router-link to="/">
              <v-img
                :src="logoUrl"
                alt="INCOTEX HV SERVICIOS SPA"
                max-width="220"
                :aspect-ratio="3.2"
                contain
                eager
                @error="handleLogoError"
                class="custom-logo"
              />
            </router-link>
          </div>
          
          <div class="search-container flex-grow-1 mx-auto">
            <div class="d-flex align-center">
              <v-select
                class="category-select mr-0 rounded-r-0"
                :items="categoryDropdownItems"
                item-title="text"
                item-value="value"
                variant="outlined"
                hide-details
                model-value="all"
                density="compact"
                color="primary"
                v-model="selectedCategoryInSearch"
                @update:model-value="handleCategorySelect"
              />
              <v-text-field
                variant="outlined"
                density="compact"
                hide-details
                placeholder="¿Qué estás buscando?"
                class="search-input rounded-0"
                color="primary"
                v-model="searchQuery"
              />
              <v-btn color="primary" elevation="0" class="search-button rounded-l-0" height="40" @click="searchProducts">
                <v-icon icon="fa-solid fa-magnifying-glass" />
              </v-btn>
            </div>
          </div>
  
          <div class="nav-actions d-flex ml-6">
            <v-btn to="/mi-cuenta" variant="text" class="account-btn d-flex flex-column pa-2" color="black">
              <v-icon icon="fa-solid fa-user" class="mb-1" />
              <span class="text-caption">Mi Cuenta</span>
            </v-btn>
            
            <!-- Cotizaciones with dropdown (antes Cart) -->
            <v-menu
              v-model="quoteMenuOpen"
              :close-on-content-click="false"
              location="bottom end"
              offset="10"
              min-width="350"
            >
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text" 
                  class="quote-btn d-flex flex-column pa-2 ml-4" 
                  color="black"
                >
                  <v-badge :content="quoteItemCount.toString()" color="error" location="top end" offset-x="10" offset-y="10">
                    <v-icon icon="fa-solid fa-file-invoice" class="mb-1" />
                  </v-badge>
                  <span class="text-caption">Cotizaciones</span>
                </v-btn>
              </template>
  
              <v-card class="quote-dropdown">
                <v-card-title class="d-flex justify-space-between align-center py-3 px-4 bg-grey-lighten-4">
                  <span class="text-subtitle-1 font-weight-bold">Mis Cotizaciones</span>
                  <span class="text-subtitle-2">{{ quoteItemCount }} productos</span>
                </v-card-title>
  
                <v-card-text class="pa-0">
                  <div v-if="quoteItems.length > 0">
                    <v-list class="quote-items-list">
                      <v-list-item
                        v-for="item in quoteItems"
                        :key="item.id"
                        class="quote-item py-2"
                      >
                        <template v-slot:prepend>
                          <v-img
                            :src="item.image"
                            :alt="item.name"
                            width="60"
                            height="60"
                            cover
                            class="rounded mr-3"
                          ></v-img>
                        </template>
  
                        <v-list-item-title class="text-body-2 font-weight-medium mb-1">
                          {{ item.name }}
                        </v-list-item-title>
  
                        <v-list-item-subtitle class="d-flex justify-space-between align-center">
                          <span class="text-caption">{{ item.quantity }} x {{ item.quotedPrice === null ? 'Por cotizar' : '$' + formatPrice(item.quotedPrice) }}</span>
                          <span class="text-body-2 font-weight-bold">{{ item.quotedPrice === null ? 'Por cotizar' : '$' + formatPrice(item.quotedPrice * item.quantity) }}</span>
                        </v-list-item-subtitle>
  
                        <template v-slot:append>
                          <v-btn
                            icon
                            variant="text"
                            density="compact"
                            color="grey"
                            @click="removeFromQuote(item.id)"
                          >
                            <v-icon icon="fa-solid fa-times" size="small"></v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
  
                    <v-divider></v-divider>
  
                    <div class="quote-summary pa-4">
                      <div class="d-flex justify-space-between mb-2">
                        <span class="text-body-2">Total estimado:</span>
                        <span class="text-body-2 font-weight-bold">{{ quoteSubtotal === 0 && quoteItems.some(item => item.quotedPrice === null) ? 'Por cotizar' : '$' + formatPrice(quoteSubtotal) }}</span>
                      </div>
  
                      <div class="d-flex flex-column mt-4">
                        <v-btn
                          color="primary"
                          variant="flat"
                          block
                          class="mb-2"
                          to="/mis-cotizaciones"
                          @click="quoteMenuOpen = false"
                        >
                          Ver cotizaciones
                        </v-btn>
  
                        <v-btn
                          color="success"
                          variant="flat"
                          block
                          to="/solicitar-cotizacion"
                          @click="quoteMenuOpen = false"
                        >
                          Solicitar cotización
                        </v-btn>
                      </div>
                    </div>
                  </div>
  
                  <div v-else class="empty-quote text-center py-6 px-4">
                    <v-icon icon="fa-solid fa-file-invoice" size="48" color="grey-lighten-2" class="mb-3"></v-icon>
                    <p class="text-body-1 mb-4">No tienes productos en tu cotización</p>
                    <v-btn
                      color="primary"
                      variant="flat"
                      to="/productos"
                      @click="quoteMenuOpen = false"
                    >
                      Explorar productos
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>
        </div>
      </v-sheet>
  
      <!-- Menu Navigation - Categorías y enlaces principales (se oculta en móviles) -->
      <v-sheet color="white" elevation="1" class="border-t d-none d-md-block">
        <div class="container">
          <div class="d-flex">
            <!-- Menú de categorías desplegable -->
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="primary"
                  variant="flat"
                  class="px-4 text-none font-weight-medium"
                  rounded="0"
                >
                  <v-icon icon="fa-solid fa-bars" start />
                  Categorías
                </v-btn>
              </template>
              
              <!-- Lista de categorías dinámica -->
              <v-list>
                <v-list-item
                  v-for="category in categoriesList"
                  :key="category.id"
                  :value="category.id"
                  @click="navigateToCategory(category.id, category.slug)"
                >
                  <template v-slot:prepend>
                    <v-icon :icon="getCategoryIcon(category.id)"></v-icon>
                  </template>
                  <v-list-item-title>{{ category.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            
            <v-tabs
              color="primary"
              align-tabs="center"
              slider-color="primary"
              class="ml-4"
            >
              <v-tab to="/" class="text-none px-4">Inicio</v-tab>
              <v-tab to="/productos" class="text-none px-4">Productos</v-tab>
              <v-tab to="/novedades" class="text-none px-4">Novedades</v-tab>
              <v-tab to="/marcas" class="text-none px-4">Marcas</v-tab>
              <v-tab to="/contacto" class="text-none px-4">Contacto</v-tab>
            </v-tabs>
          </div>
        </div>
      </v-sheet>
    </header>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuoteStore } from '@/stores/quoteStore';
  import { productService } from '@/services/productService';
  import logoImage from '@/assets/Logo-Incotex-1024x318.png';
  
  // Router
  const router = useRouter();
  
  // Variables para el menú móvil
  const mobileDrawer = ref(false);
  const mobileSearch = ref(false);
  
  // Variables para la búsqueda
  const searchQuery = ref('');
  const selectedCategoryInSearch = ref('all');
  
  // Variables para las categorías
  const categoriesList = ref([]);
  const loadingCategories = ref(false);
  
  // Logo URL (ahora usando la importación directa)
  const logoUrl = ref(logoImage);
  
  // Configurar una URL de respaldo en caso de error
  const fallbackLogoUrl = 'https://incotexhv.cl/wp-content/uploads/2021/07/Logo-Incotex-1024x318.png';
  
  // Categorías para el dropdown de búsqueda
  const categoryDropdownItems = computed(() => {
    return [
      { text: 'Todas las categorías', value: 'all' },
      ...categoriesList.value.map(category => ({
        text: category.name,
        value: category.id
      }))
    ];
  });
  
  // Íconos para las categorías (asigna un ícono según el ID o nombre)
  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      1: 'fa-solid fa-tools',
      2: 'fa-solid fa-bolt',
      3: 'fa-solid fa-faucet',
      4: 'fa-solid fa-paint-roller',
      5: 'fa-solid fa-hard-hat',
      default: 'fa-solid fa-folder'
    };
    
    return iconMap[categoryId] || iconMap.default;
  };
  
  // Método para navegar a una categoría - Actualizado para priorizar el slug
  const navigateToCategory = (categoryId, slug) => {
    mobileDrawer.value = false; // Cerrar el menú móvil si está abierto
    // Usar siempre el slug si está disponible
    router.push(`/categorias/${slug || categoryId}`);
  };
  
  // Manejar la selección de categoría en el buscador
  const handleCategorySelect = (value) => {
    if (value !== 'all') {
      const category = categoriesList.value.find(cat => cat.id === value);
      if (category) {
        navigateToCategory(category.id, category.slug);
      }
    }
  };
  
  // Método para buscar productos
  const searchProducts = () => {
    if (!searchQuery.value.trim()) return;
    
    const params = new URLSearchParams();
    params.append('q', searchQuery.value);
    
    if (selectedCategoryInSearch.value !== 'all') {
      params.append('category', selectedCategoryInSearch.value);
    }
    
    router.push({ path: '/productos', query: { q: searchQuery.value, category: selectedCategoryInSearch.value !== 'all' ? selectedCategoryInSearch.value : null } });
  };
  
  // Quote functionality (antes Cart)
  const quoteStore = useQuoteStore();
  const quoteMenuOpen = ref(false);
  
  // Use quote store properties
  const quoteItems = computed(() => quoteStore.quoteItems);
  const quoteItemCount = computed(() => quoteStore.quoteItemCount);
  const quoteSubtotal = computed(() => quoteStore.quoteSubtotal);
  
  // Use quote store methods
  const formatPrice = quoteStore.formatPrice;
  const removeFromQuote = quoteStore.removeFromQuote;
  
  // Manejar errores de carga del logo
  const handleLogoError = () => {
    console.log('Error al cargar el logo local, usando logo alternativo');
    logoUrl.value = fallbackLogoUrl;
  };
  
  // Estado de inicio de sesión y nombre de usuario
  const isLoggedIn = ref(false);
  const currentUserName = ref('');
  
  // Verificar estado de autenticación
  const checkAuthStatus = () => {
    // Verificar si hay datos de usuario en localStorage
    const user = localStorage.getItem('user_data');
    if (user) {
      try {
        const userData = JSON.parse(user);
        isLoggedIn.value = true;
        currentUserName.value = userData.firstName || userData.email.split('@')[0];
      } catch (e) {
        console.error('Error parsing user data:', e);
        isLoggedIn.value = false;
      }
    } else {
      isLoggedIn.value = false;
    }
  };
  
  // Cargar categorías cuando se monta el componente
  onMounted(async () => {
    try {
      loadingCategories.value = true;
      const categories = await productService.getCategories();
      categoriesList.value = categories;
      
      // Verificar estado de autenticación
      checkAuthStatus();
      
      // Escuchar eventos de login/logout
      window.addEventListener('storage', (event) => {
        if (event.key === 'user_data') {
          checkAuthStatus();
        }
      });
      
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
    } finally {
      loadingCategories.value = false;
    }
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .top-bar {
    font-size: 0.9rem;
  }
  
  .social-btn {
    width: 28px !important;
    height: 28px !important;
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-radius: 50%;
  }
  
  .search-container {
    max-width: 600px;
  }
  
  .category-select {
    min-width: 180px;
    max-width: 180px;
  }
  
  .search-button {
    min-width: 48px !important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  
  .account-btn, 
  .cart-btn {
    height: auto !important;
  }
  
  .border-t {
    border-top: 1px solid #e0e0e0;
  }
  
  .logo {
    min-width: 160px;
    display: flex;
    align-items: center;
    justify-content: center; /* Centrar horizontalmente */
    height: 60px; /* Altura fija */
  }
  
  .logo-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    max-width: 140px;
    height: 40px;
  }
  
  .mobile-header {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
  }
  .quote-dropdown {
    border-radius: 8px;
    overflow: hidden;
  }
  
  .quote-items-list {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .quote-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .quote-item:last-child {
    border-bottom: none;
  }
  
  .empty-quote {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  /* Sobreescribir el CSS de Vuetify para los logos */
  :deep(.custom-logo .v-img__img){
    position:sticky;
    margin-bottom: 60px;
  }
  
  /* Asegurarse de que el logo tiene un fondo y bordes visibles para depuración */
  .custom-logo {
    background-color: transparent;
    display: block;
  }
  
  /* Ajustes responsive */
  @media (max-width: 960px) {
    .category-select {
      min-width: 120px;
      max-width: 120px;
    }
    
    .nav-actions {
      margin-left: 0;
    }
  }
  
  @media (max-width: 768px) {
    .contact-info span {
      display: none;
    }
    
    .search-container {
      margin: 0 10px;
    }
  }
  
  @media (max-width: 599px) {
    .logo {
      min-width: 120px;
    }
    
    .logo .v-img {
      max-width: 150px !important;
    }
  }
  </style>