document.addEventListener("DOMContentLoaded", function () {
    const saleTypeButtons = document.querySelectorAll("#quick-pencil .tab-btn");
    const qpRows = document.querySelectorAll("#quick-pencil .qp-row");
    const form = document.getElementById("qp-form");
    const tagTypeSelect = document.getElementById("tag-type");
    const customTagRow = document.querySelector('[data-field="custom-tag-fee"]');
    const customTagInput = document.getElementById("custom-tag-fee");

    function refreshCustomTagVisibility() {
        if (!tagTypeSelect || !customTagRow || !customTagInput) {
            return;
        }
        if (tagTypeSelect.value === "custom") {
            customTagRow.style.display = "flex";
            customTagInput.required = true;
        } else {
            customTagRow.style.display = "none";
            customTagInput.required = false;
            customTagInput.value = "";
        }
    }

    // Formatting helper: numbers with commas and two decimals
    function fmt(num) {
        return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function escapeHtml(str) {
        const escapeMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };
        return String(str).replace(/[&<>"']/g, (match) => escapeMap[match]);
    }

    function updateFields(type) {
        saleTypeButtons.forEach((btn) => {
            if (btn.dataset.saleType === type) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
        qpRows.forEach((row) => {
            const field = row.dataset.field;
            if (field) {
                // Skip custom-tax-rate as it's controlled by the tax-outside-fl checkbox
                if (field === "custom-tax-rate" || field === "custom-tag-fee") {
                    return;
                }

                if (type === "new" && ["msrp", "discount", "rebates"].includes(field)) {
                    row.style.display = "flex";
                    const input = row.querySelector("input, select");
                    input.required = field === "msrp";
                } else if (type === "used" && field === "selling-price") {
                    row.style.display = "flex";
                    const input = row.querySelector("input, select");
                    input.required = true;
                } else {
                    row.style.display = "none";
                    const input = row.querySelector("input, select");
                    input.required = false;
                    input.value = "";
                }
            } else {
                row.style.display = "flex";
            }
        });

        // Handle visibility of rebates-reduce-taxable checkbox
        // Only show when sale type is NEW AND tax-outside-fl is checked
        const taxOutsideFlCheckbox = document.getElementById("tax-outside-fl");
        const rebatesReduceTaxableRow = document.querySelector('[data-field="rebates-reduce-taxable"]');
        const rebatesReduceTaxableCheckbox = document.getElementById("rebates-reduce-taxable");

        if (rebatesReduceTaxableRow && taxOutsideFlCheckbox && rebatesReduceTaxableCheckbox) {
            if (type === "new" && taxOutsideFlCheckbox.checked) {
                rebatesReduceTaxableRow.style.display = "flex";
            } else {
                rebatesReduceTaxableRow.style.display = "none";
                rebatesReduceTaxableCheckbox.checked = false;
            }
        }

        refreshCustomTagVisibility();

        const visibleInputs = Array.from(form.querySelectorAll("input, select")).filter((el) => el.offsetParent !== null);
        if (visibleInputs.length) {
            visibleInputs[0].focus();
        }
    }

    saleTypeButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            updateFields(this.dataset.saleType);
        });
    });
    // Initialize with 'new' sale type
    updateFields("new");

    if (tagTypeSelect) {
        tagTypeSelect.addEventListener("change", refreshCustomTagVisibility);
    }
    refreshCustomTagVisibility();

    const focusable = Array.from(form.querySelectorAll('input, select, button[type="submit"]'));
    form.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const el = e.target;
            if (["INPUT", "SELECT"].includes(el.tagName)) {
                e.preventDefault();
                const visible = focusable.filter((f) => f.offsetParent !== null);
                const idx = visible.indexOf(el);
                if (idx !== -1 && idx < visible.length - 1) {
                    visible[idx + 1].focus();
                } else {
                    form.requestSubmit();
                }
            }
        }
    });

    // Event listener for "tax-outside-fl" checkbox
    const taxOutsideFlCheckbox = document.getElementById("tax-outside-fl");
    const customTaxRateRow = document.querySelector('[data-field="custom-tax-rate"]');
    const rebatesReduceTaxableRow = document.querySelector('[data-field="rebates-reduce-taxable"]');
    const stateDropdownRow = document.querySelector('[data-field="state-dropdown"]');

    if (taxOutsideFlCheckbox && customTaxRateRow) {
        taxOutsideFlCheckbox.addEventListener("change", function () {
            const saleType = document.querySelector("#quick-pencil .tab-btn.active").dataset.saleType;

            if (this.checked) {
                // Show state dropdown
                if (stateDropdownRow) {
                    stateDropdownRow.style.display = "flex";
                }

                // Show custom tax rate input
                customTaxRateRow.style.display = "flex";

                // Show rebates-reduce-taxable only if sale type is NEW
                if (rebatesReduceTaxableRow && saleType === "new") {
                    rebatesReduceTaxableRow.style.display = "flex";
                }
            } else {
                // Hide state dropdown, custom tax rate, and rebates-reduce-taxable
                if (stateDropdownRow) {
                    stateDropdownRow.style.display = "none";
                    document.getElementById("state-select").value = "";
                }

                customTaxRateRow.style.display = "none";
                if (rebatesReduceTaxableRow) {
                    rebatesReduceTaxableRow.style.display = "none";
                    document.getElementById("rebates-reduce-taxable").checked = false;
                }
            }
        });
    }

    // Event listener for "custom-tax-rate" input - validate between 0 and 100
    const customTaxRateInput = document.getElementById("custom-tax-rate");
    if (customTaxRateInput) {
        customTaxRateInput.addEventListener("input", function () {
            let value = parseFloat(this.value);
            if (isNaN(value)) {
                return; // Allow empty or partial input
            }
            if (value < 0) {
                this.value = 0;
            } else if (value > 100) {
                this.value = 100;
            }
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Gather input values
        const saleType = document.querySelector("#quick-pencil .tab-btn.active").dataset.saleType;
        const clientName = document.getElementById("client-name")?.value.trim() || "";
        const msrp = parseFloat(document.getElementById("msrp").value) || 0;
        const sellingPriceInput = parseFloat(document.getElementById("selling-price").value) || 0;
        const additionalEq = parseFloat(document.getElementById("additional-equipment").value) || 0;
        const discount = parseFloat(document.getElementById("discount").value) || 0;
        const rebates = parseFloat(document.getElementById("rebates").value) || 0;
        const tradeAllowance = parseFloat(document.getElementById("trade-allowance").value) || 0;
        const tradePayoff = parseFloat(document.getElementById("trade-payoff").value) || 0;
        const downPayment = parseFloat(document.getElementById("down-payment").value) || 0;
        const tagType = tagTypeSelect ? tagTypeSelect.value : "new";
        let tagFee;
        if (tagType === "custom") {
            const customFee = parseFloat(customTagInput?.value);
            if (isNaN(customFee) || customFee < 0) {
                alert("Please enter a valid custom tag fee amount.");
                return;
            }
            tagFee = customFee;
        } else if (tagType === "transfer") {
            tagFee = 350;
        } else {
            tagFee = 450;
        }

        // Read custom tax checkbox, state selection, and input values
        const taxOutsideFl = document.getElementById("tax-outside-fl")?.checked || false;
        const selectedState = document.getElementById("state-select")?.value || "";
        const customTaxRate = parseFloat(document.getElementById("custom-tax-rate")?.value) || 0;
        const rebatesReduceTaxable = document.getElementById("rebates-reduce-taxable")?.checked || false;

        // Prepare rows for itemized summary
        const rows = [];
        let finalAmount = 0;
        const floridaWasteTireFee = 5.0;
        const floridaBatteryFee = 1.5;
        const dealerFee = 999.0;
        const privateTagAgencyFee = 362.0;
        const lemonLawFee = 2.0;
        const salesTaxRate = 0.06;
        const docStampFlat = 75.0;

        if (saleType === "new") {
            // New car flow
            const sellPrice = msrp + additionalEq - discount;
            let totalTaxable = sellPrice - tradeAllowance + floridaWasteTireFee + floridaBatteryFee + dealerFee + privateTagAgencyFee;

            // Calculate sales tax based on custom tax settings
            let salesTax;
            if (taxOutsideFl) {
                // Custom tax: if rebates-reduce-taxable is checked, subtract rebates from taxable amount
                if (rebatesReduceTaxable) {
                    totalTaxable = totalTaxable - rebates;
                }
                // Use custom tax rate (percentage converted to decimal) and do NOT add docStampFlat
                salesTax = totalTaxable < 0 ? 0 : totalTaxable * (customTaxRate / 100);
            } else {
                // Florida tax: use standard rate plus doc stamp
                salesTax = totalTaxable < 0 ? 0 : totalTaxable * salesTaxRate + docStampFlat;
            }
            const totalDelivered = totalTaxable + salesTax + lemonLawFee + tagFee + tradePayoff;

            // When rebates-reduce-taxable is checked, rebates were already subtracted from totalTaxable
            // Otherwise, subtract rebates from final delivered price as usual
            if (taxOutsideFl && rebatesReduceTaxable) {
                finalAmount = totalDelivered - downPayment;
            } else {
                finalAmount = totalDelivered - rebates - downPayment;
            }
            // Build rows for new car flow
            rows.push(`<div class="summary-row"><span class="label">M.S.R.P.:</span><span class="value">$${fmt(msrp)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Additional Equipment:</span><span class="value">$${fmt(additionalEq)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">- Discount:</span><span class="value">$${fmt(discount)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Selling Price:</span><span class="value">$${fmt(sellPrice)}</span></div>`);
            rows.push("<hr>");
            rows.push(`<div class="summary-row"><span class="label">- Trade Allowance:</span><span class="value">$${fmt(tradeAllowance)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ FL Waste Tire Fee:</span><span class="value">$${fmt(floridaWasteTireFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ FL Battery Fee:</span><span class="value">$${fmt(floridaBatteryFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Dealer Fee:</span><span class="value">$${fmt(dealerFee)}</span></div>`);

            rows.push(`<div class="summary-row"><span class="label">+ Private Tag Agency Fee:</span><span class="value">$${fmt(privateTagAgencyFee)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Total Taxable:</span><span class="value">$${fmt(totalTaxable)}</span></div>`);
            rows.push("<hr>");
            // Determine the tax rate percentage and state for display
            const taxRatePercent = taxOutsideFl ? customTaxRate : salesTaxRate * 100;
            const stateAbbrev = taxOutsideFl && selectedState ? selectedState : "FL";
            rows.push(`<div class="summary-row"><span class="label">+ ${stateAbbrev} Sales Tax: ${taxRatePercent}%</span><span class="value">$${fmt(salesTax)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ FL Lemon Law Fee:</span><span class="value">$${fmt(lemonLawFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Tag & Title Fee:</span><span class="value">$${fmt(tagFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Trade Payoff:</span><span class="value">$${fmt(tradePayoff)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Delivered Price:</span><span class="value">$${fmt(totalDelivered)}</span></div>`);
            rows.push("<hr>");
            rows.push(`<div class="summary-row"><span class="label">- Rebates:</span><span class="value">$${fmt(rebates)}</span></div>`);
            // Add disclosure when rebates reduce taxable amount
            if (rebatesReduceTaxable) {
                rows.push(`<div class="summary-row rebate-disclosure"><span class="disclosure-text">Rebates reduce the taxable amount</span></div>`);
            }
            rows.push(`<div class="summary-row"><span class="label">- Down Payment:</span><span class="value">$${fmt(downPayment)}</span></div>`);
        } else {
            // Used car flow
            const sellPrice = sellingPriceInput + additionalEq;
            const totalTaxable = sellPrice - tradeAllowance + dealerFee + privateTagAgencyFee;

            // Calculate sales tax based on custom tax settings
            let salesTax;
            if (taxOutsideFl) {
                // Custom tax: use custom tax rate (percentage converted to decimal) and do NOT add docStampFlat
                salesTax = totalTaxable < 0 ? 0 : totalTaxable * (customTaxRate / 100);
            } else {
                // Florida tax: use standard rate plus doc stamp
                salesTax = totalTaxable < 0 ? 0 : totalTaxable * salesTaxRate + docStampFlat;
            }
            const totalDelivered = totalTaxable + salesTax + tagFee + tradePayoff;
            finalAmount = totalDelivered - downPayment;
            // Build rows for used car flow
            rows.push(`<div class="summary-row"><span class="label">Selling Price:</span><span class="value">$${fmt(sellingPriceInput)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Additional Equipment:</span><span class="value">$${fmt(additionalEq)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">- Trade Allowance:</span><span class="value">$${fmt(tradeAllowance)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Dealer Fee:</span><span class="value">$${fmt(dealerFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Private Tag Agency Fee:</span><span class="value">$${fmt(privateTagAgencyFee)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Total Taxable:</span><span class="value">$${fmt(totalTaxable)}</span></div>`);
            rows.push("<hr>");
            // Determine the tax rate percentage and state for display
            const taxRatePercent = taxOutsideFl ? customTaxRate : salesTaxRate * 100;
            const stateAbbrev = taxOutsideFl && selectedState ? selectedState : "FL";
            rows.push(`<div class="summary-row"><span class="label">+ ${stateAbbrev} Sales Tax: ${taxRatePercent}%</span><span class="value">$${fmt(salesTax)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Tag & Title Fee:</span><span class="value">$${fmt(tagFee)}</span></div>`);
            rows.push(`<div class="summary-row"><span class="label">+ Trade Payoff:</span><span class="value">$${fmt(tradePayoff)}</span></div>`);
            rows.push(`<div class="summary-row total-row"><span class="label">= Delivered Price:</span><span class="value">$${fmt(totalDelivered)}</span></div>`);
            rows.push("<hr>");
            rows.push(`<div class="summary-row"><span class="label">- Down Payment:</span><span class="value">$${fmt(downPayment)}</span></div>`);
        }
        // Render results using grid-aligned summary rows
        const resultDiv = document.getElementById("qp-results");
        const summaryHTML = rows.join("");
        const clientNameBlock = clientName
            ? `<div class="client-name-display">
                    <span class="client-name-label">Client Name:</span>
                    <span class="client-name-value">${escapeHtml(clientName)}</span>
               </div>`
            : "";
        // Render the itemized summary
        resultDiv.innerHTML = `
            ${clientNameBlock}
            <h3>Itemized Summary</h3>
            ${summaryHTML}
            <hr>
            <div class="summary-row total-row">
                <span class="label">Amount to Finance:</span>
                <span class="value">$${fmt(finalAmount)}</span>
            </div>
        `;

        // Action buttons: Use in Payment Calculator & Print Summary
        let actions = document.getElementById("qp-actions");
        if (!actions) {
            actions = document.createElement("div");
            actions.id = "qp-actions";
            actions.className = "button-group";
            resultDiv.after(actions);
        }
        actions.innerHTML = `
            <button type="button" id="use-in-payment-btn" class="calculate-btn">
                Use in Payment Calculator
            </button>
            <button type="button" id="print-summary-btn" class="calculate-btn">
                Print Summary
            </button>
        `;

        const useBtn = document.getElementById("use-in-payment-btn");
        if (useBtn) {
            useBtn.addEventListener("click", () => {
                const paymentInput = document.getElementById("loan-amount");
                if (paymentInput) {
                    paymentInput.value = finalAmount.toFixed(2);
                }

                const paymentTabBtn = document.querySelector('.tab-btn[data-tab="payment-calculators"]');
                if (paymentTabBtn) {
                    paymentTabBtn.click();
                }

                const monthlyCalculatorBtn = document.querySelector('#payment-calculators .tab-btn[data-calculator="payment-calc"]');
                if (monthlyCalculatorBtn) {
                    monthlyCalculatorBtn.click();
                }

                if (paymentInput) {
                    setTimeout(() => {
                        paymentInput.focus();
                        paymentInput.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 60);
                }
            });
        }

        const printBtn = document.getElementById("print-summary-btn");
        if (printBtn) {
            printBtn.addEventListener("click", () => {
                window.print();
            });
        }
        // Scroll quick pencil results into view
        resultDiv.scrollIntoView({ behavior: "smooth" });
    });

    // Clear Quick Pencil form and results
    const clearBtn = document.getElementById("qp-clear-btn");
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            if (tagTypeSelect) {
                tagTypeSelect.value = "new";
            }
            updateFields("new");
            form.querySelectorAll("input").forEach((input) => (input.value = ""));
            document.getElementById("qp-results").innerHTML = "";
            const actions = document.getElementById("qp-actions");
            if (actions) actions.remove();
            refreshCustomTagVisibility();
        });
    }

    // State select autocomplete behavior: hide dropdown until typing
    const stateInput = document.getElementById("state-select");
    const stateDatalistId = "states-list";

    if (stateInput) {
        // Initially remove the list attribute to hide the dropdown
        stateInput.removeAttribute("list");

        // On focus, only show datalist if there's already text
        stateInput.addEventListener("focus", function () {
            if (this.value.trim().length > 0) {
                this.setAttribute("list", stateDatalistId);
            } else {
                this.removeAttribute("list");
            }
        });

        // Show datalist as user types
        stateInput.addEventListener("input", function () {
            if (this.value.trim().length > 0) {
                this.setAttribute("list", stateDatalistId);
            } else {
                this.removeAttribute("list");
            }
        });

        // Remove datalist when field is emptied or loses focus with no value
        stateInput.addEventListener("blur", function () {
            if (this.value.trim().length === 0) {
                this.removeAttribute("list");
            }
        });
    }
});
