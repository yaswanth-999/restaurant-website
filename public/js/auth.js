// Terra Kitchen - Authentication

class AuthManager {
  constructor() {
    this.token = localStorage.getItem('adminToken');
    this.admin = JSON.parse(localStorage.getItem('admin')) || null;
  }

  async login(username, password) {
    const response = await apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (response.success) {
      this.token = response.token;
      this.admin = response.admin;
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('admin', JSON.stringify(response.admin));
      return true;
    }
    return false;
  }

  logout() {
    this.token = null;
    this.admin = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = '/admin.html';
  }

  isLoggedIn() {
    return !!this.token;
  }

  async verifyToken() {
    if (!this.token) return false;
    
    try {
      const response = await apiCall('/admin/verify-token', {
        method: 'POST'
      });
      return response.success;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  getToken() {
    return this.token;
  }

  getAdmin() {
    return this.admin;
  }
}

const auth = new AuthManager();
