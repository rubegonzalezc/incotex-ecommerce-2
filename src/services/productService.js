// Servicio para manejar productos y categorías
// import axios from 'axios';

// Simulación de API para desarrollo
const API_DELAY = 1000; // Simular retraso de red de 1 segundo

// Agregar esta función de utilidad para generar slugs
const generateSlug = (text) => {
  return text
    .toString()
    .normalize('NFD')                // Normalizar acentos
    .replace(/[\u0300-\u036f]/g, '') // Quitar diacríticos
    .toLowerCase()
    .replace(/\s+/g, '-')           // Espacios a guiones
    .replace(/[^\w\-]+/g, '')       // Eliminar caracteres no alfanuméricos
    .replace(/\-\-+/g, '-')         // Reemplazar múltiples guiones por uno solo
    .trim();                         // Eliminar espacios al inicio y final
};

export const productService = {
  // Obtener todos los productos
  async getProducts() {
    // Simulamos una llamada a API con Promise
    return new Promise((resolve) => {
      setTimeout(() => {
        // Definimos los productos base
        const products = [
          {
            id: '1',
            name: 'Contactor Tripolar ABB AX09-30-10-80',
            sku: 'CTR-ABB-093010',
            description: 'Contactor tripolar ABB 9A 220V 50/60Hz. Ideal para aplicaciones industriales y sistemas de control automático.',
            priceMin: 65000,
            priceMax: 85000,
            cost: 45000,
            priceTier: 'Industrial',
            rating: 4.5,
            reviewCount: 12,
            image: 'https://www.electromaterial.cl/wp-content/uploads/2021/01/AX09-30-10-80-300x300.jpg',
            categoryId: '1',
            brandId: '2',
            stock: 35,
            technicalSpecs: 'Corriente nominal: 9A\nVoltaje de bobina: 220V AC\nFrecuencia: 50/60Hz\nContactos auxiliares: 1NO+1NC\nMontaje en riel DIN',
            pricingNotes: 'Aplicar descuentos para proyectos grandes. Verificar disponibilidad antes de cotizar.',
            requiresCustomQuote: false,
            badge: 'Disponible',
            badgeType: 'success',
            createdAt: '2023-10-15',
            featured: true
          },
          {
            id: '2',
            name: 'Interruptor Automático Schneider C60H-DC',
            sku: 'INT-SCH-C60HDC',
            description: 'Interruptor automático Schneider Electric para protección de circuitos DC. Ideal para instalaciones fotovoltaicas y sistemas de energía solar.',
            priceMin: 38000,
            priceMax: 55000,
            cost: 32000,
            priceTier: 'Estándar',
            rating: 5,
            reviewCount: 8,
            image: 'https://www.se.com/cl/es/product/%7B%7Bitem.productUrlPath%7D%7D/image/C60H-DC.JPG',
            categoryId: '2',
            brandId: '1',
            stock: 12,
            technicalSpecs: 'Corriente nominal: 10A\nCurva tipo C\nCapacidad de ruptura: 10kA\nNúmero de polos: 2\nTensión nominal: 500V DC',
            pricingNotes: 'Stock limitado, verificar disponibilidad',
            requiresCustomQuote: false,
            badge: 'Nuevo',
            badgeType: 'new',
            createdAt: '2023-11-05',
            featured: false
          },
          {
            id: '3',
            name: 'Sistema de Control Industrial Personalizado',
            sku: 'SIS-CTRL-CUSTOM',
            description: 'Sistema de control industrial personalizado según las necesidades específicas de cada cliente. Incluye diseño, programación y puesta en marcha.',
            priceMin: null,
            priceMax: null,
            cost: null,
            priceTier: 'Especializado',
            rating: 4.9,
            reviewCount: 6,
            image: 'https://new.siemens.com/global/en/products/automation/systems/industrial/plc/_jcr_content/root/responsivegrid/tabs/items/tab_912393233_copy_/tabPar/productcarouselteasers/productcarouselteaser/teaserbox/image.component.proportional.medium.jpg/1700570172404/simatic-s7-1500-cpu-1518f-4-pn-dp.jpg',
            categoryId: '3',
            brandId: '4',
            stock: 0,
            technicalSpecs: 'A definir según requerimientos del cliente',
            pricingNotes: 'Requiere levantamiento técnico antes de cotizar. Contactar al departamento de ingeniería.',
            requiresCustomQuote: true,
            badge: 'Cotizar',
            badgeType: 'info',
            createdAt: '2023-09-15',
            featured: true
          }
        ];
        
        // Generar slug para cada producto
        products.forEach(product => {
          // Solo generar slug si no existe ya
          if (!product.slug) {
            product.slug = generateSlug(product.name);
          }
        });
        
        resolve(products);
      }, API_DELAY);
    });
    
    // Cuando tengas una API real, descomenta este código:
    /*
    try {
      const response = await axios.get(`${API_URL}/products`);
      const products = response.data;
      
      // Generar slugs si es necesario
      products.forEach(product => {
        if (!product.slug) {
          product.slug = generateSlug(product.name);
        }
      });
      
      return products;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
    */
  },
  
  // Obtener un producto por su ID o slug
  async getProductById(idOrSlug) {
    // Simulación
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const products = await this.getProducts();
          
          // Buscar primero por ID
          let product = products.find(p => p.id === idOrSlug);
          
          // Si no se encuentra por ID, buscar por slug
          if (!product) {
            product = products.find(p => p.slug === idOrSlug);
          }
          
          if (product) {
            resolve(product);
          } else {
            reject(new Error('Producto no encontrado'));
          }
        } catch (error) {
          reject(error);
        }
      }, API_DELAY / 2);
    });
    
    // API Real
    /*
    try {
      // Intentar obtener por ID primero
      try {
        const response = await axios.get(`${API_URL}/products/${idOrSlug}`);
        return response.data;
      } catch (idError) {
        // Si falla, intentar buscar por slug
        const allProductsResponse = await axios.get(`${API_URL}/products`);
        const products = allProductsResponse.data;
        const product = products.find(p => p.slug === idOrSlug);
        
        if (product) {
          return product;
        } else {
          throw new Error('Producto no encontrado');
        }
      }
    } catch (error) {
      console.error(`Error al obtener el producto ${idOrSlug}:`, error);
      throw error;
    }
    */
  },
  
  // Obtener todas las categorías
  async getCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = [
          { id: '1', name: 'Contactores y Relés' },
          { id: '2', name: 'Protección Eléctrica' },
          { id: '3', name: 'Automatización' }
        ];
        
        // Añadir slugs a todas las categorías
        categories.forEach(category => {
          category.slug = generateSlug(category.name);
        });
        
        resolve(categories);
      }, API_DELAY);
    });
  },
  
  // Obtener todas las marcas
  async getBrands() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const brands = [
          { id: '1', name: 'Schneider Electric' },
          { id: '2', name: 'ABB' },
          { id: '3', name: 'Legrand' },
          { id: '4', name: 'Siemens' }
        ];
        
        // Añadir slugs a todas las marcas
        brands.forEach(brand => {
          brand.slug = generateSlug(brand.name);
        });
        
        resolve(brands);
      }, API_DELAY);
    });
  },
  
  // Buscar productos por término
  async searchProducts(term) {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          const products = await this.getProducts();
          const results = products.filter(p => 
            p.name.toLowerCase().includes(term.toLowerCase()) || 
            p.description.toLowerCase().includes(term.toLowerCase()) ||
            p.sku.toLowerCase().includes(term.toLowerCase())
          );
          resolve(results);
        } catch (error) {
          console.error('Error en búsqueda:', error);
          resolve([]);
        }
      }, API_DELAY);
    });
  },

  // Obtener categoría por slug o ID
  async getCategoryBySlugOrId(slugOrId) {
    try {
      const categories = await this.getCategories();
      
      // Primero intentar encontrar por slug
      let category = categories.find(cat => cat.slug === slugOrId);
      
      // Si no se encuentra por slug, intentar por ID
      if (!category) {
        category = categories.find(cat => cat.id.toString() === slugOrId);
      }
      
      return category;
    } catch (error) {
      console.error('Error al buscar categoría:', error);
      throw error;
    }
  },
  
  // Obtener marca por slug o ID
  async getBrandBySlugOrId(slugOrId) {
    try {
      const brands = await this.getBrands();
      
      // Primero intentar encontrar por slug
      let brand = brands.find(b => b.slug === slugOrId);
      
      // Si no se encuentra por slug, intentar por ID
      if (!brand) {
        brand = brands.find(b => b.id.toString() === slugOrId);
      }
      
      return brand;
    } catch (error) {
      console.error('Error al buscar marca:', error);
      throw error;
    }
  },
  
  // Obtener productos destacados
  async getFeaturedProducts() {
    return new Promise(async (resolve) => {
      try {
        const allProducts = await this.getProducts();
        const featured = allProducts.filter(p => p.featured === true);
        resolve(featured);
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
        resolve([]);
      }
    });
  },
  
  // Solicitar cotización de un producto
  async requestQuote(productData, customerData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulamos el envío de la solicitud de cotización
        console.log('Solicitud de cotización enviada:', { productData, customerData });
        
        // Generar un ID único para la solicitud
        const quoteId = 'COT-' + Math.floor(Math.random() * 10000);
        
        resolve({
          success: true,
          quoteId: quoteId,
          message: 'Su solicitud de cotización ha sido recibida. Le contactaremos a la brevedad.'
        });
      }, API_DELAY);
    });
  },
  
  // Obtener productos por categoría
  async getProductsByCategory(categoryId) {
    return new Promise(async (resolve) => {
      try {
        const allProducts = await this.getProducts();
        const filteredProducts = allProducts.filter(p => p.categoryId === categoryId);
        resolve(filteredProducts);
      } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        resolve([]);
      }
    });
  },
  
  // Obtener productos por marca
  async getProductsByBrand(brandId) {
    return new Promise(async (resolve) => {
      try {
        const allProducts = await this.getProducts();
        const filteredProducts = allProducts.filter(p => p.brandId === brandId);
        resolve(filteredProducts);
      } catch (error) {
        console.error('Error al obtener productos por marca:', error);
        resolve([]);
      }
    });
  }
};