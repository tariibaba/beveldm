import React, { createRef } from 'react';
import { connect } from 'react-redux';
import request from 'request';
import { addNewDownload } from '../actions';
import { ipcRenderer } from 'electron';
import path from 'path';
import contentDipositionFilename from 'content-disposition-filename';
import pathExists from 'path-exists';

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

function getFileName(headers) {
  return contentDipositionFilename(headers['content-disposition']);
}

function getFileSize(headers) {
  return parseInt(headers['content-length']);
}

async function getAvailableFileName(dirname, filename, downloads) {
  const extension = path.extname(filename);
  const nameWithoutExtension = filename.replace(extension, '');
  let suffix = 0;
  let availableFilename = filename;
  let fullPath = path.resolve(dirname, availableFilename);

  while (await pathExists(fullPath)) {
    suffix++;
    availableFilename = `${nameWithoutExtension} (${suffix})${extension}`;
    fullPath = path.resolve(dirname, availableFilename);
  }

  downloads.forEach(download => {
    const downloadPath = path.resolve(download.dirname, download.filename);
    if (downloadPath === fullPath) {
      suffix++;
      availableFilename = `${nameWithoutExtension} (${suffix})${extension}`;
      fullPath = path.resolve(dirname, availableFilename);
    }
  });

  return availableFilename;
}

let downloads;
export default connect(
  state => {
    downloads = state.downloads;
    return {};
  },
  dispatch => ({
    onAdd: (url, dirname) => {
      request.get(url).on('response', async res => {
        dispatch(
          addNewDownload(
            url,
            dirname,
            await getAvailableFileName(
              dirname,
              getFileName(res.headers),
              downloads
            ),
            getFileSize(res.headers)
          )
        );
      });
    }
  })
)(AddNewDownload);
