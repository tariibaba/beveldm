import { Component } from 'react';
import prettyBytes from 'pretty-bytes';

class DownloadSpeed extends Component {
  constructor(props) {
    super(props);
    this.speed = 0;
  }

  componentDidUpdate(prevProps) {
    this.speed = this.props.bytesDownloaded - prevProps.bytesDownloaded;
  }

  render() {
    return (
      this.props.status === 'started' && prettyBytes(this.speed * 2) + '/s - '
    );
  }
}

export default DownloadSpeed;
