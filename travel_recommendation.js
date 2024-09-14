document.addEventListener("DOMContentLoaded", () => {
    let headerDiv = document.getElementById("headline");
    let categoryDiv = document.getElementById("category");
    let descriptionDiv = document.getElementById("description");
    let showTimeZone = document.getElementById("showTimeZone");
    let buttonDiv = document.getElementById("bookBtn");
    const apiUrl = "./travel_recommendation_api.json";
    const types = ['beaches', 'countries', 'temples'];
    let destinations = [];
    let currentIndex = 0;
    let interval;

    if (!headerDiv || !categoryDiv || !descriptionDiv || !showTimeZone || !buttonDiv) {
        console.error("One or more required elements are missing.");
        return;
    }

    // Fetch data from the JSON file
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error response was not working');
            }
            return response.json();
        })
        .then(data => {
            types.forEach(type => {
                switch (type) {
                    case 'beaches':
                        destinations = destinations.concat(data.beaches.map(beach => ({
                            imageUrl: beach.imageUrl,
                            description: beach.description,
                            timeZone: beach.timeZone,
                            header: ` ${beach.name.split(',')[0]}`,
                            subHeader: ` ${beach.name.split(',')[1]}`,
                            category: beach.name.split(',')[1],
                            bookUrl: '#'
                        })));
                        break;
                    case 'countries':
                        data.countries.forEach(country => {
                            country.cities.forEach(city => {
                                destinations.push({
                                    imageUrl: city.imageUrl,
                                    description: city.description,
                                    timeZone: city.timeZone,
                                    header: ` ${city.name.split(',')[0]}`,
                                    subHeader: ` ${city.name.split(',')[1]}`,
                                    category: city.name.split(',')[1],
                                    bookUrl: '#'
                                });
                            });
                        });
                        break;
                    case 'temples':
                        destinations = destinations.concat(data.temples.map(temple => ({
                            imageUrl: temple.imageUrl,
                            description: temple.description,
                            timeZone: temple.timeZone,
                            header: ` ${temple.name.split(',')[0]}`,
                            subHeader: ` ${temple.name.split(',')[1]}`,
                            category: temple.name.split(',')[1],
                            bookUrl: '#'
                        })));
                        break;
                    default:
                        console.error('Unknown type:', type);
                        break;
                }
            });

            startSlideshow();
        })
        .catch(error => {
            console.log(error);
        });

    function startSlideshow() {
        const bodyElement = document.body;

        updateBackground();

        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % destinations.length;
            updateBackground();
        }, 6000);

        bodyElement.addEventListener("mouseover", () => {
            clearInterval(interval);
        });

        bodyElement.addEventListener("mouseout", () => {
            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % destinations.length;
                updateBackground();
            }, 3000);
        });
    }

    function updateBackground() {
        const bodyElement = document.body;
        const destination = destinations[currentIndex];
        bodyElement.style.backgroundImage = `linear-gradient(to right, rgba(2, 82, 89, 0.9), rgba(255, 255, 255, 0)), url(${destination.imageUrl})`;

        updateTime(destination.timeZone);
        headerDiv.innerHTML = `${destination.header}<br/>${destination.subHeader}`;
        categoryDiv.innerHTML = destination.category;
        descriptionDiv.innerHTML = destination.description;
        buttonDiv.innerHTML = `<a href="${destination.bookUrl}" id="demoAlert" class="btn" title="${destination.header}">Book Now</a>`;
        
        var bookId = document.getElementById('demoAlert');
        if(bookId) {
            bookId.addEventListener('click', (event) => {     
                event.preventDefault();
                alertDialog()
                console.log(`You clicked on ${bookId.header}`);
            });
            
        } else { 
            console.log(' Not triggered')
        }
    }

    function alertDialog() {
        alert('Booking confirmed!');
    }

    function updateTime(timeZone) {
        const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const localTime = new Date().toLocaleTimeString('en-US', options);

        showTimeZone.innerHTML = `<p>Local time: ${localTime}</p>`;
    }

    window.showAboutUs = function() {
        document.getElementById('aboutUsPopup').classList.add('popup-show');
        console.log('Show aboutUsPopup');
        // document.addEventListener('click', function(event) {
        //     if (event.target === document.getElementById('aboutUsPopup')) {
        //         closePopup();
        //     }
        // });
    };

    // Define the closePopup function
    window.closePopup = function(popUpId) {
        var popUp = document.getElementById(popUpId);
        if (popUp) {
            popUp.classList.remove("popup-show");
            console.log('Closing popup:', popUp);
        } else {
            console.log('Pop id not found');
        }
    };

    // Define placeholder functions for other links
    window.showHome = function() {
        closePopup();
        console.log('Home clicked');
    };

    window.showContactUs = function() {
        document.getElementById('contactUsPopup').classList.add('popup-show');
        console.log('Contact Us clicked');
    };

    document.getElementById("submitBtn").addEventListener("click", () => {
        alert("Message successfully sent!");
        console.log("Message successfully sent");    
    });

    // Search function
    function openSearchModal(results) {
        const resultsContainer = document.getElementById('modalResults');
        resultsContainer.innerHTML = ''; // Clear previous results
    
        results.forEach(destination => {
            const card = document.createElement('div');
            card.className = 'destination__card';
            card.innerHTML = `
                <img src="${destination.imageUrl}" alt="${destination.header}">
                <div class="card__content">
                    <h4>${destination.header}</h4>
                    <div style="font-size:18px; color: gray;"><i class="ri-map-2-line"></i> ${destination.subHeader}</div>
                    <p>${destination.description}</p>
                    <button class="btn" onclick="window.location.href='${destination.bookUrl}'">Book Now</button>
                </div><br/>
            `;
            resultsContainer.appendChild(card);
        });
    
        document.getElementById('searchModal').classList.remove('hidden'); // Show the modal
        document.getElementById('searchModal').classList.add('block'); // Ensure it's visible
    }
    
    // Function to close the modal
    document.getElementById('closeSearchResultModal').addEventListener("click", (e) => {
        e.preventDefault();
        const modal = document.getElementById('searchModal');
        modal.classList.remove('block'); // Remove block class
        modal.classList.add('hidden');   // Hide the modal
        console.log("Close search modal clicked");
    })
    
    // Sample test call for the modal with some mock data
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent page refresh on form submission
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
        // Mock example of filtering destinations based on search term
        const matchingDestinations = destinations.filter(dest => 
            dest.header.toLowerCase().includes(searchTerm) || 
            dest.subHeader.toLowerCase().includes(searchTerm)
        );
        
        if (matchingDestinations.length > 0) {
            openSearchModal(matchingDestinations);
        } else {
            alert('No matching destinations found.');
        }
    });
});

