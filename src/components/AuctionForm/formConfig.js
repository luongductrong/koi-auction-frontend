const handleFormVisibleConfig = (auctionMethod) => {
  switch (auctionMethod) {
    case 'Descending':
      return {
        startingPrice: true,
        buyoutPrice: true,
        bidStep: true,
        reductionStep: true,
        durationStep: true,
        bidderDeposit: false, // false
      };
    case 'Fixed-price':
      return {
        startingPrice: false, // false
        buyoutPrice: true,
        bidStep: false, // false
        reductionStep: false, // false
        durationStep: false, // false
        bidderDeposit: false, // false
      };
    case 'First-come':
      return {
        startingPrice: true,
        buyoutPrice: true,
        bidStep: false, // false
        reductionStep: false, // false
        durationStep: false, // false
        bidderDeposit: true,
      };
    default:
      return {
        startingPrice: true,
        buyoutPrice: true,
        bidStep: true,
        reductionStep: false, // false
        durationStep: false, // false
        bidderDeposit: true,
      };
  }
};

export { handleFormVisibleConfig };
