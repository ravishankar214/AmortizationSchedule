var PRE_PAYMENTS = new Array();
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
};


function Guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
}


function AddPrePayment(dateOfChange, typeOfChange, valueOfChange) {
    var pp = new Object();
    pp.id = Guid();
    pp.dateOfChange = dateOfChange;
    pp.typeOfChange = typeOfChange;
    pp.valueOfChange = valueOfChange;


    PRE_PAYMENTS.push(pp);
}


function DeletePrePayment(obj) {
    if (confirm("Are you sure?")) {
        for (var i = 0; i < PRE_PAYMENTS.length; i++) {
            if (PRE_PAYMENTS[i].id == obj.id) {
                PRE_PAYMENTS.splice(i, 1);
                break;
            }
        }


        GeneratePrepaymentList("divPrepaymentList");
    }
}


function GeneratePrepaymentList(divId) {
    $("#" + divId).html("");


    if (PRE_PAYMENTS.length == 0) {
        return;
    }


    var table = $('<table></table>');


    // Adding headers to the table
    var header = "<tr><th>No</th><th>Date</th><th>Type</th><th>Value</th><th></th></tr>";
    table.append(header);


    var count = 1;
    $(PRE_PAYMENTS).each(function () {
        var row = $('<tr></tr>');


        if (count % 2 == 0) {
            row.addClass("even");
        }
        else {
            row.addClass("odd");
        }


        var dt = new Date(this.dateOfChange);
        var dtText = dt.getDate() + "-" + MONTHS[dt.getMonth()] + "-" + dt.getFullYear();


        row.append('<td>' + count + '</td><td>' + dtText + '</td><td>' + this.typeOfChange + '</td><td>' + RoundNumber(this.valueOfChange,2) + '</td><td><a href=\'javascript:\' id=\'' + this.id + '\' onclick=\'return DeletePrePayment(this)\'><img src=\'images/delete.png\' /></a>');
        table.append(row);
        count++;
    });


    $("#" + divId).html(table);
}


function CalculateStuff(p, n, roi, sd) {
    // Clearing the results
    $("#divResults").html("");
    $("#divResultsSummary").html("");


    // j = interest per month / 100
    var j = roi / 1200;


    var m = (p * j) / (1 - Math.pow((1 + j), (n * -1)));
    var originalTotalLoanAmount = m * n;


    var actualLoanPaid = 0.0;
    var latestEmi = m;


    var bal = p;
    var payment = 0;


    var table = $('<table></table>');
    var header = $('<tr></tr>');
    header.append('<th>No.</th>');
    header.append('<th>EMI Paid</th>');
    header.append('<th>Interest Comp</th>');
    header.append('<th>Remaining Principal</th>');


    table.append(header);


    while (bal > 0) {
        var origDate = new Date(sd);
        var currMonth = new Date(origDate.setMonth(origDate.getMonth() + payment));
        var lumpsumPaid = 0.0;


        var markRow = false;
        // Going through all the payments to see if lumpsum or EMI was revised
        for (var i = 0; i < PRE_PAYMENTS.length; i++) {
            var pp = PRE_PAYMENTS[i];


            var nextMonth = new Date(currMonth);
            nextMonth.setMonth(currMonth.getMonth() + 1);


            var doc = new Date(pp.dateOfChange);


            if (doc >= currMonth && pp.dateOfChange < nextMonth) {
                if (pp.typeOfChange == "ONE_TIME") {
                    lumpsumPaid = lumpsumPaid + parseFloat(pp.valueOfChange);
                    markRow = true;
                } else if (pp.typeOfChange == "EMI_CHANGE") {
                    latestEmi = parseFloat(pp.valueOfChange);
                    markRow = true;
                } else if (pp.typeOfChange == "ROI_CHANGE") {
                    roi = parseFloat(pp.valueOfChange);
                    j = roi / 1200;
                    markRow = true;
                }
            }
        }


        var totalPaid = lumpsumPaid + latestEmi;


        var h = bal * j; // Calculating monthly interest
        var c = totalPaid - h; // Monthly payment - Interest = Principal Paid
        bal = bal - c; // New balance remaining from total loan amount


        var row = $('<tr></tr>');
        if (payment % 2 == 0) {
            row.addClass("even");
        }
        else {
            row.addClass("odd");
        }
        
        if(markRow) {
            row.addClass("marked");
        }


        var balDiff = parseInt(bal) + parseInt(latestEmi);


        if (balDiff != 0) {
            row.append('<td>' + (payment + 1) + '</td>');
           


            if (bal > 0) {
                row.append('<td>' + RoundNumber(totalPaid, 2) + '</td>');
                row.append('<td>' + RoundNumber(h, 2) + '</td>');
                row.append('<td>' + RoundNumber(bal, 2) + '</td>');
            } else if (bal < 0) {
                totalPaid = latestEmi + bal;
                row.append('<td>' + RoundNumber(totalPaid, 2) + '</td>');
                row.append('<td>' + RoundNumber(h, 2) + '</td>');
                row.append('<td>' + RoundNumber(0, 2) + '</td>');
            }
            actualLoanPaid += totalPaid;
            payment++;
        }
        
        table.append(row);
        
    }


    $("#divResults").html(table);
    

}


function RoundNumber(num, places) {
    return numberWithCommas(parseFloat(num).toFixed(places));
}


function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

