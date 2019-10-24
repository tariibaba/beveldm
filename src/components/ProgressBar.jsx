import React, { Component } from 'react';
import './ProgressBar.css';

class ProgressBar extends Component {
  shouldComponentUpdate(nextProps) {
    let shouldUpdate;
    if (nextProps.value - this.valueBeforeUpdate > 0.01) {
      this.valueBeforeUpdate += 0.01;
      shouldUpdate = true;
    } else if (nextProps.value < this.valueBeforeUpdate) {
      this.valueBeforeUpdate = this.fractionFloor(nextProps.value, 2);
      shouldUpdate = false;
    }
    return shouldUpdate;
  }

  fractionFloor(num, fractionDigits) {
    const powerOf10 = Math.pow(10, fractionDigits);
    return Math.floor(num) + Math.floor(num * powerOf10) / powerOf10;
  }

  render() {
    this.valueBeforeUpdate = this.fractionFloor(this.props.value, 2);
    const width = 200;
    let progressWidth = width * this.valueBeforeUpdate;
    if (!this.valueBeforeUpdate || this.valueBeforeUpdate < 0)
      progressWidth = 0;
    if (this.valueBeforeUpdate > 1) progressWidth = width;

    return (
      <div className="ProgressBar-progress-bar" style={{ width: width + 'px' }}>
        <div
          className="ProgressBar-progress"
          style={{ width: progressWidth }}
        ></div>
      </div>
    );
  }
}

export default ProgressBar;
