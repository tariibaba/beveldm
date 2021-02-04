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

  useEffect(() => {
    if (open) {
      setUrlHelperText(null);
      setNewUrl(currentUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleChangeUrl = (event) => {
    event.preventDefault();
    if (!newUrl) setUrlHelperText('Enter a URL');
    else if (newUrl && !isWebUri(newUrl)) {
      setUrlHelperText('Enter a valid URL');
    } else {
      onClose();
      onChange(id, newUrl);
    }
  };

  const handleDialogUrlChange = (event) => {
    setNewUrl(event.target.value);
    setUrlHelperText(null);
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
            <Button type="submit" disabled={currentUrl === newUrl}>
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
  ({ downloads, dialog: { data }, dialog }) => ({
    id: data && data.downloadId,
    currentUrl: data && downloads.byId[data.downloadId].url,
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
