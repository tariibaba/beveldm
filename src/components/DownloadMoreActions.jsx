import React, { useState } from 'react';
import {
  IconButton,
  ListItemText,
  ListItemIcon,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { MoreVert, Check } from '@material-ui/icons';
import { connect } from 'react-redux';
import { toggleOpenWhenDone, openDialog } from '../actions';

const useStyles = makeStyles((theme) => ({
  menuListItemText: {
    padding: 0,
    margin: 0,
    fontSize: 14,
  },
  menuListItemIcon: {
    minWidth: 40,
  },
  button: {
    borderRadius: 0,
    textTransform: 'none',
    width: '100%',
  },
  openWhenDoneCheck: {
    float: 'left',
    marginRight: theme.spacing(1) + 'px',
  },
  iconButton: {
    padding: '10px',
  },
}));

function DownloadMoreActions({
  id,
  openWhenDone = false,
  onChangeUrl,
  onToggleOpenWhenDone,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    onChangeUrl(id);
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

      <Menu
        className={classes.popover}
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        getContentAnchorEl={null}
        onClose={handlePopoverClose}
      >
        <MenuItem
          button
          className={classes.menuListItem}
          onClick={handleDialogOpen}
        >
          <ListItemIcon className={classes.menuListItemIcon}>
            <span></span>
          </ListItemIcon>
          <ListItemText
            className={classes.menuListItemText}
            classes={{ primary: classes.menuListItemText }}
          >
            Change URL
          </ListItemText>
        </MenuItem>
        <MenuItem button className={classes.menuListItem}>
          <ListItemIcon className={classes.menuListItemIcon}>
            <Check
              className={classes.openWhenDoneCheck}
              style={{ visibility: openWhenDone ? 'visible' : 'hidden' }}
            />
          </ListItemIcon>
          <ListItemText
            className={classes.menuListItemText}
            classes={{ primary: classes.menuListItemText }}
            onClick={handleToggleOpenWhenDone}
          >
            Open when done
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default connect(null, (dispatch) => ({
  onChangeUrl(id) {
    dispatch(openDialog('changeurl', { downloadId: id }));
  },
  onToggleOpenWhenDone(id, openWhenDone) {
    console.log(
      `dispatching, trying to change openWhenDone to ${openWhenDone}`
    );
    dispatch(toggleOpenWhenDone(id, openWhenDone));
  },
}))(DownloadMoreActions);
