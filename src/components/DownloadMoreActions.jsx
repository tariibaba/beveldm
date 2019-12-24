import React, { useState } from 'react';
import {
  Popover,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  makeStyles
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { connect } from 'react-redux';
import ChangeUrlDialog from './ChangeUrlDialog';

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

function DownloadMoreActions({ id, currentUrl }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setAnchorEl(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
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

      <ChangeUrlDialog
        id={id}
        currentUrl={currentUrl}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
}

export default connect()(DownloadMoreActions);
