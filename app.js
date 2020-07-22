document.querySelector('input.num').addEventListener('keyup', addCommas);

document.getElementById('loan-form').addEventListener('submit', function (e) {
    // hide any existing error messages
    if (document.getElementsByClassName('alert').length > 0) {
        document.querySelector('.alert').remove();
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
        return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }); // courtesy of Divya K: https://codepen.io/kdivya/pen/oxVeWz
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
    const principal = parseFloat(amount.value.replace(/,/gi, ""));
    const calculatedInterest = parseFloat(interest.value.replace(/,/gi, "")) / 100 / 12;
    const calculatedPayments = parseFloat(years.value.replace(/,/gi, "")) * 12;
    // compute monthly payments
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);
    // validate monthly's value
    if (isFinite(monthly)) {
        monthlyPayment.value = parseFloat(monthly.toFixed(2)).toLocaleString();
        totalPayment.value = parseFloat((monthly * calculatedPayments).toFixed(2)).toLocaleString();
        totalInterest.value = parseFloat(((monthly * calculatedPayments) - principal).toFixed(2)).toLocaleString();
        // show results
        document.getElementById('results').style.display = 'block';
    } else {
        showError('There may be an error in your inputs. Please try again.');
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
    // clear error
    if (document.getElementsByClassName('alert').length > 1) {
        clearError();
    }
}

// Clear Error
function clearError() {
    document.querySelector('.alert').remove();
}