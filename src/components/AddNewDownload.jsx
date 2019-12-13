import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer, clipboard } from 'electron';
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
import pathExists from 'path-exists';
import validUrl from 'valid-url';
import { useEffect } from 'react';

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
  const url = useRef();
  const dirname = useRef();
  const [defaultUrl, setDefaultUrl] = useState(null);
  const [open, setOpen] = useState(false);
  let [urlHelperText, setUrlHelperText] = useState(null);
  let [dirnameHelperText, setDirnameHelperText] = useState(null);
  const [formSubmittable, setFormSubmittable] = useState(false);

  useEffect(() => {
    if (open) {
      const clipboardText = clipboard.readText();
      if (validUrl.isWebUri(clipboardText)) {
        setDefaultUrl(clipboardText);
      } else {
        setDefaultUrl(null);
      }
    }
  }, [open]);

  const handleSubmit = e => {
    setOpen(false);
    e.preventDefault();
    onAdd(url.current.value, dirname.current.value);
    url.current.value = '';
    dirname.current.value = '';
  };

  const handleUrlChange = () => {
    if (url.current.value !== '' && !validUrl.isWebUri(url.current.value)) {
      urlHelperText = 'This url is invalid';
    } else {
      urlHelperText = null;
    }
    setUrlHelperText(urlHelperText);
    setFormSubmittable(isFormSubmittable());
  };

  const handleDirnameChange = async () => {
    if (
      dirname.current.value !== '' &&
      !(await pathExists(dirname.current.value))
    ) {
      dirnameHelperText = "This folder doesn't exist";
    } else {
      dirnameHelperText = null;
    }
    setDirnameHelperText(dirnameHelperText);
    setFormSubmittable(isFormSubmittable());
  };

  const isFormSubmittable = () => {
    return (
      !urlHelperText &&
      !dirnameHelperText &&
      url.current.value &&
      dirname.current.value
    );
  };

  const chooseFile = () => {
    ipcRenderer.send('choose-file');
    ipcRenderer.on('choosen-file', (_event, args) => {
      if (args) {
        dirname.current.value = args;
      }
      handleDirnameChange();
      dirname.current.focus();
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
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              name="url"
              type="text"
              placeholder="Url"
              inputRef={url}
              error={urlHelperText !== null}
              helperText={urlHelperText}
              onChange={handleUrlChange}
              defaultValue={defaultUrl}
            />
            <br />
            <TextField
              name="dirname"
              type="text"
              placeholder="Save folder"
              inputRef={dirname}
              error={dirnameHelperText !== null}
              helperText={dirnameHelperText}
              onChange={handleDirnameChange}
            />
            <IconButton onClick={chooseFile}>
              <FolderOpen />
            </IconButton>
            <DialogActions>
              <Button type="submit" disabled={!formSubmittable}>
                Add
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}

export default connect(null, dispatch => ({
  onAdd: (url, dirname) => {
    dispatch(thunkAddNewDownload(url, dirname));
  }
}))(AddNewDownload);
