/**
 * API service for handling all backend communication
 */
const api = {
    baseUrl: 'http://localhost:3000/api',
    
    // Authentication methods
    async registerUser(fullName, email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, email, password })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },
    
    async loginUser(email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    initiateOAuthLogin() {
        window.location.href = `${this.baseUrl}/auth/oauth/google`;
    },
    
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },
    
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    

    },
    
    // Search methods
    async searchCars(query, filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (query) queryParams.append('q', query);
            
            // Add filters to query params
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
            
            const response = await fetch(`${this.baseUrl}/search?${queryParams}`);
            return await response.json();
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    },
    
    // Favorites methods
    async saveFavorite(carId) {
        if (!this.isLoggedIn()) {
            throw new Error('You must be logged in to save favorites');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ carId })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Save favorite error:', error);
            throw error;
        }
    },
    
    async getFavorites() {
        if (!this.isLoggedIn()) {
            return [];
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/favorites`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            return await response.json();
        } catch (error) {
            console.error('Get favorites error:', error);
            throw error;
        }
    }
};
