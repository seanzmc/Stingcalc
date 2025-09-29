# Stingcalc - Auto Loan Payment Calculator

A comprehensive web-based calculator for auto loans with three main functionalities:

## Features

### 🚗 Payment Calculator

- Calculate monthly payment based on loan amount, term, and interest rate
- Includes Florida documentary stamp tax calculation ($0.35 per $100, capped at $2,450)
- Option to disable doc stamps for loans outside Florida

### 💰 Loan Amount Calculator

- Calculate maximum loan amount based on desired monthly payment
- Factors in interest rate and loan term
- Includes documentary stamp tax considerations

### 📊 Monthly Income Calculator

- Estimate monthly gross income from year-to-date earnings
- Accounts for partial years when hired during current year
- Handles partial months for accurate calculations
- Supports flexible date input formats


## Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Navigation**: Tab through fields, Enter to advance or calculate
- **Input Validation**: Real-time validation with helpful error messages
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Performance Optimized**: Minimal dependencies, fast loading

## How to Use

### Option 1: GitHub Pages (Recommended)
Visit: https://seanzmc.github.io/Stingcalc/

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
- `index.html` - Main application structure
- `script.js` - Calculator logic and DOM manipulation
- `styles.css` - Responsive styling and layout

- `README.md` - Documentation

## License

Free to use for personal and commercial purposes.
