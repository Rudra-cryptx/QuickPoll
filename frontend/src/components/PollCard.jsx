
import { Link } from 'react-router-dom';

function PollCard({ poll }) {
  const totalVotes = poll.options.reduce(
    (total, option) => total + option.votes,
    0
  );

  return (
    <article className="poll-card p-6">
      <h2 className="poll-card__question mb-4">
        {poll.question}
      </h2>

      <p className="poll-card__votes mb-4">
        {totalVotes} votes
      </p>

      <Link
        to={`/poll/${poll._id}`}
        className="poll-card__link"
      >
        View poll <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default PollCard;
