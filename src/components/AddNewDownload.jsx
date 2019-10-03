import React from 'react';

function AddNewDownload({ onAdd = () => { } }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(e.target['url'].value);
    e.target['url'].value = null;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="url" type="text" placeholder="Enter url" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddNewDownload;
