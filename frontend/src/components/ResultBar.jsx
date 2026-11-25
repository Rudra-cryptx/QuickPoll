
function ResultBar({ option }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="font-medium text-gray-700">
          {option.text}
        </span>

        <span className="text-gray-500">
          {option.percentage}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all"
          style={{ width: `${option.percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ResultBar;
