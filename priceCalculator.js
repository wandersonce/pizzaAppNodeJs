const reducer = (accumulator, currentValue) => accumulator + currentValue;
exports.subTotal = function(allValues, totalReturn, qty) {
    totalReturn = (allValues.reduce(reducer))*qty;
    return totalReturn;
} 

exports.taxesCalculator = function(subTotal){
    subTotal =  (subTotal*0.07).toFixed(2);
    subTotal = parseFloat(subTotal);
    return subTotal;
}

exports.totalCalculator = function(subTotal, Totaltaxes, totalValue){
    totalValue = subTotal + Totaltaxes;
    return totalValue;
}   