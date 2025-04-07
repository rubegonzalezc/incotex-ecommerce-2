import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useQuoteStore = defineStore('quote', () => {
  // Estado - Cargar desde localStorage si existe
  const quoteItems = ref(loadQuoteItemsFromStorage());
  const quoteStatus = ref(localStorage.getItem('quoteStatus') || 'pending'); // pending, submitted, approved, rejected
  
  // Getters (computed)
  const quoteItemCount = computed(() => {
    return quoteItems.value.reduce((total, item) => total + item.quantity, 0);
  });
  
  const quoteSubtotal = computed(() => {
    // Solo calculamos si hay precios cotizados
    return quoteItems.value.reduce((total, item) => {
      return total + ((item.quotedPrice || 0) * item.quantity);
    }, 0);
  });
  
  // Función para cargar los items de cotización desde localStorage
  function loadQuoteItemsFromStorage() {
    try {
      const storedItems = localStorage.getItem('quoteItems');
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error loading quote items from localStorage:', error);
      return [];
    }
  }
  
  // Función para guardar los items de cotización en localStorage
  function saveQuoteItemsToStorage() {
    try {
      localStorage.setItem('quoteItems', JSON.stringify(quoteItems.value));
      localStorage.setItem('quoteStatus', quoteStatus.value);
    } catch (error) {
      console.error('Error saving quote items to localStorage:', error);
    }
  }
  
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
    
    // Guardar cambios en localStorage
    saveQuoteItemsToStorage();
  }
  
  function removeFromQuote(productId) {
    const index = quoteItems.value.findIndex(item => item.id === productId);
    if (index !== -1) {
      quoteItems.value.splice(index, 1);
      // Guardar cambios en localStorage
      saveQuoteItemsToStorage();
    }
  }
  
  function updateQuoteItemQuantity(productId, quantity) {
    const item = quoteItems.value.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      // Guardar cambios en localStorage
      saveQuoteItemsToStorage();
    }
  }
  
  function updateQuoteItemNotes(productId, notes) {
    const item = quoteItems.value.find(item => item.id === productId);
    if (item) {
      item.notes = notes;
      // Guardar cambios en localStorage
      saveQuoteItemsToStorage();
    }
  }
  
  function clearQuote() {
    quoteItems.value = [];
    quoteStatus.value = 'pending';
    // Limpiar localStorage
    localStorage.removeItem('quoteItems');
    localStorage.removeItem('quoteStatus');
  }
  
  function submitQuote() {
    // Actualizar estado
    quoteStatus.value = 'submitted';
    // Guardar cambios en localStorage
    saveQuoteItemsToStorage();
    
    return {
      id: 'Q-' + Date.now(),
      items: [...quoteItems.value],
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
  }
  
  function formatPrice(price) {
    if (price === null || price === undefined) return 'Por cotizar';
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(price);
  }
  
  // Observar cambios en quoteItems para sincronizar con localStorage automáticamente
  watch(quoteItems, () => {
    saveQuoteItemsToStorage();
  }, { deep: true });
  
  watch(quoteStatus, () => {
    localStorage.setItem('quoteStatus', quoteStatus.value);
  });
  
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