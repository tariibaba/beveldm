import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuList,
  MenuItem
} from '@material-ui/core';
import AddNewDownload from './AddNewDownload';
import {
  MoreVert,
  Check,
  Menu as MenuIcon,
  ClearAll,
  YouTube
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { toggleSaveData, changeDownloadGroup } from '../actions';
import clsx from 'clsx';
import DownloadList from './DownloadList';
import { grey } from '@material-ui/core/colors';
import CustomSnackbar from './CustomSnackbar';
import NewDownloadDialog from './NewDownloadDialog';
import YoutubeChooseFormat from './YouTubeChooseFormat';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: grey['100'],
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  saveDataCheck: {
    float: 'left',
    marginRight: theme.spacing(1)
  },
  drawer: {
    float: 'left',
    height: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      backgroundColor: '#fff',
      boxShadow: theme.shadows[10],
      width: drawerWidth
    }
  },
  drawerOpen: {
    [theme.breakpoints.down('md')]: {
      left: 0,
      transition: theme.transitions.create('left', {
        duration: theme.transitions.duration.enteringScreen,
        easing: theme.transitions.easing.sharp
      })
    }
  },
  drawerClose: {
    [theme.breakpoints.down('md')]: {
      left: -drawerWidth - 10,
      transition: theme.transitions.create('left', {
        duration: theme.transitions.duration.leavingScreen,
        easing: theme.transitions.easing.sharp
      })
    }
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
        duration: 200
      })
    }
  },
  overlayOpen: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  },
  overlayClose: {
    [theme.breakpoints.down('md')]: {
      width: 0,
      transition: `${theme.transitions.create('background-color', {
        easing: theme.transitions.easing.sharp,
        duration: 200
      })}, ${theme.transitions.create('width', {
        duration: 1,
        delay: 200
      })}`
    }
  },
  menuIconButton: {
    display: 'none',
    color: '#fff',
    [theme.breakpoints.down('md')]: {
      display: 'inline'
    }
  },
  selectedDownloadGroup: {
    color: theme.palette.primary.main,
    fontWeight: 'bold'
  },
  downloadGroupListItem: {
    borderLeft: '2px solid transparent',
    [theme.breakpoints.down('md')]: {
      border: 'none'
    }
  },
  selectedDownloadGroupListItem: {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.down('md')]: {
      border: 'none'
    }
  },
  drawerAppBar: {
    display: 'none',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      display: 'block'
    }
  },
  menuList: {
    padding: '3px 0',
    '&:focus': {
      outline: 'none'
    }
  },
  menuListIcon: {
    minWidth: 40
  }
}));

function DownloadAppBar({ saveData = false, downloadGroup, dispatch }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleToggleSaveData = () => {
    setAnchorEl(null);
    dispatch(toggleSaveData(!saveData));
  };

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const handleChangeDownloadGroup = group => {
    handleCloseDrawer();
    dispatch(changeDownloadGroup(group));
  };

  const popoverOpen = Boolean(anchorEl);

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
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
          <IconButton edge="end" color="inherit" onClick={handlePopoverOpen}>
            <MoreVert />
          </IconButton>
          <Menu
            open={popoverOpen}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={handlePopoverClose}
          >
            <MenuList className={classes.menuList}>
              <MenuItem button onClick={handleToggleSaveData}>
                <ListItemIcon className={classes.menuListIcon}>
                  <Check
                    style={{ visibility: saveData ? 'visible' : 'hidden' }}
                  />
                </ListItemIcon>
                <Typography>Save Data</Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div
        className={clsx(classes.overlay, {
          [classes.overlayOpen]: open,
          [classes.overlayClose]: !open
        })}
        onClick={handleCloseDrawer}
      >
        <div
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })}
          onClick={e => e.stopPropagation()}
        >
          <AppBar className={classes.drawerAppBar} position="fixed">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuIconButton}
                onClick={handleCloseDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Downloads
              </Typography>
            </Toolbar>
          </AppBar>
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
                  )
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
                    )
                }}
              >
                YouTube
              </ListItemText>
            </ListItem>
          </List>
        </div>
      </div>
      <AddNewDownload />
      <NewDownloadDialog />
      <YoutubeChooseFormat />
      <DownloadList />
      <CustomSnackbar />
    </div>
  );
}

export default connect(({ settings, downloadGroup }) => ({
  downloadGroup,
  saveData: settings.saveData
}))(DownloadAppBar);
