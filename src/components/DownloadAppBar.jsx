import React, { useState } from 'react';
import {
  AppBar,
  Menu,
  Toolbar,
  IconButton,
  MenuItem,
  Typography,
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
  makeStyles,
  Divider,
} from '@material-ui/core';
import {
  MoreVert,
  Menu as MenuIcon,
  YouTube,
  ClearAll,
  Check,
  Settings,
  Feedback,
} from '@material-ui/icons';
import clsx from 'clsx';
import { toggleSaveData, changeDownloadGroup, changePage } from '../actions';
import { connect } from 'react-redux';
import { shell } from 'electron';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    float: 'left',
    height: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      backgroundColor: theme.palette.custom.drawer,
      boxShadow: theme.shadows[10],
      width: drawerWidth,
    },
  },
  drawerOpen: {
    [theme.breakpoints.down('md')]: {
      left: 0,
      transition: theme.transitions.create('left', {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.sharp,
      }),
    },
  },
  drawerClose: {
    [theme.breakpoints.down('md')]: {
      left: -drawerWidth - 20,
      transition: theme.transitions.create('left', {
        duration: theme.transitions.duration.leavingScreen,
        easing: theme.transitions.easing.sharp,
      }),
    },
  },
  overlay: {
    height: 0,
    width: 0,
    position: 'relative',
    zIndex: 1299,
    [theme.breakpoints.down('md')]: {
      height: '100%',
      position: 'absolute',
      transition: theme.transitions.create('background-color', {
        easing: theme.transitions.easing.sharp,
        duration: 200,
      }),
    },
  },
  overlayOpen: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  },
  overlayClose: {
    [theme.breakpoints.down('md')]: {
      width: 0,
      transition: `${theme.transitions.create('background-color', {
        easing: theme.transitions.easing.sharp,
        duration: 200,
      })}, ${theme.transitions.create('width', {
        duration: 1,
        delay: 200,
      })}`,
    },
  },
  menuIconButton: {
    display: 'none',
    color: theme.overrides.MuiAppBar.colorPrimary.color,
    [theme.breakpoints.down('md')]: {
      display: 'inline',
    },
  },
  selectedDownloadGroup: {
    color: `${theme.palette.primary.main}`,
    fontWeight: 'bold',
  },
  downloadGroupListItem: {
    borderLeft: '2px solid transparent',
    [theme.breakpoints.down('md')]: {
      border: 'none',
    },
  },
  selectedDownloadGroupListItem: {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.down('md')]: {
      border: 'none',
    },
  },
  drawerAppBar: {
    display: 'none',
    position: 'relative',
    boxShadow: 'none',
    background: 'none',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  menuListIcon: {
    minWidth: 24,
    marginRight: 10,
  },
  divider: {
    visibility: 'hidden',
    [theme.breakpoints.down('md')]: {
      visibility: 'visible',
    },
  },
  drawerMenuIcon: {
    color: theme.overrides.MuiAppBar.colorPrimary.color,
  },
  menuItem: {
    display: 'flex',
    clear: 'right',
  },
}));

const newIssueUrl = 'https://github.com/tariibaba/beveldm/issues/new';

function DownloadAppBar({ dispatch, saveData, downloadGroup, raised }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleToggleSaveData = () => {
    handlePopoverClose();
    dispatch(toggleSaveData(!saveData));
  };

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const handleChangeDownloadGroup = (group) => {
    handleCloseDrawer();
    dispatch(changeDownloadGroup(group));
  };

  const handleGoToSettings = () => {
    dispatch(changePage('settings'));
  };

  const handleSendFeedback = () => {
    handlePopoverClose();
    shell.openExternal(newIssueUrl);
  };

  const popoverOpen = Boolean(anchorEl);

  return (
    <>
      <AppBar position="fixed" elevation={raised ? 4 : 0}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuIconButton}
            onClick={handleOpenDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Downloads
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleGoToSettings}>
            <Settings />
          </IconButton>
          <IconButton edge="end" color="inherit" onClick={handlePopoverOpen}>
            <MoreVert />
          </IconButton>
          <Menu
            open={popoverOpen}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            getContentAnchorEl={null}
            onClose={handlePopoverClose}
          >
            <MenuItem
              button
              onClick={handleToggleSaveData}
              className={classes.menuItem}
            >
              <ListItemIcon className={classes.menuListIcon}>
                <Check
                  style={{ visibility: saveData ? 'visible' : 'hidden' }}
                />
              </ListItemIcon>
              <Typography>Save data</Typography>
            </MenuItem>
            <MenuItem
              button
              className={classes.menuItem}
              onClick={handleSendFeedback}
            >
              <ListItemIcon className={classes.menuListIcon}>
                <Feedback />
              </ListItemIcon>
              <Typography>Send feedback</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div
        className={clsx(classes.overlay, {
          [classes.overlayOpen]: open,
          [classes.overlayClose]: !open,
        })}
        onClick={handleCloseDrawer}
      >
        <div
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          onClick={(e) => e.stopPropagation()}
        >
          <AppBar className={classes.drawerAppBar} position="fixed">
            <Toolbar>
              <IconButton edge="start" onClick={handleCloseDrawer}>
                <MenuIcon className={classes.drawerMenuIcon} />
              </IconButton>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Downloads
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider className={classes.divider} />
          <List>
            <ListItem
              button
              onClick={() => handleChangeDownloadGroup('all')}
              className={clsx(
                classes.downloadGroupListItem,
                downloadGroup === 'all' && classes.selectedDownloadGroupListItem
              )}
            >
              <ListItemIcon
                className={clsx(
                  downloadGroup === 'all' && classes.selectedDownloadGroup
                )}
              >
                <ClearAll />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: clsx(
                    downloadGroup === 'all' && classes.selectedDownloadGroup
                  ),
                }}
              >
                All
              </ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => handleChangeDownloadGroup('youtube')}
              className={clsx(
                classes.downloadGroupListItem,
                downloadGroup === 'youtube' &&
                  classes.selectedDownloadGroupListItem
              )}
            >
              <ListItemIcon
                className={clsx(
                  downloadGroup === 'youtube' && classes.selectedDownloadGroup
                )}
              >
                <YouTube />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: clsx(
                    downloadGroup === 'youtube' && classes.selectedDownloadGroup
                  ),
                }}
              >
                YouTube
              </ListItemText>
            </ListItem>
          </List>
        </div>
      </div>
    </>
  );
}

export default connect(({ settings, downloadGroup }) => ({
  downloadGroup,
  saveData: settings.saveData,
  darkMode: settings.darkMode,
}))(DownloadAppBar);
