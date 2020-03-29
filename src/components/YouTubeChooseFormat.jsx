import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  Radio,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Table
} from '@material-ui/core';
import { connect } from 'react-redux';
import { closeDialog, removeDownload } from '../actions';
import { prettyBytes } from './utilities';
import { choosenYouTubeFormatThunk } from '../thunks';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'table-header-group'
  },
  tableWrapper: {
    height: 204,
    overflowY: 'auto',
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent'
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(100, 100, 100, 0.7)'
    }
  },
  tableHeadCell: {
    textAlign: 'center'
  },
  tableRowCell: {
    textAlign: 'center',
    padding: 3
  },
  dialogTitle: {
    width: 321
  }
}));

function YouTubeChooseFormat({
  downloadId,
  open,
  title,
  formats = [],
  onChooseFormat,
  onClose,
  onCancel
}) {
  const [formatIndex, setFormatIndex] = useState(0);
  const orderedFormats = formats.sort(
    (format1, format2) =>
      format2.width - format1.width ||
      format2.height - format1.height ||
      format1.contentLength - format2.contentLength
  );

  useEffect(() => {
    setFormatIndex(0);
  }, [open]);

  const handleChooseFormat = event => {
    event.preventDefault();
    onClose();
    const choosenFormat = orderedFormats[formatIndex];
    onChooseFormat(downloadId, title, choosenFormat);
  };

  const handleCancel = () => {
    onClose();
    onCancel(downloadId);
  };

  const handleFormatChange = event => {
    setFormatIndex(event.target.value);
  };

  const classes = useStyles();

  return (
    <Dialog open={open}>
      <DialogTitle className={classes.dialogTitle}>
        Choose Formats for {title}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleChooseFormat}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableCell className={classes.tableHeadCell}>Quality</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Extension
                </TableCell>
                <TableCell className={classes.tableHeadCell}>Size</TableCell>
                <TableCell />
              </TableHead>
              <TableBody>
                {orderedFormats.map((format, index) => (
                  <TableRow key={index} className={classes.tableRow}>
                    <TableCell className={classes.tableRowCell}>
                      {format.qualityLabel}
                    </TableCell>
                    <TableCell className={classes.tableRowCell}>
                      {format.container.toUpperCase()}
                    </TableCell>
                    <TableCell className={classes.tableRowCell}>
                      {prettyBytes(format.contentLength)}
                    </TableCell>
                    <TableCell className={classes.tableRowCell}>
                      <Radio
                        classes={{
                          colorSecondary: classes.radio,
                          checked: classes.radio
                        }}
                        className={classes.radio}
                        onChange={handleFormatChange}
                        checked={formatIndex.toString() === index.toString()}
                        value={index.toString()}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <br />
          <DialogActions>
            <Button type="submit">Choose</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default connect(
  ({ dialog }) => ({
    open: dialog.open && dialog.type === 'youtuberes',
    title: dialog.data && dialog.data.videoTitle,
    formats: (dialog.data && dialog.data.videoFormats) || [],
    downloadId: dialog.data && dialog.data.downloadId
  }),
  dispatch => ({
    onChooseFormat(id, title, format) {
      dispatch(choosenYouTubeFormatThunk(id, title, format));
    },
    onClose() {
      dispatch(closeDialog());
    },
    onCancel(downloadId) {
      dispatch(removeDownload(downloadId));
    }
  })
)(YouTubeChooseFormat);
