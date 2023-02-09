// Input Validation
document.querySelector('#amount').addEventListener('input', validateAmount);
document.querySelector('#interest').addEventListener('input', validateInterest);
document.querySelector('#years').addEventListener('input', validateYears);

// Submit Form / Calculate Results
document.querySelector('#loan-form').addEventListener('submit', function (e) {
    // hide any pre-existing error messages
    clearError();
    // hide results
    document.querySelector('#results').style.display = 'none';
    calculateResult();
    e.preventDefault();
});

// Clear Input
document.querySelector('#clear').addEventListener('mousedown', function clearInput() {
    window.location.reload();
});

// Validate Amount
function validateAmount() {
    // remove leading zero and multiple periods, then split at decimal point
    let parts = this.value.replace(/^0/g, '').replace(/([^.]*\.[^.]*)\./g, '$1').toString().split('.');
    parts[0] = parts[0].replace(/[^0-9]+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // limit second half to 2 decimal points
    if (parts[1] !== undefined) {
        parts[1] = parts[1].replace(/[^0-9]+/g, '').replace(/^(\d{0,2})\d*$/, '$1');
    }
    this.value = parts.join('.');
    console.log(this.value);
}

// Validate Interest Rate
function validateInterest() {
    // remove leading zero and prevent multiple periods, then split at decimal point
    let parts = this.value.replace(/^0/g, '').replace(/([^.]*\.[^.]*)\./g, '$1').toString().split('.');
    // limit first half to two digits (1-99)
    parts[0] = parts[0].replace(/[^0-9]+/g, '').replace(/^(\d{0,2})\d*$/, '$1');
    // limit second half to 2 decimal points
    if (parts[1] !== undefined) {
        parts[1] = parts[1].replace(/[^0-9]+/g, '').replace(/^(\d{0,2})\d*$/, '$1');
    }
    this.value = parts.join('.');
}

// Validate Year
function validateYears() {
    // remove leading zero and and limit to two digits (1-99)
    this.value = this.value.replace(/^0/g, '').replace(/[^0-9]+/g, '').replace(/^(\d{0,2})\d*$/, '$1');
}

// Calculate Results
function calculateResult() {
    // UI letiables: inputs
    const amount = document.querySelector('#amount');
    const interest = document.querySelector('#interest');
    const years = document.querySelector('#years');
    // UI letiables: outputs
    const monthlyPayment = document.querySelector('#monthly-payment');
    const totalPayment = document.querySelector('#total-payment');
    const totalInterest = document.querySelector('#total-interest');
    // remove commas before calculating results
    const principal = parseFloat(amount.value.replace(/,/gi, ''));
    const calculatedInterest = parseFloat(interest.value.replace(/,/gi, '')) / 100 / 12;
    const calculatedPayments = parseFloat(years.value.replace(/,/gi, '')) * 12;
    // compute monthly payments
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);
    // validate monthly's value
    if (isFinite(monthly) && !isNaN(amount.value.replace(/,/gi, '')) && !isNaN(interest.value) && !isNaN(years.value)) {
        // show loading animation
        document.querySelector('#loading').style.display = 'block';
        monthlyPayment.value = `$${parseFloat(monthly.toFixed(2)).toLocaleString()}`;
        totalPayment.value = `$${parseFloat((monthly * calculatedPayments).toFixed(2)).toLocaleString()}`;
        totalInterest.value = `$${parseFloat(((monthly * calculatedPayments) - principal).toFixed(2)).toLocaleString()}`;
        // show loading animation for 1.7 seconds
        setTimeout(() => {
            // display results
            document.querySelector('#results').style.display = 'block';
        }, 1000);
    } else {
        showError('Please check your inputs.');
    }
    // hide loading animation
    document.querySelector('#loading').style.display = 'none';
}

// Display Error Message
function showError(error) {
    const errorDiv = document.createElement('div');
    const card = document.querySelector('.card');
    const heading = document.querySelector('.heading');
    errorDiv.className = 'alert alert-danger';
    // create text node and append to div
    errorDiv.appendChild(document.createTextNode(error));
    // insert error above heading
    card.insertBefore(errorDiv, heading);
    // highlight border red if input is incorrect
    if (amount.value === '' || isNaN(amount.value.replace(/,/gi, ''))) {
        amount.style.borderColor = '#ff6b79';
    }
    if (interest.value === '' || isNaN(interest.value)) {
        interest.style.borderColor = '#ff6b79';
    }
    if (years.value === '' || isNaN(years.value)) {
        years.style.borderColor = '#ff6b79';
    }
    // clear error if another error message already exists
    if (document.getElementsByClassName('alert').length > 1) {
        clearError();
    }
}

// Clear Error
function clearError() {
    // reset border color to default
    amount.style.borderColor = '#ced4da';
    interest.style.borderColor = '#ced4da';
    years.style.borderColor = '#ced4da';
    // remove alerts
    if (document.getElementsByClassName('alert').length > 0) {
        document.querySelector('.alert').remove();
    }
}