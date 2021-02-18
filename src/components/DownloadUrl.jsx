import React, { useState } from 'react';
import {
  Typography,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';
import clsx from 'clsx';
import { Edit, FileCopy, Link, OpenInBrowser } from '@material-ui/icons';
import { shell, clipboard } from 'electron';
import { connect } from 'react-redux';
import { notify, openDialog } from '../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
  },
  linkButtonDefaultState: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1em',
    margin: 0,
    padding: 0,
  },
  urlDefaultState: {
    display: 'inline-block',
    color: theme.palette.custom.urlDefault,
    cursor: 'pointer',
    maxWidth: '90%',
  },
  urlErrorState: {
    color: theme.palette.custom.urlError,
  },
  typography: {
    fontSize: 13,
  },
  urlTypography: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  popoverMenuList: {
    display: 'flex',
    flexFlow: 'row',
    padding: 0,
  },
  popoverMenuItem: {
    padding: 8,
  },
}));

function DownloadUrl({ id, url, status, inactive, onEdit, onCopy }) {
  const classes = useStyles();

  const openUrl = () => {
    closePopover();
    shell.openExternal(url);
  };

  const copyUrl = () => {
    closePopover();
    clipboard.writeText(url);
    onCopy(url);
  };

  const editUrl = () => {
    closePopover();
    onEdit(id);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const openPopover = (event) => {
    setMenuAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const closePopover = () => {
    setMenuAnchorEl(null);
    setIsMenuOpen(false);
  };

  return (
    <div className={classes.root}>
      <button
        onClick={openUrl}
        className={clsx(
          classes.linkButtonDefaultState,
          classes.urlDefaultState,
          inactive && classes.urlErrorState
        )}
      >
        <Typography
          className={clsx(classes.typography, classes.urlTypography)}
          style={{ color: 'inherit' }}
        >
          {url}
        </Typography>
      </button>
      <IconButton onClick={openPopover}>
        <Link fontSize="small" />
      </IconButton>
      <Menu
        open={isMenuOpen}
        onClose={closePopover}
        anchorEl={menuAnchorEl}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        classes={{ list: classes.popoverMenuList }}
      >
        <MenuItem button className={classes.popoverMenuItem} onClick={openUrl}>
          <OpenInBrowser fontSize="small" />
        </MenuItem>
        <MenuItem button className={classes.popoverMenuItem} onClick={copyUrl}>
          <FileCopy fontSize="small" />
        </MenuItem>
        <MenuItem
          button
          className={classes.popoverMenuItem}
          onClick={editUrl}
          disabled={status === 'complete'}
        >
          <Edit fontSize="small" />
        </MenuItem>
      </Menu>
    </div>
  );
}

export default connect(null, (dispatch) => ({
  onEdit(id) {
    dispatch(openDialog('changeurl', { downloadId: id }));
  },
  onCopy() {
    dispatch(notify({ type: 'info', message: 'Copied URL to clipboard' }));
  },
}))(DownloadUrl);
