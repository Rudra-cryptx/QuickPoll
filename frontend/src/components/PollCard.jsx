
import { Link } from 'react-router-dom';

function PollCard({ poll }) {
  const totalVotes = poll.options.reduce(
    (total, option) => total + option.votes,
    0
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {poll.question}
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        {totalVotes} votes
      </p>

      <Link
        to={`/poll/${poll._id}`}
        className="text-indigo-600 font-semibold hover:underline"
      >
        View Poll →
      </Link>
    </div>
  );
}

export default PollCard;
