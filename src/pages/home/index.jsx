import React, { useEffect, useState } from 'react';
import Introduction from '../../components/Introduction';
import AuctionHome from '../../components/AuctionHome';
import Partner from '../../components/Partner';
import ViewAllButton from '../../components/ViewAllButton';
import api from '../../configs';

function Home() {
  const [scheduledAuctions, setScheduledAuctions] = useState([]);
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    const fetchScheduledAuctions = async () => {
      try {
        setLoading1(true);
        const response = await api.get('/auction/filter?page=0&size=4&status=scheduled&desc=ASC');
        console.log('Scheduled Response:', response?.data?.auctions);
        setScheduledAuctions(response?.data?.auctions);
      } catch (error) {
        console.error('Error fetching scheduled auctions:', error);
      } finally {
        setLoading1(false);
      }
    };

    const fetchOngoingAuctions = async () => {
      try {
        setLoading2(true);
        const response = await api.get('/auction/filter?page=0&size=4&status=ongoing&desc=DESC');
        console.log('Ongoing Response:', response?.data?.auctions);
        setOngoingAuctions(response?.data?.auctions);
      } catch (error) {
        console.error('Error fetching ongoing auctions:', error);
      } finally {
        setLoading2(false);
      }
    };

    fetchScheduledAuctions();
    fetchOngoingAuctions();
  }, []);

  return (
    <>
      <Introduction />
      <AuctionHome auctions={scheduledAuctions} type="scheduled" loading={loading1} />
      <AuctionHome auctions={ongoingAuctions} type="ongoing" loading={loading2} />
      <ViewAllButton />
      <Partner />
    </>
  );
}

export default Home;
