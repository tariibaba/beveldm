import React, { createRef, useState } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { thunkAddNewDownload } from '../thunks';
import {
  Fab,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  DialogActions,
  Button
} from '@material-ui/core';
import { Add, FolderOpen } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  fabButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: '0 auto',
    bottom: -25
  }
}));

function AddNewDownload({ onAdd = () => {} }) {
  const url = createRef();
  const filePath = createRef();
  const [open, setOpen] = useState(false);

  const handleSubmit = e => {
    setOpen(false);
    e.preventDefault();
    onAdd(url.current.value, filePath.current.value);
    url.current.value = null;
    filePath.current.value = null;
  };

  const chooseFile = () => {
    ipcRenderer.send('choose-file');
    ipcRenderer.on('choosen-file', (_event, args) => {
      filePath.current.value = args;
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <div>
      <Fab className={classes.fabButton} onClick={handleClickOpen}>
        <Add />
      </Fab>
      <Dialog open={open}>
        <DialogTitle>Add new download</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            name="url"
            type="text"
            placeholder="Url"
            inputRef={url}
          />
          <br />
          <TextField
            name="file"
            type="text"
            placeholder="Save folder"
            inputRef={filePath}
          />
          <IconButton onClick={chooseFile}>
            <FolderOpen />
          </IconButton>
          <DialogActions>
            <Button type="submit" onClick={handleSubmit}>
              Add
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default connect(
  null, 
  dispatch => ({
    onAdd: (url, dirname) => {
      dispatch(thunkAddNewDownload(url, dirname));
    }
  })
)(AddNewDownload);
