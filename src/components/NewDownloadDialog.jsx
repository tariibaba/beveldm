import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import { clipboard } from 'electron';
import validUrl from 'valid-url';
import when from 'when-expression';
import { connect } from 'react-redux';
import { addNewDownloadThunk } from '../thunks';
import { closeDialog } from '../actions';
import { addNewYoutubeDownloadThunk } from '../thunks/add-new-download';
import youtubeUrl from 'youtube-url';

function NewDownloadDialog({ type, open, onAdd, onClose }) {
  const [url, setUrl] = useState('');
  let [urlHelperText, setUrlHelperText] = useState(null);

  useEffect(() => {
    if (open) {
      setUrlHelperText(null);
      const clipboardText = clipboard.readText();
      setUrl((validUrl.isWebUri(clipboardText) && clipboardText) || '');
    }
  }, [open]);

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    setUrlHelperText(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUrlHelperText(null);
    if (!url) {
      setUrlHelperText('Enter a URL');
    } else if (url && !validUrl.isWebUri(url)) {
      setUrlHelperText('Enter a valid URL');
    } else if (url && type === 'youtube' && !youtubeUrl.valid(url)) {
      setUrlHelperText('Enter a valid YouTube URL');
    } else {
      setUrlHelperText(null);
      onClose();
      onAdd(type, url);
      setUrl('');
    }
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
            label={
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

          <DialogActions>
            <Button type="submit">Add</Button>

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
    onAdd(type, url) {
      if (type === 'addtoall') {
        dispatch(addNewDownloadThunk(url));
      } else {
        dispatch(addNewYoutubeDownloadThunk(url));
      }
    },
    onClose() {
      dispatch(closeDialog());
    },
  })
)(NewDownloadDialog);
