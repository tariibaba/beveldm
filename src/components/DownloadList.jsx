import React from 'react';
import Download from './Download';

function DownloadList({ downloads = [] }) {
  return (
    <div>
      {downloads.map(download =>
        <Download key={download.id} url={download.url} filename={download.filename} 
          size={download.size} bytesDownloaded={download.bytesDownloaded}/>)}
    </div>
  );
}

export default DownloadList;
