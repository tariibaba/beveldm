import { Component } from 'react';

class PeriodicUpdate extends Component {
  constructor(props) {
    super(props);
    this.intervalStarted = false;
  }

  shouldComponentUpdate(nextProps) {
    console.log('should component update');
    return this.props.start !== nextProps.start;
  }

  componentDidUpdate() {
    console.log('component did update');
    if (this.props.start) {
      console.log('this.props.start === true');
      if (!this.intervalStarted) {
        this.intervalStarted = true;
        this.interval = setInterval(() => {
          this.forceUpdate();
        }, 1000);
      }
    } else {
      this.intervalStarted = false;
      clearInterval(this.interval);
    }
  }

  render() {
    return this.props.children;
  }
}

export default PeriodicUpdate;
