const { moneyWithCurrency } = require('./money_with_currency');

module.exports.moneyWithoutTrailingZeros = function moneyWithoutTrailingZeros(price) {
    // the price that this object gets has 2 fields it is not the same value in "real" env,
    // at real it should be only a number multiplied by 100
    const moneyWithCurrencyAndTrailingZeros = moneyWithCurrency(price);
    return moneyWithCurrencyAndTrailingZeros.replace(
        /([,.][^0]*(0+))\D*$/,
        (match, group, zeros) => {
            const cutSize = zeros.length > 1 ? zeros.length + 1 : zeros.length;
            return match.replace(group, group.substring(0, group.length - cutSize));
        }
    );
};
