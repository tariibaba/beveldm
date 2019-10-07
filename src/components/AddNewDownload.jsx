import React, { createRef } from 'react';
import { connect } from 'react-redux';
import request from 'request';
import { addNewDownload } from '../actions';
import { ipcRenderer } from 'electron';

function AddNewDownload({ onAdd = () => { } }) {
  const url = createRef();
  const filePath = createRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(url.current.value, filePath.current.value);
    url.current.value = null;
    filePath.current.value = null;
  };

  const chooseFile = () => {
    ipcRenderer.send('choose-file');
    ipcRenderer.on('choosen-file', (_event, args) => {
      filePath.current.value = args;
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="file" type="text" placeholder="Save path" ref={filePath} />
        <button type="button" onClick={chooseFile}>Choose file</button>
        <br />
        <input name="url" type="text" placeholder="Enter url" ref={url} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

function getFileName(headers) {
  const regex = /filename=(.+)/i;
  const MATCH_INDEX = 1;
  const matchArray = headers['content-disposition'].match(regex);
  return matchArray[MATCH_INDEX];
}

function getFileSize(headers) {
  return parseInt(headers['content-length']);
}

export default connect(
  null,
  dispatch => ({
    onAdd: (url, dirname) => {
      request.get(url)
        .on('response', res => {
          dispatch(
            addNewDownload(
              url,
              dirname,
              getFileName(res.headers),
              getFileSize(res.headers)
            )
          );
        });
    }
  })
)(AddNewDownload);
