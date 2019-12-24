import { Component } from 'react';
import { prettyBytes } from './utilities';

class DownloadSpeed extends Component {
  constructor(props) {
    super(props);
    this.speed = 0;
  }

  getSnapshotBeforeUpdate(prevProps) {
    this.speed = this.props.bytesDownloaded - prevProps.bytesDownloaded;
    if (this.speed < 0) this.speed = this.props.bytesDownloaded;

    return { status: this.props.status };
  }

  componentDidUpdate() {}

  render() {
    return (
      this.props.status === 'progressing' &&
      prettyBytes(this.speed * 2) + '/s - '
    );
  }
}

export default DownloadSpeed;
