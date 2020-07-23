document.querySelector('#amount').addEventListener('input', validateAmount);
document.querySelector('#interest').addEventListener('input', validateInput);
document.querySelector('#years').addEventListener('input', validateInput);

// Submit Form / Calculate Results
document.getElementById('loan-form').addEventListener('submit', function (e) {
    // hide any pre-existing error messages
    if (document.getElementsByClassName('alert').length > 0) {
        clearError();
    }
    // hide results
    document.getElementById('results').style.display = 'none';
    // show loading animation
    document.getElementById('loading').style.display = 'block';
    // show loading animation for 1.7 seconds
    setTimeout(calculateResult, 1700);

    e.preventDefault();
});

// Clear Input
document.getElementById('clear').addEventListener('mousedown', function clearInput(e) {
    window.location.reload();
});

// Validate Amount
function validateAmount(e) {
    // format number with commas using regular expressions
    $(this).val(function (index, value) {
        // split at decimal point and validate before the decimal and limit to 2 digits (99 max)
        let parts = value.toString().split('.');
        parts[0] = parts[0].replace(/[^0-9]+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // validate after the decimal and limit to 2 decimal points
        if (parts[1] !== undefined) {
            parts[1] = parts[1].replace(/[^0-9]+/g, '').replace(/^(\d{0,2})\d*$/, '$1');
        }
        console.log(parts[1]);
        return parts.join('.');
    });
}

// Validate Interest Rate and Year
function validateInput(e) {
    // format number with commas using regular expressions
    $(this).val(function (index, value) {
        // split at decimal point and validate before the decimal
        let parts = value.toString().split('.');
        parts[0] = parts[0].replace(/[^0-9]+/g, '').replace(/^(\d{0,2})\d*$/, '$1');
        // validate after the decimal and limit to 2 decimal points
        if (parts[1] !== undefined) {
            parts[1] = parts[1].replace(/[^0-9]+/g, '').replace(/^(\d{0,2})\d*$/, '$1');
        }
        console.log(parts[1]);
        return parts.join('.');
    });
}

// Calculate Results
function calculateResult() {
    console.log('Calculating...');
    // UI letiables: inputs
    const amount = document.getElementById('amount');
    const interest = document.getElementById('interest');
    const years = document.getElementById('years');
    // UI letiables: outputs
    const monthlyPayment = document.getElementById('monthly-payment');
    const totalPayment = document.getElementById('total-payment');
    const totalInterest = document.getElementById('total-interest');
    // remove commas before calculating results
    const principal = parseFloat(amount.value.replace(/,/gi, ''));
    const calculatedInterest = parseFloat(interest.value.replace(/,/gi, '')) / 100 / 12;
    const calculatedPayments = parseFloat(years.value.replace(/,/gi, '')) * 12;
    // compute monthly payments
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);
    // validate monthly's value
    if (isFinite(monthly) && !isNaN(amount.value.replace(/,/gi, '')) && !isNaN(interest.value) && !isNaN(years.value)) {
        monthlyPayment.value = `$${parseFloat(monthly.toFixed(2)).toLocaleString()}`;
        totalPayment.value = `$${parseFloat((monthly * calculatedPayments).toFixed(2)).toLocaleString()}`;
        totalInterest.value = `$${parseFloat(((monthly * calculatedPayments) - principal).toFixed(2)).toLocaleString()}`;
        // display results
        document.getElementById('results').style.display = 'block';
    } else {
        showError('Please check your inputs.');
    }
    // hide loading animation
    document.getElementById('loading').style.display = 'none';
}

// Display Error Message
function showError(error) {
    // create a div
    const errorDiv = document.createElement('div');
    // get elements
    const card = document.querySelector('.card');
    const heading = document.querySelector('.heading');
    // add class to element
    errorDiv.className = 'alert alert-danger';
    // create text node and append to div
    errorDiv.appendChild(document.createTextNode(error));
    // insert error above heading
    card.insertBefore(errorDiv, heading);
    // highlight border red if input is incorrect
    if (amount.value === '' || isNaN(amount.value.replace(/,/gi, ''))) {
        amount.style.borderColor = 'red';
    }
    if (interest.value === '' || isNaN(interest.value)) {
        interest.style.borderColor = 'red';
    }
    if (years.value === '' || isNaN(years.value)) {
        years.style.borderColor = 'red';
    }
    // clear error
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
    document.querySelector('.alert').remove();
}