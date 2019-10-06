import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';

function Download({
  id,
  url,
  filename,
  dirname,
  size,
  bytesDownloaded,
  status
}) {
  return (
    <div>
      Url: {url}
      <br />
      Name: {filename}
      <br />
      Directory: {dirname}
      <br />
      {getFriendlyStorage(bytesDownloaded).size}&nbsp;
      {getFriendlyStorage(bytesDownloaded).unit} of&nbsp;
      {getFriendlyStorage(size).size}&nbsp;
      {getFriendlyStorage(size).unit}
      <ProgressBar value={bytesDownloaded / size} />
      <DownloadActionButton id={id} status={status} />
    </div>
  );
}

function getFriendlyStorage(bytes) {
  const units = ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb'];
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024) {
    size /= 1024;
    unitIndex++;
  }
  return { size: size.toPrecision(3), unit: units[unitIndex] };
}

export default connect()(Download);
