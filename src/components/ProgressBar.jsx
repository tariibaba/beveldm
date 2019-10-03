import React from 'react';
import './ProgressBar.css';

function ProgressBar({ value }) {
  const width = 200;
  let progressWidth = width * value;
  if (!value || value < 0)
    progressWidth = 0;
  if (value > 1)
    progressWidth = width;
  return (
    <div className="ProgressBar-progress-bar" style={{ width: width+'px' }}>
      <div className="ProgressBar-progress" style={{ width: progressWidth }}></div>
    </div>
  );
}

export default ProgressBar;
