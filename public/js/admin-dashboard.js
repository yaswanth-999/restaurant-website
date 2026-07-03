// Terra Kitchen - Admin Dashboard

class AdminDashboard {
  constructor() {
    this.currentPage = 'dashboard';
    this.reservations = [];
    this.menuItems = [];
    this.contacts = [];
    this.init();
  }

  async init() {
    // Verify token
    if (!auth.isLoggedIn()) {
      window.location.href = '/admin-login.html';
      return;
    }

    // Load admin info
    this.loadAdminInfo();

    // Setup event listeners
    this.setupEventListeners();

    // Load data
    await this.loadData();

    console.log('[ADMIN] Dashboard initialized');
  }

  loadAdminInfo() {
    const admin = auth.getAdmin();
    if (admin) {
      document.getElementById('admin-name').textContent = admin.username;
      document.getElementById('admin-email').textContent = admin.email;
      document.getElementById('settings-username').textContent = admin.username;
      document.getElementById('settings-email').textContent = admin.email;
      document.getElementById('settings-role').textContent = admin.role || 'admin';
    }
  }

  setupEventListeners() {
    // Sidebar menu
    document.querySelectorAll('.menu-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        this.showPage(page);
      });
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        auth.logout();
      }
    });

    // Filter and search events
    document.getElementById('filter-date')?.addEventListener('change', () => this.filterReservations());
    document.getElementById('filter-status')?.addEventListener('change', () => this.filterReservations());
    document.getElementById('search-reservation')?.addEventListener('input', () => this.filterReservations());

    document.getElementById('filter-category')?.addEventListener('change', () => this.filterMenu());
    document.getElementById('search-menu')?.addEventListener('input', () => this.filterMenu());

    document.getElementById('filter-message-status')?.addEventListener('change', () => this.filterContacts());
    document.getElementById('search-contact')?.addEventListener('input', () => this.filterContacts());

    // Password form
    document.getElementById('password-form')?.addEventListener('submit', (e) => this.handlePasswordChange(e));
  }

  async loadData() {
    try {
      // Load reservations
      const resResponse = await apiCall('/reservations');
      this.reservations = resResponse.data || [];

      // Load menu items
      const menuResponse = await apiCall('/menu');
      this.menuItems = menuResponse.data || [];

      // Load contacts
      const contactResponse = await apiCall('/contact');
      this.contacts = contactResponse.data || [];

      // Update dashboard
      this.updateDashboard();
      this.renderReservations();
      this.renderMenu();
      this.renderContacts();
    } catch (error) {
      console.error('[ERROR] Failed to load data:', error);
      showNotification('Failed to load data', 'error');
    }
  }

  updateDashboard() {
    const totalRes = this.reservations.length;
    const pendingRes = this.reservations.filter(r => r.status === 'Pending').length;
    const confirmedRes = this.reservations.filter(r => r.status === 'Confirmed').length;
    const unreadMessages = this.contacts.filter(c => c.status === 'Unread').length;

    document.getElementById('total-reservations').textContent = totalRes;
    document.getElementById('pending-count').textContent = pendingRes;
    document.getElementById('confirmed-count').textContent = confirmedRes;
    document.getElementById('messages-count').textContent = unreadMessages;

    // Recent reservations
    const recentRes = this.reservations.slice(0, 5).map(r => `
      <div style="padding: 0.75rem 0; border-bottom: 1px solid #eee;">
        <strong>${r.name}</strong><br>
        <small>${formatDate(r.date)} at ${r.time}</small><br>
        <span class="badge ${r.status.toLowerCase()}">${r.status}</span>
      </div>
    `).join('');

    document.getElementById('recent-reservations').innerHTML = recentRes || '<p style="color: #999; text-align: center;">No reservations yet</p>';

    // Unread messages
    const unreadMsg = this.contacts.filter(c => c.status === 'Unread').slice(0, 5).map(c => `
      <div style="padding: 0.75rem 0; border-bottom: 1px solid #eee;">
        <strong>${c.name}</strong><br>
        <small>${c.email}</small><br>
        <small style="color: #999;">$(c.message.substring(0, 50))</small>
      </div>
    `).join('');

    document.getElementById('unread-messages').innerHTML = unreadMsg || '<p style="color: #999; text-align: center;">No messages</p>';
  }

  renderReservations() {
    const tbody = document.getElementById('reservations-tbody');
    if (this.reservations.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><p>No reservations found</p></td></tr>';
      return;
    }

    tbody.innerHTML = this.reservations.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.email}</td>
        <td>${r.phone}</td>
        <td>${formatDate(r.date)} ${r.time}</td>
        <td>${r.guests}</td>
        <td><span class="badge ${r.status.toLowerCase()}">${r.status}</span></td>
        <td><span class="badge ${r.paymentStatus === 'Completed' ? 'confirmed' : 'pending'}">${r.paymentStatus}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-sm edit" onclick="dashboard.editReservation('${r._id}')">Edit</button>
            <button class="btn-sm delete" onclick="dashboard.deleteReservation('${r._id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderMenu() {
    const tbody = document.getElementById('menu-tbody');
    if (this.menuItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>No menu items found</p></td></tr>';
      return;
    }

    tbody.innerHTML = this.menuItems.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${formatPrice(item.price)}</td>
        <td>${item.isVegetarian ? '✓' : '-'}</td>
        <td>${item.available ? '✓' : '✗'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-sm edit" onclick="dashboard.editMenuItem('${item._id}')">Edit</button>
            <button class="btn-sm delete" onclick="dashboard.deleteMenuItem('${item._id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderContacts() {
    const tbody = document.getElementById('contacts-tbody');
    if (this.contacts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>No messages found</p></td></tr>';
      return;
    }

    tbody.innerHTML = this.contacts.map(c => `
      <tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.message.substring(0, 50)}...</td>
        <td><span class="badge ${c.status.toLowerCase()}">${c.status}</span></td>
        <td>${formatDate(c.createdAt)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-sm edit" onclick="dashboard.viewContact('${c._id}')">View</button>
            <button class="btn-sm delete" onclick="dashboard.deleteContact('${c._id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  filterReservations() {
    const date = document.getElementById('filter-date').value;
    const status = document.getElementById('filter-status').value;
    const search = document.getElementById('search-reservation').value.toLowerCase();

    const filtered = this.reservations.filter(r => {
      if (date && r.date.split('T')[0] !== date) return false;
      if (status && r.status !== status) return false;
      if (search && !r.name.toLowerCase().includes(search) && !r.email.toLowerCase().includes(search)) return false;
      return true;
    });

    const tbody = document.getElementById('reservations-tbody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><p>No reservations found</p></td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.email}</td>
        <td>${r.phone}</td>
        <td>${formatDate(r.date)} ${r.time}</td>
        <td>${r.guests}</td>
        <td><span class="badge ${r.status.toLowerCase()}">${r.status}</span></td>
        <td><span class="badge ${r.paymentStatus === 'Completed' ? 'confirmed' : 'pending'}">${r.paymentStatus}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-sm edit" onclick="dashboard.editReservation('${r._id}')">Edit</button>
            <button class="btn-sm delete" onclick="dashboard.deleteReservation('${r._id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  filterMenu() {
    const category = document.getElementById('filter-category').value;
    const search = document.getElementById('search-menu').value.toLowerCase();

    const filtered = this.menuItems.filter(item => {
      if (category && item.category !== category) return false;
      if (search && !item.name.toLowerCase().includes(search)) return false;
      return true;
    });

    const tbody = document.getElementById('menu-tbody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>No menu items found</p></td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${formatPrice(item.price)}</td>
        <td>${item.isVegetarian ? '✓' : '-'}</td>
        <td>${item.available ? '✓' : '✗'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-sm edit" onclick="dashboard.editMenuItem('${item._id}')">Edit</button>
            <button class="btn-sm delete" onclick="dashboard.deleteMenuItem('${item._id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  filterContacts() {
    const status = document.getElementById('filter-message-status').value;
    const search = document.getElementById('search-contact').value.toLowerCase();

    const filtered = this.contacts.filter(c => {
      if (status && c.status !== status) return false;
      if (search && !c.name.toLowerCase().includes(search) && !c.email.toLowerCase().includes(search)) return false;
      return true;
    });

    const tbody = document.getElementById('contacts-tbody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><p>No messages found</p></td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.message.substring(0, 50)}...</td>
        <td><span class="badge ${c.status.toLowerCase()}">${c.status}</span></td>
        <td>${formatDate(c.createdAt)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-sm edit" onclick="dashboard.viewContact('${c._id}')">View</button>
            <button class="btn-sm delete" onclick="dashboard.deleteContact('${c._id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async editReservation(id) {
    const res = this.reservations.find(r => r._id === id);
    if (!res) return;

    const newStatus = prompt(`Change status from "${res.status}":\n\n1. Pending\n2. Confirmed\n3. Cancelled`, res.status);
    
    if (!newStatus || !['Pending', 'Confirmed', 'Cancelled'].includes(newStatus)) return;

    try {
      await apiCall(`/reservations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      showNotification('Reservation updated', 'success');
      await this.loadData();
    } catch (error) {
      showNotification('Failed to update reservation', 'error');
    }
  }

  async deleteReservation(id) {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    try {
      await apiCall(`/reservations/${id}`, { method: 'DELETE' });
      showNotification('Reservation deleted', 'success');
      await this.loadData();
    } catch (error) {
      showNotification('Failed to delete reservation', 'error');
    }
  }

  async editMenuItem(id) {
    const item = this.menuItems.find(m => m._id === id);
    if (!item) return;

    const newPrice = prompt('Enter new price (in ₹):', item.price);
    if (newPrice === null || isNaN(newPrice)) return;

    try {
      await apiCall(`/menu/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ price: parseFloat(newPrice) })
      });

      showNotification('Menu item updated', 'success');
      await this.loadData();
    } catch (error) {
      showNotification('Failed to update menu item', 'error');
    }
  }

  async deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await apiCall(`/menu/${id}`, { method: 'DELETE' });
      showNotification('Menu item deleted', 'success');
      await this.loadData();
    } catch (error) {
      showNotification('Failed to delete menu item', 'error');
    }
  }

  async viewContact(id) {
    const contact = this.contacts.find(c => c._id === id);
    if (!contact) return;

    alert(`Name: ${contact.name}\nEmail: ${contact.email}\nMessage:\n\n${contact.message}`);

    if (contact.status === 'Unread') {
      try {
        await apiCall(`/contact/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'Read' })
        });
        await this.loadData();
      } catch (error) {
        console.error('Failed to mark as read', error);
      }
    }
  }

  async deleteContact(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await apiCall(`/contact/${id}`, { method: 'DELETE' });
      showNotification('Message deleted', 'success');
      await this.loadData();
    } catch (error) {
      showNotification('Failed to delete message', 'error');
    }
  }

  async handlePasswordChange(e) {
    e.preventDefault();

    const current = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (newPass !== confirm) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (newPass.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      await apiCall('/admin/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword: current, newPassword: newPass })
      });

      showNotification('Password updated successfully', 'success');
      e.target.reset();
    } catch (error) {
      showNotification('Failed to update password', 'error');
    }
  }

  showPage(page) {
    this.currentPage = page;

    // Update sidebar
    document.querySelectorAll('.menu-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });

    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
      section.classList.remove('active');
    });

    const section = document.getElementById(page);
    if (section) {
      section.classList.add('active');
    }

    // Update title
    const titleMap = {
      dashboard: 'Dashboard',
      reservations: 'Manage Reservations',
      menu: 'Menu Items',
      contacts: 'Customer Messages',
      settings: 'Settings'
    };

    document.getElementById('page-title').textContent = titleMap[page] || 'Dashboard';
  }
}

// Initialize dashboard
const dashboard = new AdminDashboard();
