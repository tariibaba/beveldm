import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import { isWebUri } from 'valid-url';
import { connect } from 'react-redux';
import { changeDownloadUrlThunk } from '../thunks';
import { closeDialog } from '../actions';

function ChangeUrlDialog({ id, currentUrl, open, onChange, onClose }) {
  const [newUrl, setNewUrl] = useState(currentUrl);
  const [urlHelperText, setUrlHelperText] = useState(null);
  const formSubmittable = newUrl && newUrl !== currentUrl && !urlHelperText;

  useEffect(() => {
    if (open) setNewUrl(currentUrl);
  }, [open, currentUrl]);

  useEffect(() => {
    if (newUrl && !isWebUri(newUrl)) setUrlHelperText('This url is invalid');
    else setUrlHelperText(null);
  }, [newUrl]);

  const handleChangeUrl = (event) => {
    event.preventDefault();
    onClose();
    onChange(id, newUrl);
  };

  const handleDialogUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Change URL</DialogTitle>

      <form onSubmit={handleChangeUrl}>
        <DialogContent>
          <TextField
            autoFocus
            name="url"
            type="text"
            label="New URL"
            helperText={urlHelperText}
            error={urlHelperText !== null}
            onChange={handleDialogUrlChange}
            value={newUrl}
          />

          <br />

          <DialogActions>
            <Button type="submit" disabled={!formSubmittable}>
              Change
            </Button>

            <Button onClick={onClose}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default connect(
  ({ downloads, dialog }) => ({
    id: dialog.data && dialog.data.downloadId,
    currentUrl:
      dialog.data &&
      downloads.find((download) => download.id === dialog.data.downloadId).url,
    open: dialog.open && dialog.type === 'changeurl',
  }),
  (dispatch) => ({
    onClose() {
      dispatch(closeDialog());
    },
    onChange(id, newUrl) {
      dispatch(changeDownloadUrlThunk(id, newUrl));
    },
  })
)(ChangeUrlDialog);
