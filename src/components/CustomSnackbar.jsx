import React, { useEffect, useState } from 'react';
import { Slide, Snackbar, Button, SnackbarContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { NOTIFICATION_SHOW_DURATION } from '../constants';

const useStyles = makeStyles(theme => ({
  actionButton: {
    textTransform: 'none',
    color: '#fff'
  },
  error: {
    backgroundColor: theme.palette.error.dark
  }
}));

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function CustomSnackbar({
  variant,
  message,
  actionName,
  action,
  notification
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) setOpen(true);
  }, [notification, message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleAction = () => {
    action();
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <div>
      <Snackbar
        open={open}
        TransitionComponent={TransitionUp}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={NOTIFICATION_SHOW_DURATION}
        onClose={handleClose}
      >
        <SnackbarContent
          className={classes[variant]}
          message={<span>{message}</span>}
          action={[
            actionName && (
              <Button
                key={0}
                className={classes.actionButton}
                onClick={handleAction}
              >
                {actionName}
              </Button>
            )
          ]}
        />
      </Snackbar>
    </div>
  );
}

export default connect(({ currentNotification }) => ({
  variant: currentNotification.variant,
  message: currentNotification.message,
  actionName: currentNotification.actionName,
  action: currentNotification.action,
  // Also passing the full object to detect when it has changed even with the same props
  notification: currentNotification
}))(CustomSnackbar);
