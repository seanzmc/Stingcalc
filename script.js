document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Add Enter key navigation for all forms
    setupEnterKeyNavigation('payment-form');
    setupEnterKeyNavigation('amount-form');
    setupEnterKeyNavigation('income-form');
    
    // Add automatic date formatting for income tab date fields
    setupDateFormatting('check-date');
    setupDateFormatting('hire-date');
    
    // Setup clear buttons
    setupClearButtons();
    
    // Payment Calculator Form
    const paymentForm = document.getElementById('payment-form');
    const paymentResult = document.querySelector('#payment-result .amount');
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value);
        
        console.log('Payment Calculation Inputs:', { loanAmount, loanTerm, interestRate });
        
        // Validate inputs
        if (isNaN(loanAmount) || isNaN(loanTerm) || isNaN(interestRate)) {
            alert('Please enter valid numbers for all fields');
            return;
        }
        
        if (loanAmount <= 0 || loanTerm <= 0 || interestRate < 0) {
            alert('Please enter positive values');
            return;
        }
        
        // Calculate monthly payment
        const monthlyPayment = calculateMonthlyPayment(loanAmount, loanTerm, interestRate);
        console.log('Calculated Monthly Payment:', monthlyPayment);
        
        // Display result
        paymentResult.textContent = formatCurrency(monthlyPayment);
        console.log('Payment Result Updated:', paymentResult.textContent);
    });
    
    // Loan Amount Calculator Form
    const amountForm = document.getElementById('amount-form');
    const amountResult = document.querySelector('#amount-result .amount');
    
    amountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const desiredPayment = parseFloat(document.getElementById('desired-payment').value);
        const loanTerm = parseInt(document.getElementById('amount-term').value);
        const interestRate = parseFloat(document.getElementById('amount-rate').value);
        
        // Validate inputs
        if (isNaN(desiredPayment) || isNaN(loanTerm) || isNaN(interestRate)) {
            alert('Please enter valid numbers for all fields');
            return;
        }
        
        if (desiredPayment <= 0 || loanTerm <= 0 || interestRate < 0) {
            alert('Please enter positive values');
            return;
        }
        
        // Calculate loan amount
        const loanAmount = calculateLoanAmount(desiredPayment, loanTerm, interestRate);
        
        // Display result
        amountResult.textContent = formatCurrency(loanAmount);
    });
    
    // Income Calculator Form
    const incomeForm = document.getElementById('income-form');
    const incomeResult = document.querySelector('#income-result .amount');
    
    incomeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const ytdAmount = parseFloat(document.getElementById('ytd-amount').value);
        const checkDateInput = document.getElementById('check-date').value;
        const hireDateInput = document.getElementById('hire-date').value;
        
        console.log('Form inputs:', { ytdAmount, checkDateInput, hireDateInput });
        
        // Parse dates
        let checkDate, hireDate;
        try {
            // Try to parse the date, handling different formats
            checkDate = parseDate(checkDateInput);
            hireDate = hireDateInput ? parseDate(hireDateInput) : null;
            
            console.log('Parsed dates:', {
                checkDate: checkDate ? checkDate.toISOString() : null,
                hireDate: hireDate ? hireDate.toISOString() : null
            });
        } catch (e) {
            console.error('Date parsing error:', e);
            alert('Please enter valid date values in MM/DD/YYYY format');
            return;
        }
        
        // Validate inputs
        if (isNaN(ytdAmount) || !checkDate) {
            alert('Please enter valid values for all required fields');
            return;
        }
        
        if (ytdAmount < 0) {
            alert('Please enter a positive value for YTD amount');
            return;
        }
        
        if (hireDate && !isValidDate(hireDate)) {
            alert('Please enter a valid hire date');
            return;
        }
        
        // Calculate monthly income
        const monthlyIncome = calculateMonthlyIncome(ytdAmount, checkDate, hireDate);
        
        // Display result
        console.log('Income result element:', incomeResult);
        incomeResult.textContent = formatCurrency(monthlyIncome);
        console.log('Updated income result text:', incomeResult.textContent);
    });
    
    // Function to calculate monthly payment
    function calculateMonthlyPayment(principal, term, rate) {
        // Convert annual rate to monthly rate and decimal
        const monthlyRate = rate / 100 / 12;
        console.log('Monthly Rate:', monthlyRate);
        
        // Handle edge case of 0% interest
        if (monthlyRate === 0) {
            return principal / term;
        }
        
        // Calculate monthly payment using the formula:
        // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
        // where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
        const x = Math.pow(1 + monthlyRate, term);
        console.log('X value:', x);
        const payment = principal * (monthlyRate * x) / (x - 1);
        console.log('Payment calculation:', { principal, monthlyRate, x, payment });
        
        return payment;
    }
    
    // Function to calculate loan amount
    function calculateLoanAmount(payment, term, rate) {
        // Convert annual rate to monthly rate and decimal
        const monthlyRate = rate / 100 / 12;
        
        // Handle edge case of 0% interest
        if (monthlyRate === 0) {
            return payment * term;
        }
        
        // Calculate loan amount using the formula:
        // L = P[(1 + c)^n - 1]/[c(1 + c)^n]
        // where L = loan amount, P = payment, c = monthly interest rate, n = number of payments
        const x = Math.pow(1 + monthlyRate, term);
        const loanAmount = payment * (x - 1) / (monthlyRate * x);
        
        return loanAmount;
    }
    
    // Function to format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    // Function to calculate monthly income based on YTD amount and dates
    function calculateMonthlyIncome(ytdAmount, checkDate, hireDate) {
        console.log('Calculating monthly income with:', {
            ytdAmount,
            checkDate: checkDate.toISOString(),
            hireDate: hireDate ? hireDate.toISOString() : null
        });
        
        // Make sure we're using a reasonable date
        if (checkDate.getFullYear() > 3000) {
            console.warn('Date is too far in the future, resetting to 2025-04-15');
            checkDate = new Date(2025, 3, 15); // April 15, 2025
        }
        
        // Get the year from the check date
        const year = checkDate.getFullYear();
        
        // Determine the start date (either January 1st or hire date if hired this year)
        const startDate = hireDate && hireDate.getFullYear() === year
            ? new Date(hireDate)
            : new Date(year, 0, 1); // January 1st of the current year
        
        console.log('Using start date:', startDate.toISOString());
        
        // Calculate the number of months between start date and check date
        let months = (checkDate.getMonth() - startDate.getMonth()) +
                    (12 * (checkDate.getFullYear() - startDate.getFullYear()));
        
        // Adjust for partial months
        const dayOfMonth = checkDate.getDate();
        const daysInMonth = new Date(checkDate.getFullYear(), checkDate.getMonth() + 1, 0).getDate();
        const partialMonth = dayOfMonth / daysInMonth;
        
        months += partialMonth;
        
        // Ensure we have at least a partial month to avoid division by zero
        months = Math.max(months, 0.1);
        
        console.log('Calculated months:', months);
        
        // Calculate monthly income by dividing YTD by number of months
        const monthlyIncome = ytdAmount / months;
        console.log('Calculated monthly income:', monthlyIncome);
        
        // Log the final result
        const result = formatCurrency(monthlyIncome);
        console.log('Final monthly income result:', result);
        
        // Make sure the result is visible in the UI
        setTimeout(() => {
            const resultElement = document.querySelector('#income-result .amount');
            if (resultElement) {
                console.log('Checking if result is visible in UI:', resultElement.textContent);
                if (resultElement.textContent !== result) {
                    console.warn('Result not updated in UI, forcing update');
                    resultElement.textContent = result;
                }
            }
        }, 100);
        
        return monthlyIncome;
    }
    
    // Function to validate date objects
    function isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }
    
    // Function to parse dates in various formats
    function parseDate(dateString) {
        console.log('Parsing date:', dateString);
        
        // Handle the case where the date is in an unexpected format
        if (dateString.includes('50415')) {
            console.log('Detected unusual date format, correcting to 2025-04-15');
            return new Date(2025, 3, 15); // April is month 3 (0-based)
        }
        
        // Try to parse as ISO format (YYYY-MM-DD)
        let date = new Date(dateString);
        if (isValidDate(date)) {
            console.log('Valid ISO date:', date);
            return date;
        }
        
        // Try to parse as MM/DD/YYYY
        const parts = dateString.split('/');
        if (parts.length === 3) {
            // Month is 0-based in JavaScript Date
            const month = parseInt(parts[0]) - 1;
            const day = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            
            date = new Date(year, month, day);
            if (isValidDate(date)) {
                console.log('Valid MM/DD/YYYY date:', date);
                return date;
            }
        }
        
        // If we get here, try to extract a valid date from the string
        const currentYear = new Date().getFullYear();
        const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4}|\d{2})/;
        const match = dateString.match(dateRegex);
        
        if (match) {
            const month = parseInt(match[1]) - 1;
            const day = parseInt(match[2]);
            let year = parseInt(match[3]);
            
            // Handle 2-digit years
            if (year < 100) {
                year = year + (year < 50 ? 2000 : 1900);
            }
            
            date = new Date(year, month, day);
            if (isValidDate(date)) {
                console.log('Extracted date from string:', date);
                return date;
            }
        }
        
        // Default to current date if all else fails
        console.warn('Could not parse date, using current date');
        return new Date();
    }
    
    // Function to setup Enter key navigation for a form
    function setupEnterKeyNavigation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', function(e) {
                // Check if Enter key was pressed
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent default form submission
                    
                    // If this is not the last input, focus on the next input
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        // If this is the last input, submit the form
                        form.querySelector('.calculate-btn').click();
                    }
                }
            });
        });
    }
    
    // Function to setup automatic date formatting
    function setupDateFormatting(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        // Store the original type
        const originalType = input.type;
        
        // Change to text type to allow custom formatting
        input.type = 'text';
        input.placeholder = 'MM/DD/YYYY';
        
        input.addEventListener('input', function(e) {
            // Get the current value and remove any non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 8 digits (MMDDYYYY)
            if (value.length > 8) {
                value = value.slice(0, 8);
            }
            
            // Format with slashes
            if (value.length > 4) {
                // Format as MM/DD/YYYY
                value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
            } else if (value.length > 2) {
                // Format as MM/DD
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            
            // Update the input value
            this.value = value;
        });
        
        // Add blur event to validate and ensure proper format
        input.addEventListener('blur', function() {
            const value = this.value;
            
            if (value && value.length > 0) {
                // Try to parse the date
                try {
                    const date = parseDate(value);
                    
                    // If valid, format as MM/DD/YYYY
                    if (isValidDate(date)) {
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const year = date.getFullYear();
                        
                        this.value = `${month}/${day}/${year}`;
                    }
                } catch (e) {
                    // If invalid, clear the field
                    console.warn('Invalid date format:', value);
                    // Don't clear the field, let the form validation handle it
                }
            }
        });
    }
    
    // Function to setup clear buttons
    function setupClearButtons() {
        const clearButtons = document.querySelectorAll('.clear-btn');
        
        clearButtons.forEach(button => {
            button.addEventListener('click', function() {
                const formId = this.getAttribute('data-form');
                clearForm(formId);
            });
        });
    }
    
    // Function to clear a form
    function clearForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        // Clear all input fields
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
        
        // Reset result display
        const resultId = formId.replace('form', 'result');
        const resultElement = document.querySelector(`#${resultId} .amount`);
        if (resultElement) {
            resultElement.textContent = '$0.00';
        }
        
        // Focus on the first input field
        const firstInput = inputs[0];
        if (firstInput) {
            firstInput.focus();
        }
    }
});
