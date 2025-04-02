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
        resolve([
          {
            id: '1',
            name: 'Contactor Tripolar 32A 220V',
            code: 'CT-3220',
            description: 'Contactor tripolar de 32A con bobina de 220V para aplicaciones industriales.',
            price: 45000,
            rating: 4.5,
            reviewCount: 12,
            image: 'https://images.unsplash.com/photo-1621319332247-ce870cdad56c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
            categoryId: '1',
            brandId: '1',
            badge: '-15%',
            badgeType: 'discount',
            createdAt: '2023-10-15'
          },
          {
            id: '2',
            name: 'Interruptor Diferencial 2x25A 30mA',
            code: 'ID-2530',
            description: 'Interruptor diferencial bipolar de 25A con sensibilidad de 30mA para protección contra fugas eléctricas.',
            price: 28500,
            rating: 5,
            reviewCount: 23,
            image: 'https://images.unsplash.com/photo-1589697547048-962940985015?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
            categoryId: '2',
            brandId: '2',
            badge: 'Nuevo',
            badgeType: 'new',
            createdAt: '2023-11-05'
          },
          {
            id: '3',
            name: 'Panel LED 60x60 45W 4000K',
            code: 'PL-6045',
            description: 'Panel LED de 60x60cm con 45W de potencia y luz neutra (4000K) para iluminación de oficinas y comercios.',
            price: 32000,
            rating: 4,
            reviewCount: 18,
            image: 'https://images.unsplash.com/photo-1615802069019-342a3a4ae255?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            categoryId: '3',
            brandId: '3',
            createdAt: '2023-09-20'
          },
          {
            id: '4',
            name: 'Fuente de Alimentación 24V 5A',
            code: 'FA-2405',
            description: 'Fuente de alimentación industrial de 24V DC y 5A para automatización y control.',
            price: 38500,
            rating: 4.8,
            reviewCount: 9,
            image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            categoryId: '4',
            brandId: '4',
            badge: 'Destacado',
            badgeType: 'featured',
            createdAt: '2023-10-08'
          },
          {
            id: '5',
            name: 'Cable Eléctrico 2.5mm² (100m)',
            code: 'CE-25100',
            description: 'Rollo de cable eléctrico de 2.5mm² de sección con 100 metros de longitud.',
            price: 22000,
            rating: 4.2,
            reviewCount: 31,
            image: 'https://images.unsplash.com/photo-1601084881623-cdf9a8ea242c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
            categoryId: '5',
            brandId: '5',
            createdAt: '2023-08-15'
          },
          {
            id: '6',
            name: 'Térmico Tripolar 32A Curva C',
            code: 'TT-32C',
            description: 'Interruptor termomagnético tripolar de 32A con curva C para protección de circuitos eléctricos.',
            price: 18500,
            rating: 4.7,
            reviewCount: 15,
            image: 'https://images.unsplash.com/photo-1589753345288-e811b0aa8f18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
            categoryId: '2',
            brandId: '1',
            createdAt: '2023-09-05'
          },
          {
            id: '7',
            name: 'Tablero Modular 24 Módulos',
            code: 'TM-24M',
            description: 'Tablero modular para 24 módulos con puerta y riel DIN, ideal para instalaciones eléctricas residenciales.',
            price: 42000,
            rating: 4.4,
            reviewCount: 7,
            image: 'https://images.unsplash.com/photo-1568654360516-7a3aff4c3b4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            categoryId: '6',
            brandId: '2',
            badge: 'Hot',
            badgeType: 'hot',
            createdAt: '2023-11-10'
          },
          {
            id: '8',
            name: 'Sensor de Movimiento 360°',
            code: 'SM-360',
            description: 'Sensor de movimiento de techo con detección de 360° y ajuste de tiempo y luminosidad.',
            price: 16800,
            rating: 4.1,
            reviewCount: 22,
            image: 'https://images.unsplash.com/photo-1585123388867-3bfe7f9e3e61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            categoryId: '7',
            brandId: '3',
            createdAt: '2023-10-02'
          },
          // Agregamos más productos
          {
            id: '9',
            name: 'PLC Modular Expandible',
            code: 'PLC-ME',
            description: 'Controlador lógico programable con entradas y salidas expandibles.',
            price: 89000,
            rating: 4.9,
            reviewCount: 6,
            image: 'https://images.unsplash.com/photo-1563770660941-3bbce274d3b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            categoryId: '4',
            brandId: '6',
            badge: 'Nuevo',
            badgeType: 'new',
            createdAt: '2023-11-15'
          },
          {
            id: '10',
            name: 'Luminaria Industrial LED 150W',
            code: 'LI-150',
            description: 'Luminaria industrial de alta eficiencia con 150W de potencia y 15000lm.',
            price: 78500,
            rating: 4.6,
            reviewCount: 11,
            image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            categoryId: '3',
            brandId: '7',
            createdAt: '2023-09-11'
          },
          {
            id: '11',
            name: 'Variador de Frecuencia 2.2kW',
            code: 'VF-22',
            description: 'Variador de frecuencia trifásico de 2.2kW para control de motores.',
            price: 125000,
            rating: 4.7,
            reviewCount: 14,
            image: 'https://images.unsplash.com/photo-1607148891220-8528c2148c0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            categoryId: '1',
            brandId: '4',
            badge: '-10%',
            badgeType: 'discount',
            createdAt: '2023-10-20'
          },
          {
            id: '12',
            name: 'Canaleta PVC 40x25mm (2m)',
            code: 'C-4025',
            description: 'Canaleta de PVC para cableado eléctrico de 40x25mm en tramos de 2 metros.',
            price: 3200,
            rating: 4.3,
            reviewCount: 28,
            image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
            categoryId: '5',
            brandId: '5',
            createdAt: '2023-08-20'
          }
        ]);
      }, API_DELAY);
    });
    
    // Cuando tengas una API real, descomenta este código:
    /*
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
    */
  },
  
  // Obtener un producto por su ID
  async getProductById(id) {
    // Simulación
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const products = await this.getProducts();
          const product = products.find(p => p.id === id);
          
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
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el producto ${id}:`, error);
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
          { id: '3', name: 'Iluminación' },
          { id: '4', name: 'Automatización' },
          { id: '5', name: 'Cables y Accesorios' },
          { id: '6', name: 'Tableros Eléctricos' },
          { id: '7', name: 'Sensores y Controles' }
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
        resolve([
          { id: '1', name: 'Schneider Electric' },
          { id: '2', name: 'ABB' },
          { id: '3', name: 'Philips' },
          { id: '4', name: 'Siemens' },
          { id: '5', name: 'Legrand' },
          { id: '6', name: 'Allen-Bradley' },
          { id: '7', name: 'Osram' }
        ]);
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
            p.code.toLowerCase().includes(term.toLowerCase())
          );
          resolve(results);
        } catch (error) {
          console.error('Error en búsqueda:', error);
          resolve([]);
        }
      }, API_DELAY);
    });
  },

  // Añadir este método al productService
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
  }
};