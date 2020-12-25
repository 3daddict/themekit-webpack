module.exports.moneyWithCurrency = function moneyWithCurrency(price) {
    if (!price || !price.currencyCode || !price.amount) {
        return '';
    }

    // the price that this object gets has 2 fields it is not the same value in "real" env,
    // at real it should be only a number multiplied by 100
    return new Intl.NumberFormat('en', {
        style: 'currency',
        currency: price.currencyCode,
        maximumFractionDigits: 2,
    }).format(price.amount);
};
