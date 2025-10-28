# Stingcalc - Comprehensive Automotive Financing Toolkit

A powerful web-based calculator suite designed for automotive financing professionals, featuring five specialized calculators to streamline vehicle sales and loan calculations.

## Features

### 🚗 Payment Calculator

- Calculate monthly payment based on loan amount, term, and interest rate
- Includes Florida documentary stamp tax calculation ($0.35 per $100, capped at $2,450)
- Option to disable doc stamps for loans outside Florida
- Smooth scroll to results section
- Clear button with automatic focus management

### 💰 Loan Amount Calculator

- Calculate maximum loan amount based on desired monthly payment
- Factors in interest rate and loan term
- Includes documentary stamp tax considerations
- Contextual validation with helpful error messages
- Integration with Payment Calculator workflow

### 📊 Monthly Income Calculator

- Estimate monthly gross income from year-to-date earnings
- Accounts for partial years when hired during current year
- Handles partial months for accurate calculations
- Automatic date formatting (MM/DD/YYYY)
- Supports flexible date input formats
- Real-time validation with clear feedback

### 🔍 Interest Rate Solver

- Reverse-calculate APR from known principal, term, and target payment
- Implements Newton-Raphson numerical method for precise rate solving
- Binary search fallback for convergence edge cases
- Handles complex loan scenarios with documentary stamps
- Useful for competitive rate analysis and loan comparison

### 🏷️ Quick Pencil Vehicle Calculator

The most comprehensive tool in the suite (~40% of codebase), designed specifically for dealership environments:

#### Vehicle Modes

- **New Vehicle Mode**: MSRP-based calculations with discount/markup
- **Used Vehicle Mode**: Direct selling price entry

#### Florida Fee Schedule (Automatically Applied)

- **Documentary Stamps**: $0.35 per $100 (capped at $2,450)
- **Waste Tire Fee**: $5.00
- **Battery Fee**: $1.50
- **Lemon Law Fee**: $2.00
- **Private Tag Agency Fee**: $299.00
- **Sales Tax**: Configurable rate (default 6%) + $75 doc stamp

#### Tag and Registration

- **New Tag**: $450.00
- **Transfer Tag**: $350.00

#### Trade-In Handling

- Trade allowance entry
- Trade payoff calculation
- Net trade value computation
- Automatic adjustment to amount financed

#### Multi-State Support

- Supports all 50 states with custom tax rate configuration
- State-specific tax calculations
- Flexible fee structure for different jurisdictions

#### Professional Features

- **Integration Button**: One-click transfer to Payment Calculator
- **Print Functionality**: Generate customer-ready summary sheets
- **Real-time Calculations**: Instant updates as values change
- **Clear Workflow**: Step-by-step guided input process

## Technical Features

### User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Enhanced Keyboard Navigation**:
  - Tab through fields
  - Enter to advance or calculate
  - Arrow keys for numeric adjustments
  - Shift/Ctrl/Alt modifiers for different step sizes
- **Smooth Scrolling**: Automatic scroll to results sections
- **Focus Management**: Intelligent focus handling after clear operations

### Input Handling

- **Automatic Date Formatting**: Smart MM/DD/YYYY formatting as you type
- **Real-time Validation**: Immediate feedback on invalid inputs
- **Contextual Error Messages**: Clear, actionable error descriptions
- **Flexible Formats**: Accepts various date and number input styles

### Calculation Engine

- **Precision Algorithms**: Newton-Raphson method for rate solving
- **Documentary Stamp Logic**: Accurate Florida tax calculations
- **Multi-state Tax Support**: Configurable rates for all 50 states
- **Rounding Accuracy**: Proper financial rounding throughout

### Integration & Output

- **Multi-Calculator Integration**: Quick Pencil populates Payment Calculator
- **Print Functionality**: Professional customer summaries from Quick Pencil
- **Clear Actions**: Reset individual calculators without losing other data
- **Accessibility**: Screen reader friendly with proper ARIA labels

## How to Use

### Option 1: GitHub Pages (Recommended)

Visit: <https://seanzmc.github.io/Stingcalc/>

### Option 2: Local Installation

1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. No additional setup required

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance.

### Linting

This project uses ESLint for JavaScript linting and Stylelint for CSS linting. To install development dependencies and run the linters:

```bash
npm install
npm run lint:js
npm run lint
```

### File Structure

- `index.html` - Main application structure with all 5 calculators
- `script.js` - Core calculator logic and UI enhancements
- `styles.css` - Main responsive styling and layout
- `qp/qp-new.js` - Quick Pencil calculator module
- `qp/qp.css` - Quick Pencil specific styling
- `docs/` - Supporting documentation directory
- `README.md` - This documentation

## Use Cases

### For Dealership Sales Staff

- Quick payment quotes during customer interactions
- Professional printed summaries for customer review
- Multi-state tax calculations for out-of-state buyers
- Trade-in scenario modeling

### For Finance Managers

- Reverse APR calculations for rate verification
- Documentary stamp compliance for Florida transactions
- Income qualification estimates
- Loan structuring with various down payment scenarios

### For Independent Buyers

- Payment comparison across different loan terms
- Maximum loan amount calculation based on budget
- Interest rate impact analysis
- Total cost of financing visualization

## License

Free to use for personal and commercial purposes.
