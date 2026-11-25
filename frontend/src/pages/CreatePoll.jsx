
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreatePoll() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;

    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validOptions = options
      .map(option => option.trim())
      .filter(option => option !== '');

    if (!question.trim() || validOptions.length < 2) {
      setError('Enter a question and at least two options.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/polls', {
        question: question.trim(),
        options: validOptions
      });

      navigate(`/poll/${response.data.poll._id}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Failed to create poll.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Create a Poll
      </h1>

      <p className="text-gray-500 mb-8">
        Ask a question and let people vote.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <label className="block font-semibold mb-2">
          Your Question
        </label>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="block font-semibold mb-3">
          Poll Options
        </label>

        {options.map((option, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input
              type="text"
              value={option}
              onChange={(e) =>
                handleOptionChange(index, e.target.value)
              }
              placeholder={`Option ${index + 1}`}
              className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={() => removeOption(index)}
              disabled={options.length <= 2}
              className="text-red-500 px-3 disabled:opacity-30"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="text-indigo-600 font-semibold mt-2"
        >
          + Add another option
        </button>

        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}

export default CreatePoll;
