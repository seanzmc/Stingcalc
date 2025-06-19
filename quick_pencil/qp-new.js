document.addEventListener('DOMContentLoaded', () => {
    const carLoanForm = document.getElementById('car-loan-form');
    if (carLoanForm) {
        carLoanForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const carPrice = parseFloat(document.getElementById('car-price').value);
            const downPayment = parseFloat(document.getElementById('down-payment').value);
            const tradeIn = parseFloat(document.getElementById('trade-in').value);
            const interestRate = parseFloat(document.getElementById('qp-interest-rate').value) / 100 / 12;
            const loanTerm = parseFloat(document.getElementById('qp-loan-term').value);

            const loanAmount = carPrice - downPayment - tradeIn;
            const monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);

            if (isFinite(monthlyPayment)) {
                document.getElementById('monthly-payment').textContent = `$${monthlyPayment.toFixed(2)}`;
            } else {
                document.getElementById('monthly-payment').textContent = 'Please check your numbers';
            }
        });
    }
});
