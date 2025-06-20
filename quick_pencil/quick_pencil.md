# Refined "Quick Pencil" App Logic

Here is a streamlined model for the app's user interface and the backend calculations.

## **I. User Input Fields**

This is the information the user will need to enter. We can group them logically on the screen.

### **Vehicle & Pricing (Top Section)**

* `Sale Type`: **New / Used** (This toggle is the most important input, as it changes the entire calculation flow).
* `M.S.R.P.`: *(Required, "New" only)*
* `Selling Price`: *(Required, "Used" only)*
* `Additional Equipment`: *(Optional)*
* `Discount`: *(Optional, "New" only)*
* `Rebates`: *(Optional, "New" only)*

### **Trade-In (Middle Section)**

* `Trade Allowance`: *(Optional)*
* `Trade Payoff`: *(Optional)*

### **Finalizing the Deal (Bottom Section)**

* `Tag Type`: **New Tag / Transfer Tag** (This toggle sets the fee).
* `Down Payment`: *(Optional)*

## **II. The "New Car" Calculation Flow**

When the `Sale Type` is set to "New":

1. **Start with Base Price:**
    * `M.S.R.P.` *(User Input)*
    * \+ `Additional Equipment` *(User Input)*
    * \- `Discount` *(User Input)*
    * **= `Selling Price`**

2. **Calculate Taxable Amount:**
    * `Selling Price`
    * \- `Trade Allowance` *(User Input)*
    * \+ Florida Waste Tire Fee `($5.00)`
    * \+ Florida Battery Fee `($1.50)`
    * \+ Private Tag Agency Fee `($299.00)`
    * **= `Total Taxable Amount`**

3. **Calculate Total Price:**
    * `Total Taxable Amount`
    * \+ Sales Tax `(Total Taxable Amount * 0.06) + $75.00`
    * \+ Florida Lemon Law Fee `($2.00)`
    * \+ Tag and Title Fee `($450 for New Tag / $350 for Transfer)`
    * \+ `Trade Payoff` *(User Input)*
    * **= `Total Delivered Price`**

4. **Calculate Final Amount:**
    * `Total Delivered Price`
    * \- `Rebates` *(User Input)*
    * \- `Down Payment` *(User Input)*
    * **= `Cash Due or Amount to be Financed`**

### **III. The "Used Car" Calculation Flow**

When the `Sale Type` is set to "Used":

1. **Calculate Taxable Amount:**
    * `Selling Price` *(User Input)*
    * \+ `Additional Equipment` *(User Input)*
    * \- `Trade Allowance` *(User Input)*
    * \+ Private Tag Agency Fee `($299.00)`
    * **= `Total Taxable Amount`**

2. **Calculate Total Price:**
    * `Total Taxable Amount`
    * \+ Sales Tax `(Total Taxable Amount * 0.06) + $75.00`
    * \+ Tag and Title Fee `($450 for New Tag / $350 for Transfer)`
    * \+ `Trade Payoff` *(User Input)*
    * **= `Total Delivered Price`**

3. **Calculate Final Amount:**
    * `Total Delivered Price`
    * \- `Down Payment` *(User Input)*
    * **= `Cash Due or Amount to be Financed`**

### Suggestions for Implementation

* **Real-Time Calculation:** The app should recalculate the final number instantly every time a user enters or changes a value in any field.
* **Clear Output Display:** Don't just show the final number. Display a clean, itemized summary of the calculation so the user (and their customer) can see exactly how you arrived at the `Total Delivered Price` and the final `Amount to be Financed`.
* **Error Handling:** If a required field is empty, the calculation should pause, and the field could be highlighted in red to prompt the user for input.

This structure provides a clear and accurate roadmap for building out the "Quick Pencil" function. You have all the core logic and fixed values identified, which is the most critical part of the process.
