import React from 'react';
import Download from './Download';
import { connect } from 'react-redux';

const styles = {
  main: {
    textAlign: 'center'
  },
  list: {
    display: 'inline-block',
    width: '600px',
    textAlign: 'left'
  }
};

function DownloadList({ downloads = [] }) {
  return (
    <div style={styles.main}>
      <div style={styles.list}>
        {downloads.map(download => (
          <Download key={download.id} {...download} />
        ))}
      </div>
    </div>
  );
}

export default connect(state => ({
  downloads: state.downloads
}))(DownloadList);
