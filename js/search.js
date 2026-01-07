// ====================
// SEARCH FUNCTIONALITY
// ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initSearch();
    initFilters();
    loadSampleHostels();
});

// Initialize search form
function initSearch() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                location: document.getElementById('location').value,
                gender: document.getElementById('gender').value,
                price: document.getElementById('price').value,
                type: document.getElementById('type').value
            };
            
            // Save search criteria to localStorage
            localStorage.setItem('lastSearch', JSON.stringify(formData));
            
            // Redirect to listings page with search parameters
            const params = new URLSearchParams(formData).toString();
            window.location.href = `listings.html?${params}`;
        });
    }
}

// Initialize filters on listings page
function initFilters() {
    const toggleFilters = document.getElementById('toggleFilters');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const searchInput = document.getElementById('searchInput');
    const priceSlider = document.querySelector('.price-slider');
    const priceValue = document.getElementById('priceValue');
    const sortSelect = document.getElementById('sortSelect');
    const resetSearch = document.getElementById('resetSearch');
    
    // Toggle filters on mobile
    if (toggleFilters && filtersSidebar) {
        toggleFilters.addEventListener('click', function() {
            filtersSidebar.style.display = filtersSidebar.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Price slider update
    if (priceSlider && priceValue) {
        priceSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            priceValue.textContent = `₨ ${value.toLocaleString()}`;
        });
    }
    
    // Apply filters
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            const filters = getCurrentFilters();
            filterHostels(filters);
            showToast('Filters applied successfully', 'success');
        });
    }
    
    // Reset filters
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            resetAllFilters();
            showToast('Filters reset', 'info');
        });
    }
    
    // Real-time search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchHostels(searchTerm);
        });
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortHostels(this.value);
        });
    }
    
    // Reset search
    if (resetSearch) {
        resetSearch.addEventListener('click', function() {
            resetAllFilters();
            searchInput.value = '';
            loadSampleHostels();
        });
    }
    
    // Load URL parameters
    loadUrlParameters();
}

// Get current filter values
function getCurrentFilters() {
    return {
        locations: Array.from(document.querySelectorAll('input[name="location"]:checked')).map(cb => cb.value),
        gender: document.querySelector('input[name="gender"]:checked')?.value || 'all',
        price: parseInt(document.querySelector('.price-slider')?.value) || 12000,
        rating: document.querySelector('input[name="rating"]:checked')?.value || 0,
        amenities: Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value),
        search: document.getElementById('searchInput')?.value || ''
    };
}

// Reset all filters
function resetAllFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Reset radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(rb => {
        if (rb.value === 'all' || rb.value === '0') {
            rb.checked = true;
        } else {
            rb.checked = false;
        }
    });
    
    // Reset price slider
    const priceSlider = document.querySelector('.price-slider');
    if (priceSlider) {
        priceSlider.value = 12000;
        const priceValue = document.getElementById('priceValue');
        if (priceValue) {
            priceValue.textContent = '₨ 12,000';
        }
    }
    
    // Reset search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reload hostels
    loadSampleHostels();
}

// Load URL parameters
function loadUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('location')) {
        const location = urlParams.get('location');
        const checkbox = document.querySelector(`input[name="location"][value="${location}"]`);
        if (checkbox) checkbox.checked = true;
    }
    
    if (urlParams.has('gender')) {
        const gender = urlParams.get('gender');
        const radio = document.querySelector(`input[name="gender"][value="${gender}"]`);
        if (radio) radio.checked = true;
    }
    
    if (urlParams.has('price')) {
        const price = urlParams.get('price');
        const priceSlider = document.querySelector('.price-slider');
        if (priceSlider) {
            priceSlider.value = price;
            const priceValue = document.getElementById('priceValue');
            if (priceValue) {
                priceValue.textContent = `₨ ${parseInt(price).toLocaleString()}`;
            }
        }
    }
    
    if (urlParams.has('type')) {
        const type = urlParams.get('type');
        // This would be used in a different filter setup
    }
}

// Sample hostel data
const sampleHostelsData = [
    {
        id: 'hv001',
        name: 'Green View Hostel',
        location: 'Model Town, Mirpur',
        price: 8000,
        rating: 4.5,
        reviews: 128,
        gender: 'male',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        amenities: ['wifi', 'ac', 'mess', 'security'],
        description: 'Comfortable hostel near MUST University'
    },
    {
        id: 'hv002',
        name: 'Rose Girls Hostel',
        location: 'University Road, Mirpur',
        price: 9500,
        rating: 5.0,
        reviews: 94,
        gender: 'female',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        amenities: ['wifi', 'ac', 'mess', 'laundry', 'security'],
        description: 'Exclusive girls hostel with premium facilities'
    },
    {
        id: 'hv003',
        name: 'City Central Hostel',
        location: 'City Center, Mirpur',
        price: 7000,
        rating: 4.0,
        reviews: 76,
        gender: 'both',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        amenities: ['wifi', 'tv', 'gym', 'parking'],
        description: 'Affordable hostel in city center'
    },
    {
        id: 'hv004',
        name: 'New City Hostel',
        location: 'New City, Mirpur',
        price: 8500,
        rating: 4.2,
        reviews: 52,
        gender: 'male',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
        amenities: ['wifi', 'ac', 'laundry'],
        description: 'Modern hostel in New City area'
    },
    {
        id: 'hv005',
        name: 'University Heights',
        location: 'University Road, Mirpur',
        price: 11000,
        rating: 4.7,
        reviews: 103,
        gender: 'both',
        image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80',
        amenities: ['wifi', 'ac', 'mess', 'gym', 'security'],
        description: 'Premium hostel with excellent facilities'
    },
    {
        id: 'hv006',
        name: 'Model Town Boys Hostel',
        location: 'Model Town, Mirpur',
        price: 6500,
        rating: 3.8,
        reviews: 45,
        gender: 'male',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        amenities: ['wifi', 'mess'],
        description: 'Budget-friendly boys hostel'
    }
];

// Load sample hostels
function loadSampleHostels() {
    const resultsContainer = document.getElementById('hostelResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    sampleHostelsData.forEach(hostel => {
        const hostelCard = createHostelCard(hostel);
        resultsContainer.appendChild(hostelCard);
    });
    
    // Hide no results message
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = 'none';
    }
}

// Create hostel card HTML
function createHostelCard(hostel) {
    const card = document.createElement('div');
    card.className = 'card hostel-card';
    card.dataset.id = hostel.id;
    
    // Determine gender badge
    let genderBadge = '';
    if (hostel.gender === 'male') {
        genderBadge = `<span class="gender-badge gender-male"><i class="fas fa-male"></i> Male Only</span>`;
    } else if (hostel.gender === 'female') {
        genderBadge = `<span class="gender-badge gender-female"><i class="fas fa-female"></i> Female Only</span>`;
    } else {
        genderBadge = `<span class="gender-badge gender-both"><i class="fas fa-user-friends"></i> Both Genders</span>`;
    }
    
    // Create amenities icons
    const amenitiesMap = {
        'wifi': '<i class="fas fa-wifi"></i>',
        'ac': '<i class="fas fa-snowflake"></i>',
        'mess': '<i class="fas fa-utensils"></i>',
        'security': '<i class="fas fa-shield-alt"></i>',
        'laundry': '<i class="fas fa-tshirt"></i>',
        'tv': '<i class="fas fa-tv"></i>',
        'gym': '<i class="fas fa-dumbbell"></i>',
        'parking': '<i class="fas fa-car"></i>'
    };
    
    const amenitiesIcons = hostel.amenities.map(amenity => 
        amenitiesMap[amenity] || `<i class="fas fa-check"></i>`
    ).slice(0, 4);
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${hostel.image}" alt="${hostel.name}" loading="lazy">
            <div class="image-overlay">
                <button class="wishlist-btn" aria-label="Add to wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <span class="image-count">4 photos</span>
            </div>
        </div>
        <div class="card-content">
            <h3 class="hostel-title">${hostel.name}</h3>
            <div class="hostel-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${hostel.location}</span>
            </div>
            <div class="rating">
                <div class="rating-stars">
                    ${generateStarRating(hostel.rating)}
                </div>
                <span class="rating-value">${hostel.rating}</span>
                <span class="rating-count">(${hostel.reviews} reviews)</span>
            </div>
            ${genderBadge}
            
            <div class="card-features">
                ${amenitiesIcons.map(icon => `
                    <div class="feature-item">
                        ${icon}
                        <span>${getAmenityName(icon)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="card-footer">
                <div class="hostel-price">
                    <span class="price-label">Starting from</span>
                    <span class="price-amount">₨ ${hostel.price.toLocaleString()}</span>
                    <span class="price-period">/month</span>
                </div>
                <a href="hostel-detail.html" class="btn btn-primary">
                    View Details <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
    
    // Add wishlist functionality
    const wishlistBtn = card.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
                showToast('Added to wishlist', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
                showToast('Removed from wishlist', 'info');
            }
        });
    }
    
    return card;
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Get amenity name from icon
function getAmenityName(iconHtml) {
    const map = {
        'fa-wifi': 'WiFi',
        'fa-snowflake': 'AC',
        'fa-utensils': 'Mess',
        'fa-shield-alt': 'Security',
        'fa-tshirt': 'Laundry',
        'fa-tv': 'TV',
        'fa-dumbbell': 'Gym',
        'fa-car': 'Parking'
    };
    
    for (const [key, value] of Object.entries(map)) {
        if (iconHtml.includes(key)) {
            return value;
        }
    }
    
    return 'Amenity';
}

// Filter hostels based on criteria
function filterHostels(filters) {
    const resultsContainer = document.getElementById('hostelResults');
    const noResults = document.getElementById('noResults');
    
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    const filteredHostels = sampleHostelsData.filter(hostel => {
        // Location filter
        if (filters.locations.length > 0) {
            const hostelLocation = hostel.location.toLowerCase();
            const matchesLocation = filters.locations.some(loc => 
                hostelLocation.includes(loc.toLowerCase())
            );
            if (!matchesLocation) return false;
        }
        
        // Gender filter
        if (filters.gender !== 'all' && hostel.gender !== filters.gender) {
            return false;
        }
        
        // Price filter
        if (hostel.price > filters.price) {
            return false;
        }
        
        // Rating filter
        if (parseFloat(filters.rating) > 0 && hostel.rating < parseFloat(filters.rating)) {
            return false;
        }
        
        // Amenities filter
        if (filters.amenities.length > 0) {
            const hasAllAmenities = filters.amenities.every(amenity => 
                hostel.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
        }
        
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch = 
                hostel.name.toLowerCase().includes(searchTerm) ||
                hostel.location.toLowerCase().includes(searchTerm) ||
                hostel.description.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }
        
        return true;
    });
    
    // Display results
    if (filteredHostels.length === 0) {
        resultsContainer.innerHTML = '';
        if (noResults) {
            noResults.style.display = 'block';
        }
    } else {
        filteredHostels.forEach(hostel => {
            const hostelCard = createHostelCard(hostel);
            resultsContainer.appendChild(hostelCard);
        });
        if (noResults) {
            noResults.style.display = 'none';
        }
    }
    
    // Update results count
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${filteredHostels.length} of ${sampleHostelsData.length} hostels`;
    }
}

// Search hostels by keyword
function searchHostels(searchTerm) {
    const filteredHostels = sampleHostelsData.filter(hostel => {
        return hostel.name.toLowerCase().includes(searchTerm) ||
               hostel.location.toLowerCase().includes(searchTerm) ||
               hostel.description.toLowerCase().includes(searchTerm);
    });
    
    displaySearchResults(filteredHostels);
}

// Sort hostels
function sortHostels(sortBy) {
    let sortedHostels = [...sampleHostelsData];
    
    switch(sortBy) {
        case 'price-low':
            sortedHostels.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedHostels.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedHostels.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // Assuming newer hostels have higher IDs
            sortedHostels.sort((a, b) => b.id.localeCompare(a.id));
            break;
        default:
            // Recommended (default order)
            break;
    }
    
    displaySearchResults(sortedHostels);
}

// Display search results
function displaySearchResults(hostels) {
    const resultsContainer = document.getElementById('hostelResults');
    const noResults = document.getElementById('noResults');
    
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (hostels.length === 0) {
        if (noResults) {
            noResults.style.display = 'block';
        }
    } else {
        hostels.forEach(hostel => {
            const hostelCard = createHostelCard(hostel);
            resultsContainer.appendChild(hostelCard);
        });
        if (noResults) {
            noResults.style.display = 'none';
        }
    }
}

// Initialize when page loads
if (document.getElementById('hostelResults')) {
    loadSampleHostels();
}