import React, { useState } from 'react';

const UploadImage = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result); // Pass the data URL to the parent
      };
      reader.readAsDataURL(file); // Read the file as a data URL
      setFile(null); // Reset the file input
    }
  };

  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '25%',
    height: '25%',
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
