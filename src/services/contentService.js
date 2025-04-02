// Servicio para obtener contenido dinámico como banners
// import axios from 'axios';

// Simulación de API para desarrollo
const API_DELAY = 1000; // Simular retraso de red de 1 segundo

// Dimensiones recomendadas para imágenes
const IMAGE_DIMENSIONS = {
  mainBanner: {
    width: 1920,
    height: 800,
    aspectRatio: '2.4:1',
    maxSize: '300KB'
  },
  secondaryBanner: {
    width: 800,
    height: 600,
    aspectRatio: '4:3',
    maxSize: '150KB'
  }
};

// Importar la función de generación de slug del productService (o duplicarla aquí)
const generateSlug = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim();
};

export const contentService = {
  // Obtener datos del hero banner
  async getHeroBannerContent() {
    // Simulamos una llamada a API con Promise
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          mainBanner: {
            title: "Soluciones Eléctricas de Alta Calidad",
            subtitle: "Equipamiento profesional para proyectos industriales y residenciales",
            buttonText: "Explorar Catálogo",
            buttonLink: "/productos",
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          },
          secondaryBanners: [
            {
              title: "Automatización Industrial",
              subtitle: "Tecnología de vanguardia para tu empresa",
              image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            },
            {
              title: "Servicio Técnico Especializado",
              subtitle: "Soporte y mantenimiento garantizado",
              image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            }
          ]
        });
      }, API_DELAY);
    });
    
    // Cuando tengas una API real, descomenta este código:
    /*
    try {
      const response = await axios.get(`${API_URL}/content/hero-banner`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el contenido del banner:', error);
      throw error;
    }
    */
  },
  
  // Nuevo método para obtener datos de las tarjetas de características
  async getFeatureCardsContent() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            icon: "fa-solid fa-truck-fast",
            title: "Envío Rápido",
            description: "Entrega en todo Chile con seguimiento en tiempo real de tus pedidos."
          },
          {
            icon: "fa-solid fa-shield-halved",
            title: "Garantía de Calidad",
            description: "Todos nuestros productos cuentan con garantía y certificaciones."
          },
          {
            icon: "fa-solid fa-headset",
            title: "Soporte Técnico",
            description: "Asesoría especializada antes, durante y después de tu compra."
          },
          {
            icon: "fa-solid fa-tag",
            title: "Mejores Precios",
            description: "Precios competitivos y descuentos especiales para proyectos."
          }
        ]);
      }, API_DELAY);
    });
    
    // Cuando tengas una API real, descomenta este código:
    /*
    try {
      const response = await axios.get(`${API_URL}/content/feature-cards`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el contenido de las tarjetas:', error);
      throw error;
    }
    */
  },
  
  // Nuevo método para obtener datos de categorías populares
  async getPopularCategoriesContent() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = [
          {
            name: "Automatización Industrial",
            image: "https://images.unsplash.com/photo-1581092160607-ee22731c2eaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          },
          {
            name: "Iluminación",
            image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          },
          {
            name: "Protección Eléctrica",
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          }
        ];
        
        // Generar slugs para cada categoría
        categories.forEach(category => {
          category.slug = generateSlug(category.name);
          category.link = `/categorias/${category.slug}`;
        });
        
        resolve(categories);
      }, API_DELAY);
    });
  },
  
  // Método para obtener productos destacados (adaptado para sistema de cotización)
  async getFeaturedProductsContent() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            code: "CT-25A-220V",
            name: "Contactor Tripolar 25A 220V",
            rating: 4.5,
            reviewCount: 28,
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            badge: "Destacado",
            badgeType: "featured",
            link: "/productos/contactor-tripolar-25a"
          },
          {
            id: 2,
            code: "ID-2x25A-30mA",
            name: "Interruptor Diferencial 2x25A 30mA",
            rating: 5,
            reviewCount: 42,
            image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            badge: "Nuevo",
            badgeType: "new",
            link: "/productos/interruptor-diferencial-2x25a"
          },
          {
            id: 3,
            code: "VF-2HP-220V",
            name: "Variador de Frecuencia 2HP 220V",
            rating: 4.8,
            reviewCount: 15,
            image: "https://images.unsplash.com/photo-1581092160607-ee22731c2eaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            badge: "Popular",
            badgeType: "hot",
            link: "/productos/variador-frecuencia-2hp"
          },
          {
            id: 4,
            code: "PL-60x60-45W",
            name: "Panel LED 60x60 45W Luz Fría",
            rating: 4.2,
            reviewCount: 36,
            image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            badge: "Eficiente",
            badgeType: "discount",
            link: "/productos/panel-led-60x60"
          }
        ]);
      }, API_DELAY);
    });
  },
  
  // Método para obtener las dimensiones recomendadas (útil para documentación o panel admin)
  getRecommendedImageDimensions() {
    return IMAGE_DIMENSIONS;
  }
};