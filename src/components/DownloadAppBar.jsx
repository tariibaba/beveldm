import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Button
} from '@material-ui/core';
import AddNewDownload from './AddNewDownload';
import { MoreVert, Check } from '@material-ui/icons';
import { connect } from 'react-redux';
import { toggleSaveData } from '../actions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 15
  },
  iconButton: {
    float: 'right'
  },
  listItem: {
    padding: 0
  },
  listItemText: {
    padding: 0,
    margin: 0
  },
  listItemButton: {
    borderRadius: 0,
    textTransform: 'none'
  },
  saveDataCheck: {
    float: 'left',
    marginRight: theme.spacing(1)
  }
}));

function DownloadAppBar({ saveData = false, dispatch }) {
  const [anchorEl, setAnchorEl] = useState(null);
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

  const popoverOpen = Boolean(anchorEl);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Downloads
          </Typography>
          <AddNewDownload />
          <IconButton
            className={classes.iconButton}
            edge="end"
            color="inherit"
            onClick={handlePopoverOpen}
          >
            <MoreVert />
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
                  <Button
                    className={classes.listItemButton}
                    onClick={handleToggleSaveData}
                  >
                    <Check
                      className={classes.saveDataCheck}
                      style={{ visibility: saveData ? 'visible' : 'hidden' }}
                    />
                    Save data
                  </Button>
                </ListItemText>
              </ListItem>
            </List>
          </Popover>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connect(state => ({ saveData: state.settings.saveData }))(
  DownloadAppBar
);
