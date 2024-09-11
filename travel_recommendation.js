// Fetch the JSON data from the external file
fetch('./travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the JSON data
    })
    .then(data => {
        // Call function to load the carousel with the fetched data
        loadCarousel(data);
    })
    .catch(error => {
        console.error('Error fetching the JSON data:', error);
    });

// Elements for carousel
const carouselContainer = document.querySelector('.carousel-inner');
const carouselIndicators = document.querySelector('.carousel-indicators');

// Function to populate carousel dynamically
function loadCarousel(data) {
    let carouselHTML = '';
    let indicatorsHTML = '';
    let isActiveClass = 'active';

    data.countries.forEach((country, countryIndex) => {
        country.cities.forEach((city, cityIndex) => {
            // Create carousel item content
            carouselHTML += `
              <div class="carousel-item ${isActiveClass}" data-bs-interval="5000">
                  <img src="${city.imageUrl}" class="d-block w-100" alt="${city.name}">
                  <div class="carousel-caption d-none d-md-block">
                      <h5>${city.name}</h5>
                      <p>${city.description}</p>
                  </div>
              </div>
            `;

            // Create carousel indicator buttons
            indicatorsHTML += `
              <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="${countryIndex + cityIndex}" class="${isActiveClass}" aria-label="Slide ${countryIndex + cityIndex + 1}"></button>
            `;

            // Remove the 'active' class for subsequent slides
            isActiveClass = '';
        });
    });

    // Insert generated HTML into carousel container and indicators
    carouselContainer.innerHTML = carouselHTML;
    carouselIndicators.innerHTML = indicatorsHTML;
}
