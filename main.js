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
            const accommodationData = [
                {
                    location: '13 Fairmount Street Lakemba NSW Australia',
                    type: 'House',
                    price: '600 per week',
                    description: '2 bed room house, 1 shower and washroom combined, Kitchen space.',
                },
                {
                    location: '17 Fairmount Street Lakemba NSW Australia',
                    type: 'Apartment',
                    price: '830 per week',
                    description: '2 bed room house, 2 washroom, 1 Shower room, Kitchen space, Living space.',
                },
                {
                    location: '25 Main Street Sydney NSW Australia',
                    type: 'Studio',
                    price: '450 per week',
                    description: 'Compact studio with kitchenette and separate bathroom, perfect for one.',
                },
                {
                    location: '1/10 Green Lane Parramatta NSW Australia',
                    type: 'Shared Room',
                    price: '250 per week',
                    description: 'Single bed in a shared 4-bedroom apartment, all utilities included.',
                },
                {
                    location: '39 Coastal Drive Bondi NSW Australia',
                    type: 'House',
                    price: '1200 per week',
                    description: 'Luxurious 3-bedroom beach house with ocean views and private parking.',
                },
            ];

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

renderResults(accommodationData);

            // Function to handle form submission
            const handleSubmit = (e) => {
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

                // 2. Simulate API Call (using setTimeout to mimic network latency)
                console.log('Simulating API call with payload:', formData);

                setTimeout(() => {
                    // --- This is where the API response (accommodationData) is processed ---
                    renderResults(accommodationData);
                    
                    // Update message box to successful state, then hide it
                    messageBox.classList.remove('bg-blue-100', 'text-blue-800');
                    messageBox.classList.add('bg-green-100', 'text-green-800');
                    messageBox.querySelector('p').textContent = 'Search complete! Found ' + accommodationData.length + ' matching listings.';

                    setTimeout(() => {
                        messageBox.classList.add('hidden');
                    }, 4000); 

                }, 2000); // 2 second delay for simulation

            };

            // Attach the event listener to the form element
            if (form) {
                form.addEventListener('submit', handleSubmit);
            }
        });