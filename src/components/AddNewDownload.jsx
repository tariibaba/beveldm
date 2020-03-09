import React from 'react';
import { Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { connect } from 'react-redux';
import when from 'when-expression';
import { openDialog } from '../actions';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    bottom: 0,
    transform: 'translateY(50%)'
  }
}));

function AddNewDownload({ type, onClick }) {
  const classes = useStyles();

  const handleClick = () => {
    onClick(type);
  };

  return (
    <div>
      <Fab className={classes.root} onClick={handleClick}>
        <Add />
      </Fab>
    </div>
  );
}

export default connect(
  ({ downloadGroup }) => ({
    type: when(downloadGroup)({
      all: 'addtoall',
      youtube: 'addyoutube',
      else: null
    })
  }),
  dispatch => ({
    onClick(type) {
      dispatch(openDialog(type));
    }
  })
)(AddNewDownload);
