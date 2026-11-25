
function ResultBar({ option }) {
  return (
    <div className="result-row">
      <div className="result-row__labels">
        <span className="font-medium">
          {option.text}
        </span>

        <span className="result-row__percentage">
          {option.percentage}%
        </span>
      </div>

      <div
        className="result-row__track"
        role="progressbar"
        aria-label={`${option.text} results`}
        aria-valuenow={option.percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="result-row__fill"
          style={{ width: `${option.percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ResultBar;
