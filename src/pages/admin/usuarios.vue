<template>
  <AdminLayout>
    <v-card>
      <v-card-title class="d-flex align-center py-4">
        <span class="text-h5">Gestión de Usuarios</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="userSearch"
          append-inner-icon="fa-solid fa-search"
          label="Buscar usuarios"
          hide-details
          density="compact"
          variant="outlined"
          class="max-width-search mr-2"
          style="max-width: 300px"
        ></v-text-field>
        <v-btn color="primary" prepend-icon="fa-solid fa-user-plus" @click="openNewUserDialog">
          Nuevo Usuario
        </v-btn>
      </v-card-title>
      
      <v-data-table
        :headers="userHeaders"
        :items="filteredUsers"
        :items-per-page="10"
        class="elevation-0"
      >
        <template v-slot:item.avatar="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="40" color="primary" variant="tonal">
              <v-img 
                v-if="item.avatar" 
                :src="item.avatar" 
                :alt="item.firstName"
              ></v-img>
              <span v-else class="text-white">{{ getInitials(item) }}</span>
            </v-avatar>
          </div>
        </template>
        
        <template v-slot:item.name="{ item }">
          <div>
            <div class="font-weight-medium">{{ item.firstName }} {{ item.lastName }}</div>
            <div class="text-caption text-grey">{{ item.email }}</div>
          </div>
        </template>
        
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            size="small"
          >
            {{ item.role }}
          </v-chip>
        </template>
        
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.active ? 'success' : 'error'"
            size="small"
            variant="outlined"
          >
            {{ item.active ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>
        
        <template v-slot:item.lastLogin="{ item }">
          {{ item.lastLogin ? formatDate(item.lastLogin) : 'Nunca' }}
        </template>
        
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-btn icon="fa-solid fa-edit" variant="text" color="primary" size="small" @click="editUser(item)"></v-btn>
            <v-btn 
              :icon="item.active ? 'fa-solid fa-ban' : 'fa-solid fa-check'" 
              variant="text" 
              :color="item.active ? 'warning' : 'success'" 
              size="small" 
              @click="toggleUserStatus(item)"
              :title="item.active ? 'Desactivar usuario' : 'Activar usuario'"
            ></v-btn>
            <v-btn icon="fa-solid fa-trash" variant="text" color="error" size="small" @click="confirmDeleteUser(item)"></v-btn>
          </div>
        </template>
      </v-data-table>

      <v-divider></v-divider>

      <v-card-actions class="justify-center pa-4">
        <v-pagination
          v-model="page"
          :length="Math.ceil(filteredUsers.length / 10)"
          :total-visible="7"
          rounded="circle"
        ></v-pagination>
      </v-card-actions>
    </v-card>

    <!-- Diálogo para nuevo/editar usuario -->
    <v-dialog v-model="userDialog" max-width="700px">
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white">
          {{ editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario' }}
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.firstName"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.lastName"
                  label="Apellido"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
                  type="email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.phone"
                  label="Teléfono"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.role"
                  :items="roles"
                  label="Rol"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-switch
                  v-model="editedItem.active"
                  color="success"
                  label="Usuario activo"
                  hide-details
                ></v-switch>
              </v-col>
              <v-col cols="12" v-if="editedIndex === -1">
                <v-alert
                  type="info"
                  variant="tonal"
                  border="start"
                  class="mb-0"
                >
                  <div class="text-body-2">
                    <strong>Nota:</strong> Al crear un nuevo usuario, se generará una contraseña temporal y se 
                    enviará por correo electrónico. El usuario deberá cambiarla en su primer inicio de sesión.
                  </div>
                </v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeUserDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveUser">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">¿Estás seguro de que quieres eliminar este usuario?</v-card-title>
        <v-card-text>
          Esta acción no se puede deshacer. Se eliminará el usuario <strong>{{ deleteItem.firstName }} {{ deleteItem.lastName }}</strong>.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteUser">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para desactivar/activar usuario -->
    <v-dialog v-model="statusDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          {{ statusItem.active ? '¿Desactivar usuario?' : '¿Activar usuario?' }}
        </v-card-title>
        <v-card-text>
          <p v-if="statusItem.active">
            Al desactivar este usuario, <strong>{{ statusItem.firstName }} {{ statusItem.lastName }}</strong> 
            no podrá iniciar sesión ni acceder al sistema hasta que sea reactivado.
          </p>
          <p v-else>
            Al activar este usuario, <strong>{{ statusItem.firstName }} {{ statusItem.lastName }}</strong> 
            podrá volver a iniciar sesión y acceder al sistema.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="statusDialog = false">Cancelar</v-btn>
          <v-btn 
            :color="statusItem.active ? 'warning' : 'success'" 
            variant="elevated" 
            @click="updateUserStatus"
          >
            {{ statusItem.active ? 'Desactivar' : 'Activar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminLayout from '@/components/admin/AdminLayout.vue';

// Datos para la tabla de usuarios
const userSearch = ref('');
const page = ref(1);

const userHeaders = [
  { title: 'Avatar', key: 'avatar', sortable: false, align: 'center', width: '60px' },
  { title: 'Nombre', key: 'name', align: 'start' },
  { title: 'Rol', key: 'role', align: 'center' },
  { title: 'Estado', key: 'status', align: 'center' },
  { title: 'Registro', key: 'createdAt', align: 'center' },
  { title: 'Último acceso', key: 'lastLogin', align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center', width: '120px' },
];

// Roles disponibles
const roles = ['Administrador', 'Vendedor', 'Cliente', 'Invitado'];

// Datos de usuarios
const users = ref([
  {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@incotexhv.cl',
    phone: '+56 9 8765 4321',
    role: 'Administrador',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    active: true,
    createdAt: new Date(2023, 1, 15),
    lastLogin: new Date(new Date().setHours(new Date().getHours() - 2)),
  },
  {
    id: 2,
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@incotexhv.cl',
    phone: '+56 9 1234 5678',
    role: 'Vendedor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    active: true,
    createdAt: new Date(2023, 3, 10),
    lastLogin: new Date(new Date().setHours(new Date().getHours() - 5)),
  },
  {
    id: 3,
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@incotexhv.cl',
    phone: '+56 9 5555 6666',
    role: 'Vendedor',
    avatar: '',
    active: true,
    createdAt: new Date(2023, 5, 20),
    lastLogin: new Date(new Date().setHours(new Date().getHours() - 12)),
  },
  {
    id: 4,
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@gmail.com',
    phone: '+56 9 3333 4444',
    role: 'Cliente',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    active: true,
    createdAt: new Date(2023, 8, 5),
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: 5,
    firstName: 'Pedro',
    lastName: 'Soto',
    email: 'pedro.soto@empresa.cl',
    phone: '+56 9 7777 8888',
    role: 'Cliente',
    avatar: '',
    active: false,
    createdAt: new Date(2023, 10, 15),
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 30)),
  },
  {
    id: 6,
    firstName: 'Laura',
    lastName: 'Díaz',
    email: 'laura.diaz@outlook.com',
    phone: '+56 9 2222 3333',
    role: 'Cliente',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    active: true,
    createdAt: new Date(2024, 0, 10),
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: 7,
    firstName: 'Roberto',
    lastName: 'Gómez',
    email: 'roberto.gomez@gmail.com',
    phone: '+56 9 4444 5555',
    role: 'Invitado',
    avatar: '',
    active: true,
    createdAt: new Date(2024, 2, 8),
    lastLogin: null,
  },
  {
    id: 8,
    firstName: 'Carmen',
    lastName: 'Vargas',
    email: 'carmen.vargas@empresa.cl',
    phone: '+56 9 8888 9999',
    role: 'Cliente',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    active: true,
    createdAt: new Date(2024, 1, 22),
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: 9,
    firstName: 'Luis',
    lastName: 'Morales',
    email: 'luis.morales@incotexhv.cl',
    phone: '+56 9 6666 7777',
    role: 'Administrador',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    active: true,
    createdAt: new Date(2023, 4, 5),
    lastLogin: new Date(new Date().setHours(new Date().getHours() - 1)),
  },
  {
    id: 10,
    firstName: 'Sofía',
    lastName: 'Rojas',
    email: 'sofia.rojas@gmail.com',
    phone: '+56 9 9999 0000',
    role: 'Cliente',
    avatar: '',
    active: false,
    createdAt: new Date(2023, 11, 12),
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 45)),
  },
  {
    id: 11,
    firstName: 'Diego',
    lastName: 'Navarro',
    email: 'diego.navarro@empresa.cl',
    phone: '+56 9 1111 2222',
    role: 'Cliente',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    active: true,
    createdAt: new Date(2024, 2, 1),
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: 12,
    firstName: 'Valentina',
    lastName: 'Castro',
    email: 'valentina.castro@incotexhv.cl',
    phone: '+56 9 3333 2222',
    role: 'Vendedor',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    active: true,
    createdAt: new Date(2023, 9, 8),
    lastLogin: new Date(new Date().setHours(new Date().getHours() - 4)),
  }
]);

// Usuarios filtrados según la búsqueda
const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value;
  
  const searchTerm = userSearch.value.toLowerCase();
  return users.value.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm) ||
    user.lastName.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm)
  );
});

// Estado de los diálogos
const userDialog = ref(false);
const deleteDialog = ref(false);
const statusDialog = ref(false);

// Items editados/seleccionados
const editedIndex = ref(-1);
const editedItem = ref({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Cliente',
  avatar: '',
  active: true,
  createdAt: new Date(),
  lastLogin: null
});
const defaultItem = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Cliente',
  avatar: '',
  active: true,
  createdAt: new Date(),
  lastLogin: null
};
const deleteItem = ref({});
const statusItem = ref({});

// Métodos
const formatDate = (date) => {
  if (!date) return 'Nunca';
  
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hoy, ' + new Date(date).toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diffDays === 1) {
    return 'Ayer, ' + new Date(date).toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    return new Date(date).toLocaleDateString('es-CL', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
};

const getInitials = (user) => {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
};

const getRoleColor = (role) => {
  switch (role) {
    case 'Administrador': return 'deep-purple';
    case 'Vendedor': return 'indigo';
    case 'Cliente': return 'teal';
    case 'Invitado': return 'grey';
    default: return 'primary';
  }
};

const openNewUserDialog = () => {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
  userDialog.value = true;
};

const editUser = (item) => {
  editedIndex.value = users.value.findIndex(u => u.id === item.id);
  editedItem.value = { ...item };
  userDialog.value = true;
};

const closeUserDialog = () => {
  userDialog.value = false;
  // Esperar a que la animación del diálogo termine
  setTimeout(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  }, 300);
};

const saveUser = () => {
  // Validación básica
  if (!editedItem.value.firstName || !editedItem.value.lastName || !editedItem.value.email) {
    alert('Por favor complete los campos requeridos');
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editedItem.value.email)) {
    alert('Por favor ingrese un email válido');
    return;
  }

  if (editedIndex.value > -1) {
    // Actualizar usuario existente
    Object.assign(users.value[editedIndex.value], editedItem.value);
  } else {
    // Crear nuevo usuario
    const newId = Math.max(0, ...users.value.map(u => u.id)) + 1;
    users.value.push({
      ...editedItem.value,
      id: newId,
      createdAt: new Date(),
      lastLogin: null
    });
  }
  
  closeUserDialog();
};

const confirmDeleteUser = (item) => {
  deleteItem.value = item;
  deleteDialog.value = true;
};

const deleteUser = () => {
  const index = users.value.findIndex(u => u.id === deleteItem.value.id);
  users.value.splice(index, 1);
  deleteDialog.value = false;
};

const toggleUserStatus = (item) => {
  statusItem.value = { ...item };
  statusDialog.value = true;
};

const updateUserStatus = () => {
  const index = users.value.findIndex(u => u.id === statusItem.value.id);
  if (index !== -1) {
    users.value[index].active = !users.value[index].active;
  }
  statusDialog.value = false;
};
</script>

<style scoped>
.max-width-search {
  max-width: 300px;
}
</style>