document.addEventListener('DOMContentLoaded', function() {
    console.log("qp-new.js: DOM fully loaded. Script started.");

    // Assuming the container for the tab content has the ID 'Quick-Pencil'
    const tabContentContainer = document.getElementById('Quick-Pencil');

    if (!tabContentContainer) {
        console.error("qp-new.js: Error - Could not find the tab content container with ID 'Quick-Pencil'.");
    } else {
        console.log("qp-new.js: Found tab content container 'Quick-Pencil'.");
        console.log("qp-new.js: Fetching calculator HTML from quick_pencil/quickpencil.html...");

        fetch('quick_pencil/quickpencil.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("qp-new.js: Successfully fetched calculator HTML.");
                return response.text();
            })
            .then(html => {
                console.log("qp-new.js: Inserting HTML into tab container.");
                tabContentContainer.innerHTML = html;
                console.log("qp-new.js: HTML insertion complete.");

                // Now, find the form and attach an event listener
                const calculatorForm = document.getElementById('car-loan-form');
                if (!calculatorForm) {
                    console.error("qp-new.js: Error - Could not find calculator form with ID 'car-loan-form' after loading HTML.");
                } else {
                    console.log("qp-new.js: Successfully found calculator form.");
                    calculatorForm.addEventListener('submit', function(event) {
                        event.preventDefault();
                        console.log("qp-new.js: Calculator form submitted. Calculation logic should run here.");
                        // The actual calculation logic would go here.
                        // For now, we just log that the event was captured.
                        const resultsDiv = document.getElementById('results');
                        if(resultsDiv) {
                            resultsDiv.innerHTML = "<p>Form submitted! Calculation would appear here.</p>";
                        }
                    });
                    console.log("qp-new.js: Attached submit event listener to the calculator form.");
                }
            })
            .catch(error => {
                console.error("qp-new.js: Error fetching or processing calculator HTML:", error);
                if(tabContentContainer) {
                    tabContentContainer.innerHTML = `<p style="color: red;">Error: Could not load the calculator. ${error}</p>`;
                }
            });
    }
});
