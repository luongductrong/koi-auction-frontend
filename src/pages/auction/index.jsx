import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AuctionPage from './auction';

function Auction() {
  const [key, setKey] = useState(0);
  const location = useLocation();

  console.log('Parent Auction render');

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [location.search]);
  return <AuctionPage key={key} />;
}

export default Auction;
