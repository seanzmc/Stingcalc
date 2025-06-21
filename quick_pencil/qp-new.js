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

        // Prepare rows for itemized summary
        const rows = [];
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
            // Build rows for new car flow
            rows.push(`<div class="summary-row"><span class="label">M.S.R.P.:</span><span class="value">$${fmt(msrp)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Additional Equipment:</span><span class="value">$${fmt(additionalEq)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">- Discount:</span><span class="value">$${fmt(discount)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Selling Price:</span><span class="value">$${fmt(sellPrice)}</span></div>`);
            rows.push('<hr>');
            rows.push(`<div class="summary-row"><span class="label">Selling Price:</span><span class="value">$${fmt(sellPrice)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">- Trade Allowance:</span><span class="value">$${fmt(tradeAllowance)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ FL Waste Tire Fee:</span><span class="value">$${fmt(floridaWasteTireFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ FL Battery Fee:</span><span class="value">$${fmt(floridaBatteryFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Private Tag Agency Fee:</span><span class="value">$${fmt(privateTagAgencyFee)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Total Taxable:</span><span class="value">$${fmt(totalTaxable)}</span></div>`);
            rows.push('<hr>');
            rows.push(`<div class="summary-row"><span class="label">Total Taxable:</span><span class="value">$${fmt(totalTaxable)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Sales Tax:</span><span class="value">$${fmt(salesTax)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ FL Lemon Law Fee:</span><span class="value">$${fmt(lemonLawFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Tag & Title Fee:</span><span class="value">$${fmt(tagFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Trade Payoff:</span><span class="value">$${fmt(tradePayoff)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Delivered Price:</span><span class="value">$${fmt(totalDelivered)}</span></div>`);
            rows.push('<hr>');
            rows.push(`<div class="summary-row"><span class="label">Delivered Price:</span><span class="value">$${fmt(totalDelivered)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">- Rebates:</span><span class="value">$${fmt(rebates)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">- Down Payment:</span><span class="value">$${fmt(downPayment)}</span></div>`);
        } else {
            // Used car flow
            const sellPrice = sellingPriceInput + additionalEq;
            const totalTaxable = sellPrice - tradeAllowance + privateTagAgencyFee;
            const salesTax = totalTaxable * salesTaxRate + docStampFlat;
            const totalDelivered = totalTaxable + salesTax + tagFee + tradePayoff;
            finalAmount = totalDelivered - downPayment;
            // Build rows for used car flow
            rows.push(`<div class="summary-row"><span class="label">Selling Price:</span><span class="value">$${fmt(sellingPriceInput)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Additional Equipment:</span><span class="value">$${fmt(additionalEq)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">- Trade Allowance:</span><span class="value">$${fmt(tradeAllowance)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Private Tag Agency Fee:</span><span class="value">$${fmt(privateTagAgencyFee)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Total Taxable:</span><span class="value">$${fmt(totalTaxable)}</span></div>`);
            rows.push('<hr>');
            rows.push(`<div class="summary-row"><span class="label">Total Taxable:</span><span class="value">$${fmt(totalTaxable)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Sales Tax:</span><span class="value">$${fmt(salesTax)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Tag & Title Fee:</span><span class="value">$${fmt(tagFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Trade Payoff:</span><span class="value">$${fmt(tradePayoff)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Delivered Price:</span><span class="value">$${fmt(totalDelivered)}</span></div>`);
            rows.push('<hr>');
            rows.push(`<div class="summary-row"><span class="label">Delivered Price:</span><span class="value">$${fmt(totalDelivered)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">- Down Payment:</span><span class="value">$${fmt(downPayment)}</span></div>`);
        }
        // Render results using grid-aligned summary rows
        const resultDiv = document.getElementById('qp-results');
        const summaryHTML = rows.join('');
        resultDiv.innerHTML = `
            <h3>Itemized Summary</h3>
            ${summaryHTML}
            <hr>
            <div class="summary-row total-row">
                <span class="label">Amount to Finance:</span>
                <span class="value">$${fmt(finalAmount)}</span>
            </div>
            <div class="button-group">
                <button type="button" id="use-in-payment-btn" class="calculate-btn">
                    Use in Payment Calculator
                </button>
            </div>
        `;

        const useBtn = document.getElementById('use-in-payment-btn');
        if (useBtn) {
            useBtn.addEventListener('click', () => {
                const paymentInput = document.getElementById('loan-amount');
                if (paymentInput) {
                    paymentInput.value = finalAmount.toFixed(2);
                }
                const tabBtn = document.querySelector('.tab-btn[data-tab="payment-calc"]');
                if (tabBtn) {
                    tabBtn.click();
                }
            });
        }
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
