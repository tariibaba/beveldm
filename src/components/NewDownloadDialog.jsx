import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
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
import youtubeUrl from 'youtube-url';

function NewDownloadDialog({ type, open, onAdd, onClose }) {
  const [url, setUrl] = useState('');
  const [dirname, setDirname] = useState('');
  let [urlHelperText, setUrlHelperText] = useState(null);
  let [dirnameHelperText, setDirnameHelperText] = useState(null);
  const dirnameRef = useRef();
  const formSubmittable =
    url && dirname && !urlHelperText && !dirnameHelperText;

  useEffect(() => {
    ipcRenderer.on('choosen-file', (_event, args) => {
      if (args) setDirname(args);
      dirnameRef.current.focus();
    });
  }, []);

  useEffect(() => {
    if (open) {
      const clipboardText = clipboard.readText();
      setUrl((validUrl.isWebUri(clipboardText) && clipboardText) || '');
    }
  }, [open]);

  useEffect(() => {
    (async () => {
      if (dirname && !(await pathExists(dirname))) {
        setDirnameHelperText("This folder doesn't exist");
      } else setDirnameHelperText(null);
    })();
  }, [dirname]);

  useEffect(() => {
    if (url && !validUrl.isWebUri(url)) {
      setUrlHelperText('This URL is invalid');
    } else if (url && type === 'youtube' && !youtubeUrl.valid(url)) {
      setUrlHelperText('Invalid YouTube URL');
    } else setUrlHelperText(null);
  }, [url, type]);

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleDirnameChange = (event) => {
    setDirname(event.target.value);
  };

  const handleChooseDir = () => {
    ipcRenderer.send('choose-file');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onClose();
    onAdd(type, url, dirname);
    setUrl('');
    setDirname('');
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
                else: null,
              })
            }
            error={urlHelperText !== null}
            helperText={urlHelperText}
            onChange={handleUrlChange}
            value={url}
          />

          <br />

          <TextField
            name="dirname"
            type="text"
            placeholder="Save Folder"
            inputRef={dirnameRef}
            error={dirnameHelperText !== null}
            helperText={dirnameHelperText}
            onChange={handleDirnameChange}
            value={dirname}
          />

          <IconButton onClick={handleChooseDir}>
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
      (dialog.type === 'addtoall' || dialog.type === 'addyoutube'),
  }),
  (dispatch) => ({
    onAdd(type, url, dirname) {
      if (type === 'addtoall') {
        dispatch(addNewDownloadThunk(url, dirname));
      } else {
        dispatch(addNewYoutubeDownloadThunk(url, dirname));
      }
    },
    onClose() {
      dispatch(closeDialog());
    },
  })
)(NewDownloadDialog);
