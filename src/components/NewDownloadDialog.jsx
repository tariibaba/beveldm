import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton
} from '@material-ui/core';
import { FolderOpen } from '@material-ui/icons';
import { clipboard, ipcRenderer } from 'electron';
import validUrl from 'valid-url';
import pathExists from 'path-exists';
import when from 'when-expression';
import { connect } from 'react-redux';
import { addNewDownloadThunk } from '../thunks';
import { closeDialog } from '../actions';
import { addNewYoutubeDownloadThunk } from '../thunks/add-new-download';

function NewDownloadDialog({ type, open, onAdd, onClose }) {
  const url = useRef();
  const dirname = useRef();
  const [defaultUrl, setDefaultUrl] = useState(null);
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
      setFormSubmittable(false);
    }
  }, [open]);

  const handleSubmit = event => {
    onClose();
    event.preventDefault();
    onAdd(type, url.current.value, dirname.current.value);
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

  const handleCancel = onClose;

  return (
    <Dialog open={open}>
      <DialogTitle>Add New Download</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            name="url"
            type="text"
            placeholder={
              type &&
              when(type)({
                addtoall: 'URL',
                addyoutube: 'Video URL',
                else: null
              })
            }
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
            placeholder="Save Folder"
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
  );
}

export default connect(
  ({ dialog }) => ({
    type: dialog.type,
    open:
      dialog.open &&
      (dialog.type === 'addtoall' || dialog.type === 'addyoutube')
  }),
  dispatch => ({
    onAdd(type, url, dirname) {
      if (type === 'addtoall') {
        dispatch(addNewDownloadThunk(url, dirname));
      } else {
        dispatch(addNewYoutubeDownloadThunk(url, dirname));
      }
    },
    onClose() {
      dispatch(closeDialog());
    }
  })
)(NewDownloadDialog);
