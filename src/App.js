import React, { Component } from 'react';
import AddNewDownload from './components/AddNewDownload';
import DownloadList from './components/DownloadList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AddNewDownload />
        <DownloadList />
      </div>
    );
  }
}

export default App;
