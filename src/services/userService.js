// Servicio para manejar usuarios, autenticación y datos de perfil
// import axios from 'axios'; // Descomentar cuando se implemente la API real

// Configuración para conexión con APIs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 segundos máximo de espera para respuestas de API
const API_DELAY = 1000; // Simular retraso de red de 1 segundo (solo para desarrollo)

// Nombre de las claves en localStorage
const USER_DATA_KEY = 'user_data';
const USER_TOKEN_KEY = 'user_token';
const USER_EMAIL_KEY = 'user_email';

export const userService = {
  // Verificar si el usuario está autenticado
  isAuthenticated() {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData !== null;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },

  // Verificar si el usuario es administrador
  isAdmin() {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      if (!userData) return false;
      
      const user = JSON.parse(userData);
      return user.isAdmin === true;
    } catch (error) {
      console.error('Error verificando permisos de administrador:', error);
      return false;
    }
  },

  // Obtener datos del usuario actual
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  },

  // Iniciar sesión
  async login(email, password, rememberMe = false) {
    try {
      // 1. Intentar login con la API real
      // Descomentar este código cuando la API esté implementada
      /*
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
        timeout: API_TIMEOUT
      });
      
      if (response.status === 200) {
        const userData = response.data;
        
        // Guardar datos del usuario y token
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData.user));
        localStorage.setItem(USER_TOKEN_KEY, userData.token);
        
        if (rememberMe) {
          localStorage.setItem(USER_EMAIL_KEY, email);
        } else {
          localStorage.removeItem(USER_EMAIL_KEY);
        }
        
        // Disparar evento para actualizar componentes
        window.dispatchEvent(new StorageEvent('storage', {
          key: USER_DATA_KEY,
          newValue: JSON.stringify(userData.user)
        }));
        
        return {
          success: true,
          user: userData.user
        };
      }
      */
      
      // 2. Login simulado (solo para desarrollo)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Verificar credenciales simuladas
          if (email === 'cliente@ejemplo.cl' && password === '123456') {
            // Usuario normal
            const userData = {
              email: email,
              firstName: 'Juan',
              lastName: 'Pérez',
              phone: '+56 9 8765 4321',
              token: 'simulated-jwt-token-' + Math.random().toString(36).substring(2),
              isAdmin: false
            };
            
            // Guardar en localStorage
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
            localStorage.setItem(USER_TOKEN_KEY, userData.token);
            
            if (rememberMe) {
              localStorage.setItem(USER_EMAIL_KEY, email);
            } else {
              localStorage.removeItem(USER_EMAIL_KEY);
            }
            
            // Disparar evento para actualizar componentes
            window.dispatchEvent(new StorageEvent('storage', {
              key: USER_DATA_KEY,
              newValue: JSON.stringify(userData)
            }));
            
            resolve({
              success: true,
              user: userData
            });
          } 
          // Verificar si es admin
          else if (email === 'admin@incotex.cl' && password === 'admin123') {
            // Administrador
            const adminData = {
              email: email,
              firstName: 'Admin',
              lastName: 'Incotex',
              phone: '+56 9 1234 5678',
              token: 'admin-jwt-token-' + Math.random().toString(36).substring(2),
              isAdmin: true
            };
            
            // Guardar en localStorage
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(adminData));
            localStorage.setItem(USER_TOKEN_KEY, adminData.token);
            
            if (rememberMe) {
              localStorage.setItem(USER_EMAIL_KEY, email);
            } else {
              localStorage.removeItem(USER_EMAIL_KEY);
            }
            
            // Disparar evento para actualizar componentes
            window.dispatchEvent(new StorageEvent('storage', {
              key: USER_DATA_KEY,
              newValue: JSON.stringify(adminData)
            }));
            
            resolve({
              success: true,
              user: adminData
            });
          }
          else {
            // Credenciales incorrectas
            reject({
              success: false,
              message: 'Correo electrónico o contraseña incorrectos'
            });
          }
        }, API_DELAY);
      });
    } catch (error) {
      console.error('Error en login:', error);
      throw {
        success: false,
        message: 'Error al iniciar sesión. Inténtalo nuevamente.'
      };
    }
  },

  // Cerrar sesión
  logout() {
    try {
      // Eliminar datos del usuario
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem(USER_TOKEN_KEY);
      
      // Mantener el email para "recordarme" si existe
      
      // Disparar evento para actualizar componentes
      window.dispatchEvent(new StorageEvent('storage', {
        key: USER_DATA_KEY,
        newValue: null
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, message: 'Error al cerrar sesión' };
    }
  },

  // Obtener email recordado
  getSavedEmail() {
    return localStorage.getItem(USER_EMAIL_KEY) || '';
  },

  // Actualizar información del perfil
  async updateProfile(profileData) {
    try {
      // 1. Intentar actualizar con la API real
      // Descomentar este código cuando la API esté implementada
      /*
      const token = localStorage.getItem(USER_TOKEN_KEY);
      
      const response = await axios.put(`${API_URL}/users/profile`, profileData, {
        timeout: API_TIMEOUT,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        // Actualizar datos en localStorage
        const currentUserData = this.getCurrentUser();
        const updatedUserData = { ...currentUserData, ...profileData };
        
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUserData));
        
        // Disparar evento para actualizar componentes
        window.dispatchEvent(new StorageEvent('storage', {
          key: USER_DATA_KEY,
          newValue: JSON.stringify(updatedUserData)
        }));
        
        return {
          success: true,
          user: updatedUserData
        };
      }
      */
      
      // 2. Actualización simulada (solo para desarrollo)
      return new Promise((resolve) => {
        setTimeout(() => {
          // Obtener datos actuales
          const currentUserData = this.getCurrentUser();
          
          // Actualizar solo los campos proporcionados
          const updatedUserData = { ...currentUserData, ...profileData };
          
          // Guardar en localStorage
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUserData));
          
          // Disparar evento para actualizar componentes
          window.dispatchEvent(new StorageEvent('storage', {
            key: USER_DATA_KEY,
            newValue: JSON.stringify(updatedUserData)
          }));
          
          resolve({
            success: true,
            user: updatedUserData
          });
        }, API_DELAY);
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw {
        success: false,
        message: 'Error al actualizar el perfil. Inténtalo nuevamente.'
      };
    }
  },

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      // 1. Intentar cambiar contraseña con la API real
      // Descomentar este código cuando la API esté implementada
      /*
      const token = localStorage.getItem(USER_TOKEN_KEY);
      
      const response = await axios.put(`${API_URL}/users/password`, {
        currentPassword,
        newPassword
      }, {
        timeout: API_TIMEOUT,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        return {
          success: true,
          message: 'Contraseña actualizada correctamente'
        };
      }
      */
      
      // 2. Cambio simulado (solo para desarrollo)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Verificar la contraseña actual (simulado)
          const user = this.getCurrentUser();
          
          // En un entorno real, esta verificación se haría en el servidor
          if (user.email === 'cliente@ejemplo.cl' && currentPassword === '123456') {
            resolve({
              success: true,
              message: 'Contraseña actualizada correctamente'
            });
          } else if (user.email === 'admin@incotex.cl' && currentPassword === 'admin123') {
            resolve({
              success: true,
              message: 'Contraseña actualizada correctamente'
            });
          } else {
            reject({
              success: false,
              message: 'La contraseña actual es incorrecta'
            });
          }
        }, API_DELAY);
      });
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw {
        success: false,
        message: error.message || 'Error al cambiar la contraseña. Inténtalo nuevamente.'
      };
    }
  },

  // Registrar un nuevo usuario
  async register(userData) {
    try {
      // 1. Intentar registro con la API real
      // Descomentar este código cuando la API esté implementada
      /*
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        timeout: API_TIMEOUT
      });
      
      if (response.status === 201) {
        // Si el registro incluye login automático
        if (response.data.token) {
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
          localStorage.setItem(USER_TOKEN_KEY, response.data.token);
          
          // Disparar evento para actualizar componentes
          window.dispatchEvent(new StorageEvent('storage', {
            key: USER_DATA_KEY,
            newValue: JSON.stringify(response.data.user)
          }));
        }
        
        return {
          success: true,
          user: response.data.user,
          message: 'Registro exitoso'
        };
      }
      */
      
      // 2. Registro simulado (solo para desarrollo)
      return new Promise((resolve) => {
        setTimeout(() => {
          // Crear datos de usuario con valores predeterminados
          const newUser = {
            ...userData,
            id: 'user-' + Date.now(),
            token: 'register-token-' + Math.random().toString(36).substring(2),
            isAdmin: false,
            createdAt: new Date().toISOString()
          };
          
          // En un registro real, normalmente iniciaríamos sesión automáticamente
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
          localStorage.setItem(USER_TOKEN_KEY, newUser.token);
          
          // Disparar evento para actualizar componentes
          window.dispatchEvent(new StorageEvent('storage', {
            key: USER_DATA_KEY,
            newValue: JSON.stringify(newUser)
          }));
          
          resolve({
            success: true,
            user: newUser,
            message: 'Registro exitoso'
          });
        }, API_DELAY);
      });
    } catch (error) {
      console.error('Error en registro:', error);
      throw {
        success: false,
        message: 'Error al registrar usuario. Inténtalo nuevamente.'
      };
    }
  },
  
  // Solicitar recuperación de contraseña
  async requestPasswordReset(email) {
    try {
      // 1. Intentar recuperación con la API real
      // Descomentar este código cuando la API esté implementada
      /*
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email }, {
        timeout: API_TIMEOUT
      });
      
      if (response.status === 200) {
        return {
          success: true,
          message: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña'
        };
      }
      */
      
      // 2. Simulación (solo para desarrollo)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña'
          });
        }, API_DELAY);
      });
    } catch (error) {
      console.error('Error solicitando recuperación de contraseña:', error);
      throw {
        success: false,
        message: 'Error al solicitar recuperación de contraseña. Inténtalo nuevamente.'
      };
    }
  }
};