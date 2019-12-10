import React, { useEffect, useState } from 'react';
import { Slide, Snackbar, Button, SnackbarContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

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

function CustomSnackbar({ messageObj, message, action, actionName, variant }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) setOpen(true);
  }, [messageObj, message]);

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
        autoHideDuration={10000}
        onClose={handleClose}
      >
        <SnackbarContent
          className={classes[variant]}
          message={<span>{message}</span>}
          action={[
            <Button
              key={0}
              className={classes.actionButton}
              onClick={handleAction}
            >
              {actionName}
            </Button>
          ]}
        />
      </Snackbar>
    </div>
  );
}

export default connect(({ message }) => ({
  messageObj: message,
  message: message.value,
  variant: message.type,
  action: message.action,
  actionName: message.actionName
}))(CustomSnackbar);
