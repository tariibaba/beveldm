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
import { MoreVert, Check } from '@material-ui/icons';
import { connect } from 'react-redux';
import ChangeUrlDialog from './ChangeUrlDialog';
import { toggleOpenWhenDone, openDialog } from '../actions';

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
    textTransform: 'none',
    width: '100%'
  },
  openWhenDoneCheck: {
    float: 'left',
    marginRight: theme.spacing(1) + 'px'
  },
  iconButton: {
    padding: '10px'
  }
}));

function DownloadMoreActions({
  id,
  openWhenDone = false,
  onChangeUrl,
  onToggleOpenWhenDone
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    onChangeUrl();
    handlePopoverClose();
  };

  const handleToggleOpenWhenDone = () => {
    handlePopoverClose();
    onToggleOpenWhenDone(id, !openWhenDone);
  };

  const popoverOpen = Boolean(anchorEl);
  const classes = useStyles();

  return (
    <>
      <IconButton className={classes.iconButton} onClick={handlePopoverOpen}>
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
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText}>
              <Button
                className={classes.button}
                onClick={handleToggleOpenWhenDone}
              >
                <Check
                  className={classes.openWhenDoneCheck}
                  style={{ visibility: openWhenDone ? 'visible' : 'hidden' }}
                />
                Open when done
              </Button>
            </ListItemText>
          </ListItem>
        </List>
      </Popover>

      <ChangeUrlDialog />
    </>
  );
}

export default connect(null, dispatch => ({
  onChangeUrl(id) {
    dispatch(openDialog('changeurl', { downloadId: id }));
  },
  onToggleOpenWhenDone(id, openWhenDone) {
    console.log(
      `dispatching, trying to change openWhenDone to ${openWhenDone}`
    );
    dispatch(toggleOpenWhenDone(id, openWhenDone));
  }
}))(DownloadMoreActions);
