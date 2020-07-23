document.querySelector('#amount').addEventListener('keyup', addCommas);

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

// Dynamically Adds Commas As User Types Loan Amount
function addCommas(e) {
    // skip for arrow keys
    if (e.which >= 37 && e.which <= 40) {
        return;
    }
    // format number with commas using regular expressions
    $(this).val(function (index, value) {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
    // courtesy of Divya K: https://codepen.io/kdivya/pen/oxVeWz
}

// Calculate Results
function calculateResult() {
    console.log('Calculating...');
    // UI variables: inputs
    const amount = document.getElementById('amount');
    const interest = document.getElementById('interest');
    const years = document.getElementById('years');
    // UI variables: outputs
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
        // show results
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