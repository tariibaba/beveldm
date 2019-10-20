import { Component } from 'react';
import getFriendlyStorage from '../friendly-storage';

class DownloadSpeed extends Component {
  constructor(props) {
    super(props);
    this.speed = 0;
  }

  componentDidUpdate(prevProps) {
    this.speed = this.props.bytesDownloaded - prevProps.bytesDownloaded;
  }

  render() {
    const friendlySpeed = getFriendlyStorage(this.speed * 2);
    return (
      this.props.status === 'started' &&
      friendlySpeed.size + friendlySpeed.unit + '/s - '
    );
  }
}

export default DownloadSpeed;
