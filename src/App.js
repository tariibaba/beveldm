import React, { Component } from 'react';
import AddNewDownload from './components/AddNewDownload';
import DownloadList from './components/DownloadList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloads: []
    };
  }

  render() {
    return (
      <div className="App">
        <AddNewDownload />
        <DownloadList downloads={this.state.downloads} />
      </div>
    );
  }
}

export default App;
