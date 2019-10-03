import React from 'react';
import Download from './Download';
import { connect } from 'react-redux';

function DownloadList({ downloads = [] }) {
  return (
    <div>
      {downloads.map(download =>
        <Download key={download.id} url={download.url} filename={download.filename}
          size={download.size} bytesDownloaded={download.bytesDownloaded} />)}
    </div>
  );
}

export default connect(
  state => ({
    downloads: state.downloads
  })
)(DownloadList);
