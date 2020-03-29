import React from 'react';
import { Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { connect } from 'react-redux';
import when from 'when-expression';
import { openDialog } from '../actions';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: 1298
  }
}));

function AddNewDownload({ type, onClick }) {
  const classes = useStyles();

  const handleClick = () => {
    onClick(type);
  };

  return (
    <Fab
      className={classes.root}
      onClick={handleClick}
      variant="extended"
      color="primary"
    >
      <Add />
      New download
    </Fab>
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
