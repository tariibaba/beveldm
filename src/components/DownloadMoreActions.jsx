import React, { useState, useRef } from 'react';
import {
  Popover,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  makeStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { thunkChangeDownloadUrl } from '../thunks';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: 0
  },
  listItemText: {
    padding: 0,
    margin: 0
  },
  button: {
    borderRadius: 0,
    textTransform: 'none'
  }
}));

function DownloadMoreActions({ id, currentUrl, dispatch }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const url = useRef();

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget); 
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleChangeUrl = () => {
    dispatch(thunkChangeDownloadUrl(id, url.current.value));
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setAnchorEl(null);
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const popoverOpen = Boolean(anchorEl);
  const classes = useStyles();

  return (
    <>
      <IconButton onClick={handlePopoverOpen}>
        <MoreVert fontSize="small" />
      </IconButton>
      <Popover
        className={classes.popover}
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handlePopoverClose}
      >
        <List>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText}>
              <Button className={classes.button} onClick={handleDialogOpen}>
                Change URL
              </Button>
            </ListItemText>
          </ListItem>
        </List>
      </Popover>
      <Dialog open={dialogOpen}>
        <DialogTitle>Change URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            name="url"
            type="text"
            placeholder="Url"
            inputRef={url}
            defaultValue={currentUrl}
          />
          <br />
          <DialogActions>
            <Button type="submit" onClick={handleChangeUrl}>
              Change
            </Button>
            <Button onClick={handleDialogCancel}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default connect()(DownloadMoreActions);
