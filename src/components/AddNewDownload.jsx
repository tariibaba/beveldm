import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { thunkAddNewDownload } from '../thunks';

function AddNewDownload({ onAdd = () => {} }) {
  const url = createRef();
  const filePath = createRef();

  const handleSubmit = e => {
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
        <button type="button" onClick={chooseFile}>
          Choose file
        </button>
        <br />
        <input name="url" type="text" placeholder="Enter url" ref={url} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default connect(
  null, 
  dispatch => ({
    onAdd: (url, dirname) => {
      dispatch(thunkAddNewDownload(url, dirname));
    }
  })
)(AddNewDownload);
