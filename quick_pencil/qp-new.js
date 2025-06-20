document.addEventListener('DOMContentLoaded', function() {
    const saleTypeButtons = document.querySelectorAll('#quick-pencil .qp-subtab-btn');
    const qpRows = document.querySelectorAll('#quick-pencil .qp-row');
    const form = document.getElementById('qp-form');
    // Formatting helper: numbers with commas and two decimals
    function fmt(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateFields(type) {
        saleTypeButtons.forEach(btn => {
            if (btn.dataset.saleType === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        qpRows.forEach(row => {
            const field = row.dataset.field;
            if (field) {
                if (type === 'new' && ['msrp', 'discount', 'rebates'].includes(field)) {
                    row.style.display = 'flex';
                    const input = row.querySelector('input, select');
                    input.required = (field === 'msrp');
                } else if (type === 'used' && field === 'selling-price') {
                    row.style.display = 'flex';
                    const input = row.querySelector('input, select');
                    input.required = true;
                } else {
                    row.style.display = 'none';
                    const input = row.querySelector('input, select');
                    input.required = false;
                    input.value = '';
                }
            } else {
                row.style.display = 'flex';
            }
        });
        const visibleInputs = Array.from(form.querySelectorAll('input, select'))
            .filter(el => el.offsetParent !== null);
        if (visibleInputs.length) {
            visibleInputs[0].focus();
        }
    }

    saleTypeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            updateFields(this.dataset.saleType);
        });
    });
    // Initialize with 'new' sale type
    updateFields('new');

    const focusable = Array.from(form.querySelectorAll('input, select, button[type="submit"]'));
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const el = e.target;
            if (['INPUT', 'SELECT'].includes(el.tagName)) {
                e.preventDefault();
                const visible = focusable.filter(f => f.offsetParent !== null);
                const idx = visible.indexOf(el);
                if (idx !== -1 && idx < visible.length - 1) {
                    visible[idx + 1].focus();
                } else {
                    form.requestSubmit();
                }
            }
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Gather input values
        const saleType = document.querySelector('#quick-pencil .qp-subtab-btn.active').dataset.saleType;
        const msrp = parseFloat(document.getElementById('msrp').value) || 0;
        const sellingPriceInput = parseFloat(document.getElementById('selling-price').value) || 0;
        const additionalEq = parseFloat(document.getElementById('additional-equipment').value) || 0;
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const rebates = parseFloat(document.getElementById('rebates').value) || 0;
        const tradeAllowance = parseFloat(document.getElementById('trade-allowance').value) || 0;
        const tradePayoff = parseFloat(document.getElementById('trade-payoff').value) || 0;
        const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
        const tagFee = document.getElementById('tag-type').value === 'new' ? 450 : 350;

        let summary = '';
        let finalAmount = 0;
        const floridaWasteTireFee = 5.00;
        const floridaBatteryFee = 1.50;
        const privateTagAgencyFee = 299.00;
        const lemonLawFee = 2.00;
        const salesTaxRate = 0.06;
        const docStampFlat = 75.00;

        if (saleType === 'new') {
            // New car flow
            const sellPrice = msrp + additionalEq - discount;
            const totalTaxable = sellPrice - tradeAllowance + floridaWasteTireFee + floridaBatteryFee + privateTagAgencyFee;
            const salesTax = totalTaxable * salesTaxRate + docStampFlat;
            const totalDelivered = totalTaxable + salesTax + lemonLawFee + tagFee + tradePayoff;
            finalAmount = totalDelivered - rebates - downPayment;
            summary = `
                <p>M.S.R.P.: $${fmt(msrp)}</p>
                <p>+ Additional Equipment: $${fmt(additionalEq)}</p>
                <p>- Discount: $${fmt(discount)}</p>
                <p><strong>= Selling Price: $${fmt(sellPrice)}</strong></p>
                <hr>
                <p>Selling Price: $${fmt(sellPrice)}</p>
                <p>- Trade Allowance: $${fmt(tradeAllowance)}</p>
                <p>+ FL Waste Tire Fee: $${fmt(floridaWasteTireFee)}</p>
                <p>+ FL Battery Fee: $${fmt(floridaBatteryFee)}</p>
                <p>+ Private Tag Agency Fee: $${fmt(privateTagAgencyFee)}</p>
                <p><strong>= Total Taxable: $${fmt(totalTaxable)}</strong></p>
                <hr>
                <p>Total Taxable: $${fmt(totalTaxable)}</p>
                <p>+ Sales Tax: $${fmt(salesTax)}</p>
                <p>+ FL Lemon Law Fee: $${fmt(lemonLawFee)}</p>
                <p>+ Tag & Title Fee: $${fmt(tagFee)}</p>
                <p>+ Trade Payoff: $${fmt(tradePayoff)}</p>
                <p><strong>= Delivered Price: $${fmt(totalDelivered)}</strong></p>
                <hr>
                <p>Delivered Price: $${fmt(totalDelivered)}</p>
                <p>- Rebates: $${fmt(rebates)}</p>
                <p>- Down Payment: $${fmt(downPayment)}</p>
            `;
        } else {
            // Used car flow
            const sellPrice = sellingPriceInput + additionalEq;
            const totalTaxable = sellPrice - tradeAllowance + privateTagAgencyFee;
            const salesTax = totalTaxable * salesTaxRate + docStampFlat;
            const totalDelivered = totalTaxable + salesTax + tagFee + tradePayoff;
            finalAmount = totalDelivered - downPayment;
            summary = `
                <p>Selling Price: $${fmt(sellingPriceInput)}</p>
                <p>+ Additional Equipment: $${fmt(additionalEq)}</p>
                <p>- Trade Allowance: $${fmt(tradeAllowance)}</p>
                <p>+ Private Tag Agency Fee: $${fmt(privateTagAgencyFee)}</p>
                <p><strong>= Total Taxable: $${fmt(totalTaxable)}</strong></p>
                <hr>
                <p>Total Taxable: $${fmt(totalTaxable)}</p>
                <p>+ Sales Tax: $${fmt(salesTax)}</p>
                <p>+ Tag & Title Fee: $${fmt(tagFee)}</p>
                <p>+ Trade Payoff: $${fmt(tradePayoff)}</p>
                <p><strong>= Delivered Price: $${fmt(totalDelivered)}</strong></p>
                <hr>
                <p>Delivered Price: $${fmt(totalDelivered)}</p>
                <p>- Down Payment: $${fmt(downPayment)}</p>
            `;
        }
        // Render results
        const resultDiv = document.getElementById('qp-results');
        resultDiv.innerHTML = `
            <h3>Itemized Summary</h3>
            ${summary}
            <h3>Amount to Finance: $${fmt(finalAmount)}</h3>
        `;
    });

    // Clear Quick Pencil form and results
    const clearBtn = document.getElementById('qp-clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            updateFields('new');
            form.querySelectorAll('input').forEach(input => input.value = '');
            document.getElementById('qp-results').innerHTML = '';
        });
    }
});
