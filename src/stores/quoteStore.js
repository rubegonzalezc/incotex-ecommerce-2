import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useQuoteStore = defineStore('quote', () => {
  // Estado
  const quoteItems = ref([]);
  const quoteStatus = ref('pending'); // pending, submitted, approved, rejected
  
  // Getters (computed)
  const quoteItemCount = computed(() => {
    return quoteItems.value.reduce((total, item) => total + item.quantity, 0);
  });
  
  // Ya no calculamos subtotal porque los precios serán cotizados
  const quoteSubtotal = computed(() => {
    // Solo calculamos si hay precios cotizados
    return quoteItems.value.reduce((total, item) => {
      return total + ((item.quotedPrice || 0) * item.quantity);
    }, 0);
  });
  
  // Acciones (methods)
  function addToQuote(product, quantity = 1) {
    const existingItem = quoteItems.value.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      quoteItems.value.push({
        id: product.id,
        name: product.name,
        sku: product.sku || '',
        image: product.image,
        quantity: quantity,
        notes: '',
        quotedPrice: null, // El precio será asignado cuando se cotice
        status: 'pending'  // Estado del ítem: pending, quoted, unavailable
      });
    }
  }
  
  function removeFromQuote(productId) {
    const index = quoteItems.value.findIndex(item => item.id === productId);
    if (index !== -1) {
      quoteItems.value.splice(index, 1);
    }
  }
  
  function updateQuoteItemQuantity(productId, quantity) {
    const item = quoteItems.value.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }
  
  function updateQuoteItemNotes(productId, notes) {
    const item = quoteItems.value.find(item => item.id === productId);
    if (item) {
      item.notes = notes;
    }
  }
  
  function clearQuote() {
    quoteItems.value = [];
    quoteStatus.value = 'pending';
  }
  
  function submitQuote() {
    // Aquí iría la lógica para enviar la cotización al backend
    quoteStatus.value = 'submitted';
    return {
      id: 'Q-' + Date.now(),
      items: [...quoteItems.value],
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
  }
  
  function formatPrice(price) {
    if (price === null || price === undefined) return 'Por cotizar';
    return price.toLocaleString('es-CL');
  }
  
  // Datos de ejemplo para simulación
  function loadSampleQuoteItems() {
    quoteItems.value = [
      {
        id: 1,
        name: 'Taladro Percutor Inalámbrico 20V',
        sku: 'TAL-2050',
        image: 'https://via.placeholder.com/60',
        quantity: 1,
        notes: 'Necesito que incluya dos baterías',
        quotedPrice: null,
        status: 'pending'
      },
      {
        id: 2,
        name: 'Set de Destornilladores Profesionales',
        sku: 'DEST-PRO-42',
        image: 'https://via.placeholder.com/60',
        quantity: 2,
        notes: '',
        quotedPrice: null,
        status: 'pending'
      }
    ];
  }
  
  // Cargar datos de ejemplo al iniciar
  loadSampleQuoteItems();
  
  return {
    quoteItems,
    quoteStatus,
    quoteItemCount,
    quoteSubtotal,
    addToQuote,
    removeFromQuote,
    updateQuoteItemQuantity,
    updateQuoteItemNotes,
    clearQuote,
    submitQuote,
    formatPrice
  };
});