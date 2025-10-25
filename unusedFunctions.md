# Unused Declarations in script.js

This document lists all unused declarations found within functions in `script.js`.

## Summary
- **Total unused declarations found:** 2
- **Types:** Variable declarations (const)

---

## Unused Declaration #1

**Location:** Function `calculateInterestRate()`, Line 247

**Code:**
```javascript
const monthlyRate = rate / 12;
```

**Details:**
- This variable is calculated from the `rate` parameter but never used anywhere in the function
- The function uses `rate` directly in calculations without needing this pre-calculated monthly rate

---

## Unused Declaration #2

**Location:** Function `setupDateFormatting()`, Line 470

**Code:**
```javascript
const originalType = input.type;
```

**Details:**
- This variable stores the original input type attribute
- It appears to have been intended for potential restoration of the original type, but this never occurs in the function
- The input type is changed to 'text' on line 473, but the original type is never referenced or restored