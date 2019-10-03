import React, { Component } from 'react';
import AddNewDownload from './components/AddNewDownload';
import DownloadList from './components/DownloadList';
import { v4 } from 'uuid';
import request from 'request';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloads: []
    };
  }

  handleAdd = url => {
    request.get(url)
      .on('response', res => {
        this.setState(state => ({
          downloads: [
            ...state.downloads,
            {
              id: v4(),
              url,
              filename: this.getFileName(res.headers),
              size: this.getFileSize(res.headers)
            }
          ]
        }));
      });
  };

  getFileName(headers) {
    const regex = /filename=(.+)/i;
    const MATCH_INDEX = 1;
    const matchArray = headers['content-disposition'].match(regex);
    return matchArray[MATCH_INDEX];
  }

  getFileSize(headers) {
    return parseInt(headers['content-length']);
  }

  render() {
    return (
      <div className="App">
        <AddNewDownload onAdd={this.handleAdd} />
        <DownloadList downloads={this.state.downloads} />
      </div>
    );
  }
}

export default App;
