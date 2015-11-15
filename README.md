# AmortizationSchedule


Build an amortization schedule program. The program’s output should be viewable

in a browser.

The program should prompt the user for the amount he or she is borrowing, the 

annual percentage rate used to repay the loan, the term, in years, over which the 

loan is repaid.  Store this information in a model called Loan on the server side.

Using the model Loan on the server‐side and the amortization formula (below) 

populate a model called Amortization with the calculated amortization schedule.

Using the model Amortization populate a table in a Jade template on the server‐side. 

The first column identifies the payment number. The second column contains the 

amount of the payment. The third column shows the amount paid to interest. The 

fourth column has the current balance. 

Update the Jade template with the total payment amount and the interest paid 

fields. 

Create a middleware (connect) on the server‐side that will log to the console all 

parameters passed to the server.

Use appropriate variable names and add comments.

Amortization Formula

This will get you your monthly payment using JavaScript: 

M = P * (J / (1 - (Math.pow(1/(1 + J), N))));

Where:

P = Principal 

I = Interest 

J = Monthly Interest in decimal form:  I / (12 * 100) 

N = Number of months of loan 

M = Monthly Payment Amount

To create the amortization table, create a loop in your program and follow these 

steps:

1. Calculate H = P x J, this is your current monthly interest 

2. Calculate C = M ‐ H, this is your monthly payment minus your monthly 

interest, so it is the amount of principal you pay for that month

3. Calculate Q = P ‐ C, this is the new balance of your principal of your loan.

4. Set P equal to Q and go back to Step 1: You thusly loop around until the value 

Q (and hence P) goes to zero.
