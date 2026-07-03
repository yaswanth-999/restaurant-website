// ===============================
// Terra Kitchen - Menu System
// ===============================

class MenuManager {
    constructor() {
        this.menuItems = [];
        this.filteredItems = [];
        this.currentCategory = "all";
    }

    async loadMenu() {

        try {

            const response = await apiCall("/menu");

            console.log("[MENU] API Response:", response);

            // Support multiple response formats
            this.menuItems =
                response.data ||
                response.menu ||
                response.items ||
                [];

            this.filteredItems = [...this.menuItems];

            this.renderMenu();

            this.setupFilterButtons();

        } catch (error) {

            console.error("[MENU] Failed to load menu:", error);

            const grid = document.getElementById("menu-grid");
            const empty = document.getElementById("menu-empty");

            if (grid) {
                grid.innerHTML = "";
            }

            if (empty) {
                empty.classList.remove("hidden");
            }

            showNotification(
                "Unable to load menu. Please try again later.",
                "error"
            );
        }
    }

    renderMenu() {

        const grid = document.getElementById("menu-grid");
        const empty = document.getElementById("menu-empty");

        if (!grid) {
            console.error("[MENU] menu-grid not found.");
            return;
        }

        if (this.filteredItems.length === 0) {

            grid.innerHTML = "";

            if (empty) {
                empty.classList.remove("hidden");
            }

            return;
        }

        if (empty) {
            empty.classList.add("hidden");
        }

        grid.innerHTML = this.filteredItems.map(item => `

            <div class="menu-item ${!item.available ? "menu-item-unavailable" : ""}">

                <img
                    src="${item.image || "/images/default-food.jpg"}"
                    alt="${item.name}"
                    class="menu-item-image"
                    onerror="this.src='/images/default-food.jpg'"
                >

                <div class="menu-item-content">

                    <div class="menu-item-header">

                        <h3 class="menu-item-name">
                            ${item.name}
                        </h3>

                        <span class="menu-item-price">
                            ${formatPrice(item.price)}
                        </span>

                    </div>

                    <p class="menu-item-description">
                        ${item.description || ""}
                    </p>

                    <div class="menu-item-meta">

                        <span class="menu-item-badge">
                            ${item.category || ""}
                        </span>

                        <span class="menu-item-badge">
                            ${item.prepTime || 0} mins
                        </span>

                        ${item.isVegetarian
                            ? '<span class="menu-item-badge vegetarian">Vegetarian</span>'
                            : ""
                        }

                        <span class="menu-item-badge">
                            ${item.spicyLevel || "Normal"}
                        </span>

                    </div>

                </div>

            </div>

        `).join("");

    }

    setupFilterButtons() {

        const buttons = document.querySelectorAll(".filter-btn");

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                buttons.forEach(btn =>
                    btn.classList.remove("active")
                );

                button.classList.add("active");

                this.filterByCategory(button.dataset.category);

            });

        });

    }

    filterByCategory(category) {

        this.currentCategory = category;

        if (category === "all") {

            this.filteredItems = [...this.menuItems];

        } else {

            this.filteredItems = this.menuItems.filter(item =>
                item.category === category
            );

        }

        this.renderMenu();

    }

}

const menuManager = new MenuManager();