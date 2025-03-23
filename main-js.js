/**
 * Main application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize search functionality
    const searchHandler = new SearchHandler();
    
    // Handle authentication state
    updateAuthUI();
    
    // Initialize menu functionality
    initializeSidebar();
    
    // Load initial car data
    searchHandler.performSearch();

     // Initialize enhanced user dropdown
     enhanceUserDropdown();
});

/**
 * Updates UI elements based on authentication state
 */
function updateAuthUI() {
    const isLoggedIn = api.isLoggedIn();
    const userSection = document.querySelector('.user-section');
    
    if (userSection) {
        if (isLoggedIn) {
            const user = api.getUser();
            userSection.innerHTML = `
                <i class="fas fa-bell"></i>
                <div class="user-dropdown">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="dropdown-content">
                        <div class="user-info">
                            <div class="user-name">${user.fullName}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                        <div class="dropdown-item">My Favorites</div>
                        <div class="dropdown-item">Profile Settings</div>
                        <div class="dropdown-item logout">Logout</div>
                    </div>
                </div>
            `;
            
            // Add logout handler
            const logoutButton = document.querySelector('.logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    // Add a confirmation if needed
            if (confirm('Are you sure you want to logout?')) {
                    api.logout();
                    window.location.href = './login.html';
                }
            });
            }
        } else {
            userSection.innerHTML = `
                <i class="fas fa-bell"></i>
                <a href="./login.html" id="loginButton"><i class="fas fa-user-circle"></i></a>
            `;
        }
    }
}

/**
 * Initialize sidebar functionality
 */
function initializeSidebar() {
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const body = document.body;
    
    // Create overlay element for mobile
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    body.appendChild(overlay);
    
    if (menuIcon && sidebar && mainContent) {
        // Handle sidebar toggle
        menuIcon.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                sidebar.classList.toggle('mobile-visible');
                overlay.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });
    }
     // Close sidebar when clicking overlay (mobile only)
     overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-visible');
        overlay.classList.remove('active');
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        } else {
            sidebar.classList.remove('mobile-visible');
            overlay.classList.remove('active');
        }
    });
}
    
    // Handle sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemText = item.querySelector('span').textContent;
            if (!itemText) return;
            
            // Close mobile sidebar after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-visible');
                overlay.classList.remove('active');
            }
            

            switch (itemText) {
                case 'Home':
                    window.location.href = './index.html';
                    break;
                case 'Favorites':
                    if (api.isLoggedIn()) {
                        window.location.href = 'favorites.html';
                    } else {
                        window.location.href = './login.html';
                    }
                    break;
                case 'Settings':
                    if (api.isLoggedIn()) {
                        window.location.href = 'settings.html';
                    } else {
                        window.location.href = './login.html';
                    }
                    break;
            }
        });
    });
    /* Enhanced user dropdown functionality
    */
   function enhanceUserDropdown() {
       const userDropdown = document.querySelector('.user-dropdown');
       const dropdownContent = document.querySelector('.dropdown-content');
       
       if (userDropdown && dropdownContent) {
           // Add click event for mobile (touch) devices
           userDropdown.addEventListener('click', (e) => {
               if (window.innerWidth <= 768) {
                   e.stopPropagation();
                   dropdownContent.classList.toggle('show');
               }
           });
           
           // Close dropdown when clicking elsewhere
           document.addEventListener('click', () => {
               if (window.innerWidth <= 768) {
                   dropdownContent.classList.remove('show');
               }
           });
       }
       
       // Enhance logout functionality
       const logoutButton = document.querySelector('.dropdown-item.logout');
       if (logoutButton) {
           logoutButton.addEventListener('click', () => {
               // Add a confirmation if needed
               if (confirm('Are you sure you want to logout?')) {
                   api.logout();
                   window.location.href = './index.html';
               }
           });
       }
   }   