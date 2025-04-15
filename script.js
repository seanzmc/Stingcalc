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
});
