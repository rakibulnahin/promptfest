const hero = document.getElementById('hero');
const formWrapper = document.getElementById('formWrapper');

function updateHeroOnScroll() {
    const heroRect = hero.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // how far we scrolled past the bottom of the hero's original area
    const distancePast = viewportHeight * 0.6 - heroRect.bottom;

    if (distancePast > 0) {
        hero.classList.add('hero-scrolled');
    } else {
        hero.classList.remove('hero-scrolled');
    }
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                formWrapper.classList.add('visible');
            }
        });
    },
    {
        threshold: 0.3,
    }
);

observer.observe(formWrapper);

window.addEventListener('scroll', updateHeroOnScroll, { passive: true });
window.addEventListener('load', updateHeroOnScroll);



document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('inquiryForm');
            const messageBox = document.getElementById('messageBox');
            const responseDiv = document.getElementById('response');        
            // Sample JSON data mimicking an API response
            const API_URL = 'https://raw.githubusercontent.com/rakibulnahin/promptfest/refs/heads/main/data.json';
            console.log(API_URL);
            
            const MAX_RETRIES = 5;

            // Helper function for exponential backoff delay
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            /**
             * Fetches data with exponential backoff retry logic.
             * @param {string} url The URL to fetch.
             * @param {number} retries The number of times to retry.
             * @returns {Promise<Array>} The parsed JSON data.
             */
            async function fetchWithRetry(url, retries = MAX_RETRIES) {
                for (let i = 0; i < retries; i++) {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return await response.json();
                    } catch (error) {
                        if (i === retries - 1) {
                            console.error("Fetch failed permanently after retries:", error);
                            throw error; // Re-throw the error to be caught by the caller
                        }
                        const backoffTime = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s, 16s
                        // console.log(`Retry attempt ${i + 1} failed. Retrying in ${backoffTime / 1000}s...`);
                        await delay(backoffTime);
                    }
                }
            }

            console.log()

            // Function to render the results into the response div
            const renderResults = (results) => {
                // Clear existing content except for the header
                responseDiv.innerHTML = '<h2 class="w-full text-2xl font-bold text-slate-700 mb-2 text-left">Available Listings:</h2>'; 
                
                results.forEach(item => {
                    const card = document.createElement('div');
                    // w-full on small screens, w-[calc(50%-8px)] on larger screens for two columns
                    card.className = 'w-full sm:w-[calc(30%-8px)] p-4 bg-white border border-slate-300 rounded-lg shadow-md transition-shadow hover:shadow-xl';

                    card.innerHTML = `
                        <div class="flex justify-between items-start mb-2">
                            <span class="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">${item.type}</span>
                            <span class="text-lg font-bold text-green-600">${item.price}</span>
                        </div>
                        <h3 class="text-base font-semibold text-slate-900 mb-1">${item.location}</h3>
                        <p class="text-sm text-slate-500">${item.description}</p>
                    `;
                    responseDiv.appendChild(card);
                });

                responseDiv.classList.remove('hidden'); // Show the results container

            };


            // Function to handle form submission
            const handleSubmit = async (e) => {
                // Prevent the default form submission (which would reload the page)
                e.preventDefault();

                // 1. Retrieve the input values (optional, but good practice)
                const formData = {
                    fullName: document.getElementById('name').value,
                    preferredLocation: document.getElementById('location').value,
                    minimumBudget: document.getElementById('min_budget').value,
                    maximumBudget: document.getElementById('max_budget').value,
                    accommodationType: document.getElementById('accomodation').value
                };
                
                // Show loading message
                messageBox.classList.remove('hidden');
                messageBox.classList.remove('bg-green-100', 'text-green-800');
                messageBox.classList.add('bg-blue-100', 'text-blue-800');
                messageBox.querySelector('p').innerHTML = '<span class="animate-pulse">Searching for listings based on your criteria...</span>';
                
                // Hide previous results
                responseDiv.classList.add('hidden'); 

                try {
                    // 2. Make the actual API Call with retry logic
                    console.log('Fetching listings from API:', API_URL, 'with payload:', formData);
                    
                    const accommodationData = await fetchWithRetry(API_URL);
                    
                    // 3. Process the response
                    renderResults(accommodationData);
                    
                    // Update message box to successful state, then hide it
                    messageBox.classList.remove('bg-blue-100', 'text-blue-800');
                    messageBox.classList.add('bg-green-100', 'text-green-800');
                    messageBox.querySelector('p').textContent = 'Search complete! Found ' + accommodationData.length + ' matching listings.';

                    setTimeout(() => {
                        messageBox.classList.add('hidden');
                    }, 4000); 

                } catch (error) {
                    // Handle fetch errors
                    console.error('Failed to load accommodation data:', error);
                    
                    messageBox.classList.remove('bg-blue-100', 'text-blue-800');
                    messageBox.classList.add('bg-red-100', 'text-red-800');
                    messageBox.querySelector('p').textContent = 'Error fetching listings. Please check the console for network error details.';
                    
                    setTimeout(() => {
                        messageBox.classList.add('hidden');
                    }, 6000); 
                }

            };

            // Attach the event listener to the form element
            if (form) {
                form.addEventListener('submit', handleSubmit);
            }
        });



        // https://api-f1db6c.stack.tryrelevance.com/latest/agents/hooks/custom-trigger/f3d60ef1-5dcd-480a-bf9f-d1a890715a17/3e8eeeb5-fbab-4800-9361-bdddf11a653b