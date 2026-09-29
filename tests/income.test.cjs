const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');

// Exercise the actual browser helpers without adding a build system or DOM dependency.
const source = readFileSync(require.resolve('../script.js'), 'utf8');
const start = source.indexOf('    function calculateMonthlyIncome(');
const end = source.indexOf('    // Function to setup Enter key navigation', start);
assert.ok(start >= 0 && end > start);
const alerts = [];
const calculator = vm.createContext({ Date, alert: (message) => alerts.push(message) });
vm.runInContext(source.slice(start, end), calculator);
const { parseDate, calculateMonthlyIncome, calculateMonthlyBasePay } = calculator;

// Expected results obtained by executing GMF's live dealer calculator on 2026-09-28.
// https://dealers.gmfinancial.com/en-us/dealer-support/income-calculator.html
const cases = [
    ['Neal: January 1 hire', 135143, '08/31/2026', '01/01/2026', '08/31/2026', 16829.76],
    ['Neal: actual hire date', 135143, '08/31/2026', '01/10/2013', '08/31/2026', 16829.76],
    ['Established hire ignores period end', 135143, '08/31/2026', '01/10/2013', '08/15/2026', 16829.76],
    ['Established hire uses check date', 135143, '08/15/2026', '01/10/2013', '08/31/2026', 18019.07],
    ['Midyear hire uses period end', 135143, '08/31/2026', '02/01/2026', '08/15/2026', 21017.57],
    ['Midyear hire ignores later check date', 135143, '08/20/2026', '02/01/2026', '08/15/2026', 21017.57],
    ['Missing period end falls back to check date', 135143, '08/31/2026', '02/01/2026', '', 19389.24],
    ['Partial hire month', 24000, '08/31/2026', '04/15/2026', '08/23/2026', 5581.40],
    ['Same month hire preserves GMF convention', 1500, '08/31/2026', '08/10/2026', '08/25/2026', 2631.58],
    ['February end', 10000, '02/28/2026', '01/01/2020', '02/28/2026', 5181.35],
    ['Leap February end', 10000, '02/29/2024', '01/01/2020', '02/29/2024', 5076.14],
    ['30-day month', 60000, '06/30/2026', '01/01/2020', '06/30/2026', 10000],
    ['Year boundary: established hire', 3000, '01/08/2026', '01/01/2020', '12/31/2025', 11111.11],
    ['Year boundary: later hire', 3000, '01/08/2026', '12/01/2025', '12/31/2025', 2803.74],
];
for (const [name, amount, check, hire, periodEnd, expected] of cases) {
    test(name, () => {
        assert.equal(calculateMonthlyIncome(amount, parseDate(check), parseDate(hire),
            periodEnd ? parseDate(periodEnd) : undefined), expected);
    });
}

test('Optional hire date means employed before the paystub year', () => {
    assert.equal(calculateMonthlyIncome(135143, parseDate('08/31/2026'), null), 16829.76);
});

test('Local date parsing preserves the date, including ISO and leap day', () => {
    for (const value of ['08/31/2026', '2026-08-31', '8/31/26']) {
        const date = parseDate(value);
        assert.deepEqual([date.getFullYear(), date.getMonth(), date.getDate()], [2026, 7, 31]);
    }
    assert.equal(parseDate('02/29/2024').getDate(), 29);
    for (const value of ['', 'nonsense', '02/29/2026', '04/31/2026', '13/01/2026', '00/01/2026']) {
        assert.equal(parseDate(value), null, value);
    }
});

test('Invalid income and dates cannot produce estimates', () => {
    const check = parseDate('08/31/2026');
    for (const amount of [0, -1, NaN, Infinity]) {
        assert.equal(calculateMonthlyIncome(amount, check, null), null);
    }
    assert.equal(calculateMonthlyIncome(1000, null, null), null);
    assert.equal(calculateMonthlyIncome(1000, check, parseDate('09/01/2026')), null);
    assert.equal(calculateMonthlyIncome(1000, check, parseDate('08/15/2026'), parseDate('08/01/2026')), null);
    const future = new Date(new Date().getFullYear() + 3, 0, 1);
    assert.equal(calculateMonthlyIncome(1000, future, null), null);
    // GMF can divide by zero for this same-month edge; retain our guard.
    assert.equal(calculateMonthlyIncome(1000, parseDate('02/28/2026'), parseDate('02/27/2026')), null);
    assert.ok(alerts.length > 0);
});

for (const [frequency, expected] of [['weekly', '4333.33'], ['biweekly', '2166.67'],
    ['semimonthly', '2000.00'], ['monthly', '1000.00']]) {
    test(`Base pay: ${frequency}`, () => {
        assert.equal(calculateMonthlyBasePay(1000, frequency).toFixed(2), expected);
    });
}

test('Base pay rejects invalid amounts and frequencies', () => {
    for (const amount of [0, -100, NaN, Infinity]) {
        assert.equal(calculateMonthlyBasePay(amount, 'weekly'), null);
    }
    assert.equal(calculateMonthlyBasePay(1000, 'invalid'), null);
});
