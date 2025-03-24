const axios = require('axios');
const { Car } = require('./car-model');

/**
 * Service for handling OpenVerse API interactions
 */
class OpenVerseService {
    constructor() {
        this.api = axios.create({
            baseURL: 'https://api.openverse./v1',
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    /**
     * Search for cars using OpenVerse API
     * @param {string} query - Search query
     * @param {object} filters - Additional search filters
     * @returns {Promise<Array>} - Array of car results
     */
    async searchCars(query, filters = {}) {
        try {
            // Build search parameters
            const params = {
                q: this._buildSearchQuery(query, filters),
                page_size: 20,
                license_type: 'commercial',
                source: 'wikimedia,flickr', // Prioritize sources with car images
                category: 'vehicle'
            };

            // Perform API request
            const response = await this.api.get('/images/', { params });
            
            // Transform API results to car objects
            return this._transformResults(response.data.results, query, filters);
        } catch (error) {
            console.error('OpenVerse API search error:', error);
            throw error;
        }
    }
// Access token storage
accessToken = '';
    
// Function to get access token - this will use a direct fetch rather than axios
// since we're in a browser environment
async getAccessToken() {
    try {
        const response = await fetch('https://api.openverse.engineering/v1/auth_tokens/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: 'YOUR_CLIENT_ID',  // Replace with your actual client ID
                client_secret: 'YOUR_CLIENT_SECRET',  // Replace with your actual client secret
                grant_type: 'client_credentials'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.status}`);
        }
        
        const data = await response.json();
        this.accessToken = data.access_token;
        return this.accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}
 
    /**
     * Build search query string from parameters
     * @private
     */
    _buildSearchQuery(query, filters)
     {
        let searchQuery = query || '';
        
        if (filters.make) searchQuery += ` ${filters.make}`;
        if (filters.model) searchQuery += ` ${filters.model}`;
        if (filters.year) searchQuery += ` ${filters.year}`;
        if (filters.category && filters.category !== 'All Cars') {
            searchQuery += ` ${filters.category}`;
        }
        
        // Add vehicle-related keywords to improve results
        searchQuery += ' car vehicle automobile';
        
        return searchQuery.trim();
    }

    /**
     * Transform API results to car objects
     * @private
     */
    _transformResults(results, query, filters)
     {
        // Extract search terms to use in mapping results
        const searchTerms = (query || '').toLowerCase().split(' ');
        const makes = ['toyota', 'honda', 'ford', 'chevrolet', 'bmw', 'mercedes', 'audi', 'tesla', 'nissan', 'volkswagen'];
        const categories = ['sedan', 'suv', 'truck', 'hatchback', 'coupe', 'convertible', 'van', 'electric'];
        
        // Match potential make from search terms
        const matchedMake = searchTerms.find(term => makes.includes(term)) || 
                          filters.make || 
                          makes[Math.floor(Math.random() * makes.length)];
        
        // Match potential category from search terms
        const matchedCategory = searchTerms.find(term => categories.includes(term)) || 
                              filters.category || 
                              categories[Math.floor(Math.random() * categories.length)];
        
        return results.map(result => {
            // Generate realistic car data based on image metadata and search terms
            const title = result.title.toLowerCase();
            const make = matchedMake.charAt(0).toUpperCase() + matchedMake.slice(1);
            
            // Try to extract model from title or use generic model names
            let model = 'Model';
            const modelKeywords = ['series', 'civic', 'accord', 'camry', 'mustang', 'f-150', 'corolla', '3-series'];
            for (const keyword of modelKeywords) {
                if (title.includes(keyword)) {
                    model = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                    break;
                }
            }
            
            // Try to extract year or use a random recent year
            let year = null;
            const yearMatch = title.match(/\b(19|20)\d{2}\b/);
            if (yearMatch) {
                year = parseInt(yearMatch[0]);
            } else {
                // Random year between 2010 and 2024
                year = Math.floor(Math.random() * 15) + 2010;
            }
            
            // Generate a realistic price
            const basePrice = {
                'sedan': 25000,
                'suv': 35000,
                'truck': 40000,
                'hatchback': 22000,
                'coupe': 30000,
                'convertible': 45000,
                'van': 32000,
                'electric': 50000
            };
            
            // Adjust price based on make and year
            const makeMultiplier = {
                'bmw': 1.5,
                'mercedes': 1.6,
                'audi': 1.4,
                'tesla': 1.7
            };
            
            let price = basePrice[matchedCategory.toLowerCase()] || 30000;
            price = price * (makeMultiplier[make.toLowerCase()] || 1.0);
            
            // Adjust for year
            price = price * (0.85 + ((year - 2010) / 14) * 0.3);
            price = Math.round(price / 100) * 100;
            
            // Generate transmission type
            const transmissions = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'];
            const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
            
            return {
                id: result.id,
                openVerseId: result.id,
                make: make,
                model: model,
                year: year,
                category: matchedCategory.charAt(0).toUpperCase() + matchedCategory.slice(1),
                transmission: transmission,
                price: price,
                imageUrl: result.thumbnail || result.url,
                description: result.description || `${year} ${make} ${model} ${matchedCategory}`,
                features: this._generateFeatures(matchedCategory, year)
            };
        });
    }

    /**
     * Generate realistic car features based on category and year
     * @private
     */
    _generateFeatures(category, year) 
    {
        const baseFeatures = [
            'Air Conditioning',
            'Power Windows',
            'Power Steering',
            'AM/FM Radio'
        ];
        
        const modernFeatures = [
            'Bluetooth Connectivity',
            'USB Ports',
            'Backup Camera',
            'Keyless Entry'
        ];
        
        const luxuryFeatures = [
            'Leather Seats',
            'Heated Seats',
            'Sunroof',
            'Premium Sound System'
        ];
        
        const advancedFeatures = [
            'Lane Departure Warning',
            'Adaptive Cruise Control',
            'Blind Spot Monitoring',
            'Parking Assist'
        ];
        
        const features = [...baseFeatures];
        
        // Add features based on year
        if (year >= 2015) {
            features.push(...modernFeatures);
        }
        
        // Add luxury features randomly
        if (Math.random() > 0.5) {
            features.push(luxuryFeatures[Math.floor(Math.random() * luxuryFeatures.length)]);
        }
        
        // Add advanced features for newer cars
        if (year >= 2018) {
            features.push(advancedFeatures[Math.floor(Math.random() * advancedFeatures.length)]);
        }
        
        return features;
    }
    
    /**
     * Get detailed information for a specific car by ID
     */
    async getCarDetails(id) {
        try {
            // Check if car exists in database
            let car = await Car.findOne({ openVerseId: id });
            
            if (car) {
                return car;
            }
            
            // Fetch from OpenVerse API
            const response = await this.api.get(`/images/${id}/`);
            const result = response.data;
            
            // Transform to car object
            const cars = this._transformResults([result], '', {});
            
            if (cars.length > 0) {
                // Save to database for future queries
                car = new Car(cars[0]);
                await car.save();
                return car;
            }
            
            throw new Error('Car not found');
        } catch (error) {
            console.error('Get car details error:', error);
            throw error;
        }
    }
}

module.exports = new OpenVerseService();