import React, { useEffect, useState } from 'react';
import { Slide, Snackbar, Button, SnackbarContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { NOTIFICATION_SHOW_DURATION } from '../constants';
import { useRef } from 'react';

const useStyles = makeStyles((theme) => ({
  actionButton: {
    textTransform: 'none',
    color: '#fff',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}));

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function CustomSnackbar({
  variant,
  message,
  actionName,
  action,
  notification,
}) {
  const [open, setOpen] = useState(false);
  const [derivedState, setDerivedState] = useState({
    message,
    actionName,
    action,
    variant,
  });
  const timeout = useRef();

  useEffect(() => {
    if (message) {
      if (open) {
        clearTimeout(timeout.current);
        setOpen(false);
        timeout.current = setTimeout(() => {
          setDerivedState({ message, actionName, action, variant });
          setOpen(true);
        }, 400);
      } else {
        setDerivedState({ message, actionName, action, variant });
        setOpen(true);
      }
    }

    return () => clearTimeout(timeout.current);
  }, [notification]);

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleAction = () => {
    derivedState.action();
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <Snackbar
      open={open}
      TransitionComponent={TransitionUp}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={NOTIFICATION_SHOW_DURATION}
      onClose={handleClose}
    >
      <SnackbarContent
        className={classes[derivedState.variant]}
        message={<span>{derivedState.message}</span>}
        action={[
          derivedState.actionName && (
            <Button
              key={0}
              className={classes.actionButton}
              onClick={handleAction}
            >
              {derivedState.actionName}
            </Button>
          ),
        ]}
      />
    </Snackbar>
  );
}

export default connect(({ currentNotification }) => ({
  variant: currentNotification.variant,
  message: currentNotification.message,
  actionName: currentNotification.actionName,
  action: currentNotification.action,
  // Also passing the full object to detect when it has changed even with the same props
  notification: currentNotification,
}))(CustomSnackbar);
