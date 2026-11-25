
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ResultBar from '../components/ResultBar';

function getVoterId() {
    let voterId = localStorage.getItem('quickpoll_voter_id');

    if (!voterId) {
        voterId = crypto.randomUUID();
        localStorage.setItem('quickpoll_voter_id', voterId);
    }

    return voterId;
}

function PollDetails() {
    const { id } = useParams();

    const [poll, setPoll] = useState(null);
    const [results, setResults] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPollData = async () => {
        try {
            const [pollResponse, resultsResponse] = await Promise.all([
                api.get(`/polls/${id}`),
                api.get(`/polls/${id}/results`)
            ]);

            setPoll(pollResponse.data.poll);
            setResults(resultsResponse.data.results);
            setTotalVotes(resultsResponse.data.totalVotes);
        } catch (err) {
            console.error(err);
            setError('Unable to load this poll.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPollData();
    }, [id]);

    const handleVote = async () => {
        if (!selectedOption) {
            setError('Please select an option first.');
            return;
        }

        try {
            setError('');

            await api.post(`/polls/${id}/vote`, {
                optionId: selectedOption,
                voterId: getVoterId()
            });

            await fetchPollData();
            setShowResults(true);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || 'Unable to submit your vote.'
            );
        }
    };

    if (loading) {
        return <p className="text-center mt-16">Loading poll...</p>;
    }

    if (!poll || error && !poll) {
        return (
            <div className="text-center mt-16">
                <p className="text-red-600">{error || 'Poll not found.'}</p>
                <Link to="/" className="text-indigo-600">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {poll.question}
                </h1>

                <p className="text-gray-500 mb-8">
                    {totalVotes} total votes
                </p>

                {!showResults ? (
                    <>
                        <div className="space-y-4">
                            {poll.options.map((option) => (
                                <label
                                    key={option._id}
                                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500"
                                >
                                    <input
                                        type="radio"
                                        name="pollOption"
                                        value={option._id}
                                        checked={selectedOption === option._id}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="accent-indigo-600"
                                    />

                                    <span className="font-medium text-gray-700">
                                        {option.text}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={handleVote}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700"
                        >
                            Submit Vote
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-6">
                            Poll Results
                        </h2>

                        {results.map((option) => (
                            <ResultBar key={option.optionId} option={option} />
                        ))}

                        <button
                            onClick={() => setShowResults(false)}
                            className="text-indigo-600 font-semibold mt-4"
                        >
                            Back to Voting
                        </button>
                    </>
                )}

                {error && (
                    <p className="text-red-600 mt-4">{error}</p>
                )}
            </div>
        </div>
    );
}

export default PollDetails;
