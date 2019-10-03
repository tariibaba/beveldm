import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';

function Download({ url, filename, size, bytesDownloaded }) {
  return (
    <div>
      Url: {url}<br />
      Name: {filename}<br />
      Size: {size}
      <ProgressBar value={bytesDownloaded / size} />
    </div>
  );
}

export default connect()(Download);
