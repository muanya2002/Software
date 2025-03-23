/**
 * Handles all search-related functionality
 */
class SearchHandler {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');
        this.filterChips = document.querySelectorAll('.filter-chip');
        this.resultsContainer = document.getElementById('carResults');
        
        this.activeFilters = {
            category: 'All Cars'
        };
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Search button click
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => this.performSearch());
        }
        
        // Search input enter key
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
        
        // Filter chip selection
        if (this.filterChips) {
            this.filterChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    // Toggle active state visually
                    this.filterChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    
                    // Update active filter
                    this.activeFilters.category = chip.textContent;
                    
                    // Perform search with new filter
                    this.performSearch();
                });
            });
        }
    }
    
    async performSearch() {
        if (!this.searchInput || !this.resultsContainer) return;
        
        const query = this.searchInput.value;
        
        // Convert UI filters to API format
        const filters = {};
        if (this.activeFilters.category && this.activeFilters.category !== 'All Cars') {
            filters.category = this.activeFilters.category;
        }
        
        // Show loading state
        this.resultsContainer.innerHTML = '<div class="loading">Searching for cars...</div>';
        
        try {
            const results = await api.searchCars(query, filters);
            this.displayResults(results);
        } catch (error) {
            this.resultsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Sorry, there was an error performing your search. Please try again.</p>
                </div>
            `;
            console.error('Search failed:', error);
        }
    }
    
    displayResults(results) {
        if (!this.resultsContainer) return;
        
        if (!results.cars || results.cars.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-car-side"></i>
                    <p>No cars found matching your search. Try different keywords or filters.</p>
                </div>
            `;
            return;
        }
        
        this.resultsContainer.innerHTML = '';
        
        results.cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            
            const isFavorite = api.isLoggedIn() && car.isFavorite;
            const favoriteIcon = isFavorite ? 
                '<i class="fas fa-heart favorite-icon active"></i>' : 
                '<i class="far fa-heart favorite-icon"></i>';
            
            carCard.innerHTML = `
                <div class="car-image">
                    <img src="${car.imageUrl || '/api/placeholder/300/200'}" alt="${car.make} ${car.model}">
                    ${favoriteIcon}
                </div>
                <div class="car-details">
                    <div class="car-title">${car.make} ${car.model} ${car.year}</div>
                    <div class="car-info">${car.category} • ${car.transmission} • $${car.price.toLocaleString()}</div>
                </div>
            `;
            
            // Add favorite functionality
            const favoriteIconEl = carCard.querySelector('.favorite-icon');
            if (favoriteIconEl) {
                favoriteIconEl.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    
                    if (!api.isLoggedIn()) {
                        window.location.href = './login.html';
                        return;
                    }
                    
                    try {
                        await api.saveFavorite(car.id);
                        favoriteIconEl.className = 'fas fa-heart favorite-icon active';
                    } catch (error) {
                        console.error('Failed to save favorite:', error);
                    }
                });
            }
            
            // Make entire card clickable for car details
            carCard.addEventListener('click', () => {
                // Navigate to car details page
                window.location.href = `car.html?id=${car.id}`;
            });
            
            this.resultsContainer.appendChild(carCard);
        });
    }
}