import { Component } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import {
  subscribeToIntervalThunk,
  unsubscribeFromIntervalThunk
} from '../thunks';

class PeriodicUpdate extends Component {
  constructor(props) {
    super(props);
    this.subscribed = false;
    this.id = v4();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.start !== nextProps.start;
  }

  componentDidMount() {
    if (this.props.start) {
      if (!this.subscribed) {
        this.props.dispatch(
          subscribeToIntervalThunk(this.id, () => this.forceUpdate())
        );
        this.subscribed = true;
      }
    } else {
      this.props.dispatch(unsubscribeFromIntervalThunk(this.id));
      this.subscribed = false;
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  componentWillUnmount() {
    this.props.dispatch(unsubscribeFromIntervalThunk(this.id));
  }

  render() {
    return this.props.children;
  }
}

export default connect()(PeriodicUpdate);
