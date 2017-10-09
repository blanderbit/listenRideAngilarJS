
function PriceService() {
  return {
    // Calculates the prices for the calendar and booking overview
    // Note that this is just a preview-calculation, the actual data
    // gets calculated in the backend.
    calculatePrices: function(startDate, endDate, prices) {
      var result = {
        subtotal: 0,
        subtotalDiscounted: 0,
        serviceFee: 0,
        total: 0,
      };
      if (startDate !== undefined && endDate !== undefined) {
        var days = date.durationDays(startDate, endDate);
      }
      if (days <= 0) return result;
      result.subtotal = days * prices[0].price;
      if (days < 8) {
        result.subtotalDiscounted = prices[days - 1].price * days;
      } else if (days <= 28) {
        result.subtotalDiscounted = prices[6].price * 7 + (days - 7) * prices[7].price;
      } else {
        result.subtotalDiscounted = prices[8].price * days;
      }
      // Service Fee is 12,5% and includes 0,19% MwSt
      result.serviceFee = (result.subtotalDiscounted * 0.125) * 1.19;
      result.total = result.subtotalDiscounted + result.serviceFee;
      return result;
    }
  };
}