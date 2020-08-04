import React, { useEffect, useState } from 'react';
import { Slide, Snackbar, Button, SnackbarContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
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
  responseCallback = () => {},
  action,
  notification,
}) {
  const [open, setOpen] = useState(false);
  const [derivedState, setDerivedState] = useState({
    message,
    responseCallback,
    action,
    variant,
  });
  const timeout = useRef();

  useEffect(() => {
    if (message) {
      if (open) {
        clearTimeout(timeout.current);
        derivedState.responseCallback('timeout');
        setOpen(false);
        timeout.current = setTimeout(() => {
          setDerivedState({ message, action, responseCallback, variant });
          setOpen(true);
        }, 400);
      } else {
        setDerivedState({ message, action, responseCallback, variant });
        setOpen(true);
      }
    }

    return () => clearTimeout(timeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  const handleClose = (_event, reason) => {
    if (reason !== 'clickaway') {
      derivedState.responseCallback('timeout');
      setOpen(false);
    }
  };

  const handleAction = () => {
    derivedState.responseCallback(action.toLowerCase());
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <Snackbar
      open={open}
      TransitionComponent={TransitionUp}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={10000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={classes[derivedState.variant]}
        message={<span>{derivedState.message}</span>}
        action={[
          derivedState.action && (
            <Button
              key={0}
              className={classes.actionButton}
              onClick={handleAction}
            >
              {derivedState.action}
            </Button>
          ),
        ]}
      />
    </Snackbar>
  );
}

export default connect(({ currentNotification }) => ({
  variant: currentNotification.type,
  message: currentNotification.message,
  responseCallback: currentNotification.responseCallback,
  action: currentNotification.action,
  // Also passing the full object to detect when it has changed even with the same props
  notification: currentNotification,
}))(CustomSnackbar);
