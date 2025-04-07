// Servicio para manejar cotizaciones
import { productService } from './productService';
// import axios from 'axios'; // Descomentar cuando se implemente la API real

// Configuración para conexión con APIs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 segundos máximo de espera para respuestas de API
const API_DELAY = 1000; // Simular retraso de red de 1 segundo (solo para desarrollo)

export const quoteService = {
  // Obtener todas las cotizaciones del usuario
  async getQuotes() {
    try {
      // 1. Intentar obtener datos desde la API real
      // Descomentar este código cuando la API esté implementada
      /*
      const response = await axios.get(`${API_URL}/quotes`, {
        timeout: API_TIMEOUT,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      });
      
      if (response.status === 200) {
        // Guardar en caché local para acceso offline
        localStorage.setItem('user_quotes', JSON.stringify(response.data));
        return response.data;
      }
      */
      
      // 2. Si la API falla o no está implementada, obtener datos del localStorage
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            const storedQuotes = localStorage.getItem('user_quotes');
            const quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
            
            console.info('Usando datos de cotizaciones desde localStorage');
            resolve(quotes);
          } catch (error) {
            console.error('Error al obtener cotizaciones del localStorage:', error);
            resolve([]);
          }
        }, API_DELAY);
      });
    } catch (apiError) {
      console.warn('Error al obtener cotizaciones desde la API. Usando datos locales:', apiError);
      
      // Fallback a localStorage si la API falla
      try {
        const storedQuotes = localStorage.getItem('user_quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : [];
      } catch (localError) {
        console.error('Error al leer cotizaciones de localStorage:', localError);
        return [];
      }
    }
  },
  
  // Obtener una cotización específica por ID
  async getQuoteById(quoteId) {
    try {
      // 1. Intentar obtener desde la API
      /*
      const response = await axios.get(`${API_URL}/quotes/${quoteId}`, {
        timeout: API_TIMEOUT,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      });
      
      if (response.status === 200) {
        return response.data;
      }
      */
      
      // 2. Fallback: buscar en localStorage
      return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          try {
            const quotes = await this.getQuotes();
            const quote = quotes.find(q => q.id.toString() === quoteId.toString());
            
            if (quote) {
              resolve(quote);
            } else {
              reject(new Error('Cotización no encontrada'));
            }
          } catch (error) {
            reject(error);
          }
        }, API_DELAY / 2);
      });
    } catch (apiError) {
      console.warn('Error al obtener cotización desde la API. Buscando localmente:', apiError);
      
      // Buscar en datos locales
      const quotes = await this.getQuotes();
      const quote = quotes.find(q => q.id.toString() === quoteId.toString());
      
      if (quote) {
        return quote;
      } else {
        throw new Error('Cotización no encontrada');
      }
    }
  },
  
  // Guardar cotizaciones (persiste en API y localStorage)
  async saveQuotes(quotes) {
    try {
      // 1. Intentar guardar en la API
      /*
      const response = await axios.post(`${API_URL}/quotes/sync`, { quotes }, {
        timeout: API_TIMEOUT,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      });
      
      if (response.status === 200) {
        // Si la API acepta, también guardar en localStorage
        localStorage.setItem('user_quotes', JSON.stringify(quotes));
        return true;
      }
      */
      
      // 2. Si no hay API o falla, guardar solo en localStorage
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            localStorage.setItem('user_quotes', JSON.stringify(quotes));
            console.info('Cotizaciones guardadas en localStorage');
            resolve(true);
          } catch (error) {
            console.error('Error al guardar cotizaciones en localStorage:', error);
            resolve(false);
          }
        }, API_DELAY / 2);
      });
    } catch (apiError) {
      console.warn('Error al guardar cotizaciones en la API. Guardando localmente:', apiError);
      
      // Fallback: guardar solo en localStorage
      try {
        localStorage.setItem('user_quotes', JSON.stringify(quotes));
        return true;
      } catch (localError) {
        console.error('Error al guardar cotizaciones en localStorage:', localError);
        return false;
      }
    }
  },
  
  // Crear una nueva cotización
  async createQuote(quoteData) {
    try {
      // 1. Intentar crear en la API
      /*
      const response = await axios.post(`${API_URL}/quotes`, quoteData, {
        timeout: API_TIMEOUT,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      });
      
      if (response.status === 201) {
        // Actualizar el caché local
        const quotes = await this.getQuotes();
        quotes.unshift(response.data);
        localStorage.setItem('user_quotes', JSON.stringify(quotes));
        
        return response.data;
      }
      */
      
      // 2. Fallback: crear localmente
      return new Promise(async (resolve) => {
        setTimeout(async () => {
          try {
            // Obtener las cotizaciones existentes
            const quotes = await this.getQuotes();
            
            // Crear ID para la nueva cotización
            const quoteId = 'Q-' + Date.now();
            
            // Crear objeto de cotización
            const newQuote = {
              id: quoteId,
              date: new Date().toISOString(),
              status: 'pending',
              items: quoteData.items || [],
              notes: quoteData.notes || '',
              customer: quoteData.customer || {},
              comments: quoteData.comments || [],
              updatedAt: new Date().toISOString()
            };
            
            // Añadir a la lista de cotizaciones
            quotes.unshift(newQuote);
            
            // Guardar en localStorage
            await this.saveQuotes(quotes);
            
            console.info('Cotización creada localmente:', quoteId);
            resolve(newQuote);
          } catch (error) {
            console.error('Error al crear cotización:', error);
            resolve(null);
          }
        }, API_DELAY);
      });
    } catch (apiError) {
      console.warn('Error al crear cotización en la API. Creando localmente:', apiError);
      
      // Fallback: crear localmente
      try {
        const quotes = await this.getQuotes();
        
        const quoteId = 'Q-' + Date.now();
        const newQuote = {
          id: quoteId,
          date: new Date().toISOString(),
          status: 'pending',
          items: quoteData.items || [],
          notes: quoteData.notes || '',
          customer: quoteData.customer || {},
          comments: quoteData.comments || [],
          updatedAt: new Date().toISOString(),
          pendingSync: true // Marcar para sincronización futura
        };
        
        quotes.unshift(newQuote);
        await this.saveQuotes(quotes);
        
        return newQuote;
      } catch (localError) {
        console.error('Error al crear cotización localmente:', localError);
        return null;
      }
    }
  },
  
  // Actualizar una cotización existente
  async updateQuote(quoteId, updatedData) {
    try {
      // 1. Intentar actualizar en la API
      /*
      const response = await axios.put(`${API_URL}/quotes/${quoteId}`, updatedData, {
        timeout: API_TIMEOUT,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      });
      
      if (response.status === 200) {
        // Actualizar el caché local
        const quotes = await this.getQuotes();
        const index = quotes.findIndex(q => q.id.toString() === quoteId.toString());
        
        if (index !== -1) {
          quotes[index] = response.data;
          localStorage.setItem('user_quotes', JSON.stringify(quotes));
        }
        
        return response.data;
      }
      */
      
      // 2. Fallback: actualizar localmente
      return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          try {
            // Obtener las cotizaciones
            const quotes = await this.getQuotes();
            const quoteIndex = quotes.findIndex(q => q.id.toString() === quoteId.toString());
            
            if (quoteIndex === -1) {
              reject(new Error('Cotización no encontrada'));
              return;
            }
            
            // Actualizar la cotización
            quotes[quoteIndex] = {
              ...quotes[quoteIndex],
              ...updatedData,
              updatedAt: new Date().toISOString(),
              pendingSync: true // Marcar para sincronización futura
            };
            
            // Guardar en localStorage
            await this.saveQuotes(quotes);
            
            console.info('Cotización actualizada localmente:', quoteId);
            resolve(quotes[quoteIndex]);
          } catch (error) {
            console.error('Error al actualizar cotización:', error);
            reject(error);
          }
        }, API_DELAY);
      });
    } catch (apiError) {
      console.warn('Error al actualizar cotización en la API. Actualizando localmente:', apiError);
      
      // Fallback: actualizar localmente
      try {
        const quotes = await this.getQuotes();
        const index = quotes.findIndex(q => q.id.toString() === quoteId.toString());
        
        if (index === -1) {
          throw new Error('Cotización no encontrada');
        }
        
        quotes[index] = {
          ...quotes[index],
          ...updatedData,
          updatedAt: new Date().toISOString(),
          pendingSync: true
        };
        
        await this.saveQuotes(quotes);
        return quotes[index];
      } catch (localError) {
        console.error('Error al actualizar cotización localmente:', localError);
        throw localError;
      }
    }
  },
  
  // Función para sincronizar cotizaciones pendientes con el servidor
  // Útil para cuando la aplicación vuelve a estar online
  async syncPendingQuotes() {
    try {
      const quotes = await this.getQuotes();
      const pendingQuotes = quotes.filter(q => q.pendingSync);
      
      if (pendingQuotes.length === 0) {
        console.info('No hay cotizaciones pendientes de sincronización');
        return { success: true, synced: 0 };
      }
      
      // Aquí iría la lógica para sincronizar con la API
      console.info(`Sincronizando ${pendingQuotes.length} cotizaciones pendientes...`);
      
      // Simular sincronización
      const updatedQuotes = quotes.map(q => ({
        ...q,
        pendingSync: false // Marcar como sincronizado
      }));
      
      await this.saveQuotes(updatedQuotes);
      
      return {
        success: true,
        synced: pendingQuotes.length,
        message: `Se sincronizaron ${pendingQuotes.length} cotizaciones`
      };
    } catch (error) {
      console.error('Error al sincronizar cotizaciones pendientes:', error);
      return {
        success: false,
        synced: 0,
        message: 'Error al sincronizar cotizaciones'
      };
    }
  },
  
  // Generar datos de demostración para un usuario nuevo
  async generateSampleQuotes() {
    return new Promise(async (resolve) => {
      try {
        const existingQuotes = await this.getQuotes();
        
        // Si ya hay cotizaciones, no generar muestras
        if (existingQuotes.length > 0) {
          resolve(existingQuotes);
          return;
        }
        
        // Obtener productos para usar en las cotizaciones de muestra
        let products = [];
        try {
          products = await productService.getProducts();
        } catch (err) {
          console.warn('No se pudieron cargar productos para las cotizaciones de muestra:', err);
          // Crear productos ficticios si no se pueden obtener
          products = [
            { 
              id: 'p1', 
              name: 'Contactor Tripolar ABB', 
              sku: 'CTR-ABB-01',
              image: 'https://www.electromaterial.cl/wp-content/uploads/2021/01/AX09-30-10-80-300x300.jpg' 
            },
            { 
              id: 'p2', 
              name: 'Interruptor Diferencial', 
              sku: 'INT-DIF-02',
              image: 'https://www.se.com/cl/es/product/%7B%7Bitem.productUrlPath%7D%7D/image/C60H-DC.JPG' 
            }
          ];
        }
        
        // Cotizaciones de muestra
        const sampleQuotes = [];
        const today = new Date();
        
        // Cotización pendiente reciente
        sampleQuotes.push({
          id: 'Q-' + (Date.now() - 172800000), // 2 días atrás
          date: new Date(today.getTime() - 172800000).toISOString(),
          status: 'pending',
          items: [
            {
              id: products[0]?.id || 'p1',
              name: products[0]?.name || 'Contactor Tripolar ABB',
              code: products[0]?.sku || 'CTR-ABB-01',
              image: products[0]?.image || 'https://via.placeholder.com/100',
              quantity: 3,
              quotedPrice: null
            },
            {
              id: products.length > 1 ? products[1].id : 'p2',
              name: products.length > 1 ? products[1].name : 'Interruptor Diferencial',
              code: products.length > 1 ? products[1].sku : 'INT-DIF-02',
              image: products.length > 1 ? products[1].image : 'https://via.placeholder.com/100',
              quantity: 2,
              quotedPrice: null
            }
          ],
          comments: [
            {
              type: 'user',
              text: 'Necesito estos productos con urgencia, ¿podrían indicarme disponibilidad y tiempos de entrega?',
              date: new Date(today.getTime() - 172800000).toISOString()
            },
            {
              type: 'admin',
              text: 'Buen día. Estamos verificando stock de estos productos. Le enviaremos la cotización dentro de 24 horas.',
              date: new Date(today.getTime() - 86400000).toISOString() // 1 día atrás
            }
          ],
          updatedAt: new Date(today.getTime() - 86400000).toISOString()
        });
        
        // Cotización aprobada
        if (products.length >= 3) {
          sampleQuotes.push({
            id: 'Q-' + (Date.now() - 1296000000), // 15 días atrás
            date: new Date(today.getTime() - 1296000000).toISOString(),
            status: 'approved',
            items: [
              {
                id: products[2]?.id || 'p3',
                name: products[2]?.name || 'Sistema de Control Industrial',
                code: products[2]?.sku || 'SCI-03',
                image: products[2]?.image || 'https://via.placeholder.com/100',
                quantity: 1,
                quotedPrice: 85000,
                price: 85000
              }
            ],
            comments: [
              {
                type: 'user',
                text: 'Necesito este producto para un proyecto importante.',
                date: new Date(today.getTime() - 1296000000).toISOString()
              },
              {
                type: 'admin',
                text: 'Cotización aprobada. Hemos enviado los precios y condiciones a su correo electrónico.',
                date: new Date(today.getTime() - 1123200000).toISOString() // 13 días atrás
              }
            ],
            updatedAt: new Date(today.getTime() - 1123200000).toISOString()
          });
        }
        
        // Guardar cotizaciones de muestra
        await this.saveQuotes(sampleQuotes);
        resolve(sampleQuotes);
        
      } catch (error) {
        console.error('Error al generar cotizaciones de muestra:', error);
        resolve([]);
      }
    });
  },

  // Obtener estadísticas de cotizaciones
  async getQuoteStats() {
    return new Promise(async (resolve) => {
      try {
        const quotes = await this.getQuotes();
        
        const stats = {
          total: quotes.length,
          pending: quotes.filter(q => q.status === 'pending').length,
          approved: quotes.filter(q => q.status === 'approved').length,
          rejected: quotes.filter(q => q.status === 'rejected').length,
          recentActivity: quotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)
        };
        
        resolve(stats);
        
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        resolve({
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          recentActivity: []
        });
      }
    });
  }
};