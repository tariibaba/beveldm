import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from '@material-ui/core';
import { isWebUri } from 'valid-url';
import { connect } from 'react-redux';
import { changeDownloadUrlThunk } from '../thunks';

function ChangeUrlDialog({ id, currentUrl, open, onChange, onClose }) {
  const newUrl = useRef();
  const [formSubmittable, setFormSubmittable] = useState(false);
  const [urlHelperText, setUrlHelperText] = useState(null);

  useEffect(() => {
    setFormSubmittable(false);
  }, [open]);

  const handleChangeUrl = event => {
    event.preventDefault();
    onChange(id, newUrl.current.value);
    onClose();
  };

  const handleDialogUrlChange = () => {
    if (!isWebUri(newUrl.current.value)) {
      setUrlHelperText('This url is invalid');
      setFormSubmittable(false);
    } else if (newUrl.current.value === currentUrl) {
      setUrlHelperText(null);
      setFormSubmittable(false);
    } else {
      setUrlHelperText(null);
      setFormSubmittable(true);
    }
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
            placeholder="Url"
            inputRef={newUrl}
            defaultValue={currentUrl}
            helperText={urlHelperText}
            error={urlHelperText !== null}
            onChange={handleDialogUrlChange}
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

export default connect(null, dispatch => ({
  onChange(id, newUrl) {
    dispatch(changeDownloadUrlThunk(id, newUrl));
  }
}))(ChangeUrlDialog);
