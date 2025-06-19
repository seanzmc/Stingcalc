document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const calculatorForm = document.getElementById('calculator-form');
    const saleTypeNew = document.getElementById('sale-type-new');
    const saleTypeUsed = document.getElementById('sale-type-used');
    const msrpInput = document.getElementById('msrp');
    const sellingPriceInput = document.getElementById('selling-price');
    const additionalEquipmentInput = document.getElementById('additional-equipment');
    const discountInput = document.getElementById('discount');
    const rebatesInput = document.getElementById('rebates');
    const tradeAllowanceInput = document.getElementById('trade-allowance');
    const tradePayoffInput = document.getElementById('trade-payoff');
    const tagTypeNew = document.getElementById('tag-type-new');
    const tagTypeTransfer = document.getElementById('tag-type-transfer');
    const downPaymentInput = document.getElementById('down-payment');
    const itemizedSummaryDiv = document.getElementById('itemized-summary');
    const amountToFinanceDisplay = document.getElementById('amount-to-finance-display');

    // Input Fields for easy iteration
    const allInputs = [
        msrpInput, sellingPriceInput, additionalEquipmentInput, discountInput,
        rebatesInput, tradeAllowanceInput, tradePayoffInput, downPaymentInput
    ];

    const toggleSaleTypeFields = () => {
        const isNew = saleTypeNew.checked;
        document.querySelector('label[for="msrp"]').parentElement.style.display = isNew ? '' : 'none';
        msrpInput.required = isNew;
        document.querySelector('label[for="discount"]').parentElement.style.display = isNew ? '' : 'none';
        document.querySelector('label[for="rebates"]').parentElement.style.display = isNew ? '' : 'none';
        
        document.querySelector('label[for="selling-price"]').parentElement.style.display = isNew ? 'none' : '';
        sellingPriceInput.required = !isNew;
        
        calculate();
    };

    const getNumericValue = (element) => {
        return parseFloat(element.value) || 0;
    };

    const validateInputs = () => {
        let isValid = true;
        allInputs.forEach(input => {
            if (input.required && !input.value) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        return isValid;
    };

    const calculate = () => {
        if (!validateInputs()) {
            itemizedSummaryDiv.innerHTML = '<p class="error-message">Please fill in all required fields.</p>';
            amountToFinanceDisplay.textContent = '$0.00';
            return;
        }

        let summaryHTML = '';
        let finalAmount = 0;

        const additionalEquipment = getNumericValue(additionalEquipmentInput);
        const tradeAllowance = getNumericValue(tradeAllowanceInput);
        const tradePayoff = getNumericValue(tradePayoffInput);
        const downPayment = getNumericValue(downPaymentInput);
        const tagFee = tagTypeNew.checked ? 450 : 350;

        if (saleTypeNew.checked) {
            // New Car Calculation
            const msrp = getNumericValue(msrpInput);
            const discount = getNumericValue(discountInput);
            const rebates = getNumericValue(rebatesInput);

            const sellingPrice = msrp + additionalEquipment - discount;
            const floridaWasteTireFee = 5.00;
            const floridaBatteryFee = 1.50;
            const privateTagAgencyFee = 299.00;

            const totalTaxableAmount = sellingPrice - tradeAllowance + floridaWasteTireFee + floridaBatteryFee + privateTagAgencyFee;
            const salesTax = (totalTaxableAmount * 0.06) + 75.00;
            const floridaLemonLawFee = 2.00;
            
            const totalDeliveredPrice = totalTaxableAmount + salesTax + floridaLemonLawFee + tagFee + tradePayoff;
            finalAmount = totalDeliveredPrice - rebates - downPayment;

            summaryHTML = `
                <p>M.S.R.P.: ${msrp.toFixed(2)}</p>
                <p>+ Additional Equipment: ${additionalEquipment.toFixed(2)}</p>
                <p>- Discount: ${discount.toFixed(2)}</p>
                <p><strong>= Selling Price: ${sellingPrice.toFixed(2)}</strong></p>
                <hr>
                <p>Selling Price: ${sellingPrice.toFixed(2)}</p>
                <p>- Trade Allowance: ${tradeAllowance.toFixed(2)}</p>
                <p>+ FL Waste Tire Fee: ${floridaWasteTireFee.toFixed(2)}</p>
                <p>+ FL Battery Fee: ${floridaBatteryFee.toFixed(2)}</p>
                <p>+ Private Tag Agency Fee: ${privateTagAgencyFee.toFixed(2)}</p>
                <p><strong>= Total Taxable Amount: ${totalTaxableAmount.toFixed(2)}</strong></p>
                <hr>
                <p>Total Taxable Amount: ${totalTaxableAmount.toFixed(2)}</p>
                <p>+ Sales Tax: ${salesTax.toFixed(2)}</p>
                <p>+ FL Lemon Law Fee: ${floridaLemonLawFee.toFixed(2)}</p>
                <p>+ Tag and Title Fee: ${tagFee.toFixed(2)}</p>
                <p>+ Trade Payoff: ${tradePayoff.toFixed(2)}</p>
                <p><strong>= Total Delivered Price: ${totalDeliveredPrice.toFixed(2)}</strong></p>
                <hr>
                <p>Total Delivered Price: ${totalDeliveredPrice.toFixed(2)}</p>
                <p>- Rebates: ${rebates.toFixed(2)}</p>
                <p>- Down Payment: ${downPayment.toFixed(2)}</p>
            `;

        } else {
            // Used Car Calculation
            const sellingPrice = getNumericValue(sellingPriceInput);
            const privateTagAgencyFee = 299.00;

            const totalTaxableAmount = sellingPrice + additionalEquipment - tradeAllowance + privateTagAgencyFee;
            const salesTax = (totalTaxableAmount * 0.06) + 75.00;
            
            const totalDeliveredPrice = totalTaxableAmount + salesTax + tagFee + tradePayoff;
            finalAmount = totalDeliveredPrice - downPayment;

            summaryHTML = `
                <p>Selling Price: ${sellingPrice.toFixed(2)}</p>
                <p>+ Additional Equipment: ${additionalEquipment.toFixed(2)}</p>
                <p>- Trade Allowance: ${tradeAllowance.toFixed(2)}</p>
                <p>+ Private Tag Agency Fee: ${privateTagAgencyFee.toFixed(2)}</p>
                <p><strong>= Total Taxable Amount: ${totalTaxableAmount.toFixed(2)}</strong></p>
                <hr>
                <p>Total Taxable Amount: ${totalTaxableAmount.toFixed(2)}</p>
                <p>+ Sales Tax: ${salesTax.toFixed(2)}</p>
                <p>+ Tag and Title Fee: ${tagFee.toFixed(2)}</p>
                <p>+ Trade Payoff: ${tradePayoff.toFixed(2)}</p>
                <p><strong>= Total Delivered Price: ${totalDeliveredPrice.toFixed(2)}</strong></p>
                <hr>
                <p>Total Delivered Price: ${totalDeliveredPrice.toFixed(2)}</p>
                <p>- Down Payment: ${downPayment.toFixed(2)}</p>
            `;
        }

        itemizedSummaryDiv.innerHTML = summaryHTML;
        amountToFinanceDisplay.textContent = `$${finalAmount.toFixed(2)}`;
    };

    // Event Listeners
    calculatorForm.addEventListener('input', calculate);
    calculatorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculate();
    });

    saleTypeNew.addEventListener('change', toggleSaleTypeFields);
    saleTypeUsed.addEventListener('change', toggleSaleTypeFields);

    // Initial setup
    toggleSaleTypeFields();
});
