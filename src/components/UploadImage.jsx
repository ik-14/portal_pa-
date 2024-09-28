import React, { useState } from 'react';

const UploadImage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle file upload logic here
    console.log(file);
  };

  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '15%',
    height: '15%',
    zIndex: 1,
    backgroundColor: 'gray',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
  };

  return (
    <div style={style}>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          style={{ marginBottom: '10px' }} 
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadImage;
