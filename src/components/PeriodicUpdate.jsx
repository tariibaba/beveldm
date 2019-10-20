import { Component } from 'react';

class PeriodicUpdate extends Component {
  constructor(props) {
    super(props);
    this.intervalStarted = false;
  }

  shouldComponentUpdate(nextProps) {
    return this.props.start !== nextProps.start;
  }

  componentDidUpdate() {
    if (this.props.start) {
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

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return this.props.children;
  }
}

export default PeriodicUpdate;
