import { Component } from 'react';
import { unsubscribeFromInterval } from '../actions';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import { thunkSubscribeToInterval } from '../thunks';


class PeriodicUpdate extends Component {
  constructor(props) {
    super(props);
    this.subscribed = false;
    this.id = v4();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.start !== nextProps.start;
  }

  componentDidUpdate() {
    if (this.props.start) {
      if (!this.subscribed) {
        this.props.dispatch(thunkSubscribeToInterval(this.id, () => this.forceUpdate()));
        this.subscribed = true;
      }
    } else {
      this.props.dispatch(unsubscribeFromInterval(this.id));
      this.subscribed = false;
    }
  }

  componentWillUnmount() {
    this.props.dispatch(unsubscribeFromInterval(this.id));
  }

  render() {
    return this.props.children;
  }
}

export default connect()(PeriodicUpdate);
