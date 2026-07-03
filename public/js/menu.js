// Terra Kitchen - Menu System

class MenuManager {
  constructor() {
    this.menuItems = [];
    this.filteredItems = [];
    this.currentCategory = 'all';
  }

  async loadMenu() {
    try {
      const response = await apiCall('/menu');
      this.menuItems = response.data || [];
      this.filteredItems = this.menuItems;
      this.renderMenu();
      this.setupFilterButtons();
    } catch (error) {
      console.error('[ERROR] Failed to load menu:', error);
      document.getElementById('menu-grid').innerHTML = '';
      document.getElementById('menu-empty').classList.remove('hidden');
    }
  }

  renderMenu() {
    const grid = document.getElementById('menu-grid');
    
    if (this.filteredItems.length === 0) {
      grid.innerHTML = '';
      document.getElementById('menu-empty').classList.remove('hidden');
      return;
    }

    document.getElementById('menu-empty').classList.add('hidden');
    grid.innerHTML = this.filteredItems.map(item => `
      <div class="menu-item ${!item.available ? 'menu-item-unavailable' : ''}">
        <img src="${item.image}" alt="${item.name}" class="menu-item-image">
        <div class="menu-item-content">
          <div class="menu-item-header">
            <h3 class="menu-item-name">${item.name}</h3>
            <span class="menu-item-price">${formatPrice(item.price)}</span>
          </div>
          <p class="menu-item-description">${item.description}</p>
          <div class="menu-item-meta">
            <span class="menu-item-badge">${item.category}</span>
            <span class="menu-item-badge">${item.prepTime} mins</span>
            ${item.isVegetarian ? '<span class="menu-item-badge vegetarian">Vegetarian</span>' : ''}
            <span class="menu-item-badge">${item.spicyLevel}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterByCategory(btn.dataset.category);
      });
    });
  }

  filterByCategory(category) {
    this.currentCategory = category;
    if (category === 'all') {
      this.filteredItems = this.menuItems;
    } else {
      this.filteredItems = this.menuItems.filter(item => item.category === category);
    }
    this.renderMenu();
  }
}

const menuManager = new MenuManager();
