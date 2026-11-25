
import { useEffect, useState } from 'react';
import api from '../services/api';
import PollCard from '../components/PollCard';

function Home() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await api.get('/polls');
        setPolls(response.data.polls);
      } catch (err) {
        console.error('Error fetching polls:', err);
        setError('Unable to load polls. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-16 text-gray-500">
        Loading polls...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Discover Polls
        </h1>
        <p className="text-gray-500 mt-2">
          Explore polls and share your opinion.
        </p>
      </div>

      {error && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {!error && polls.length === 0 && (
        <p className="text-gray-500">
          No polls available. Create the first one!
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <PollCard key={poll._id} poll={poll} />
        ))}
      </div>
    </div>
  );
}

export default Home;
