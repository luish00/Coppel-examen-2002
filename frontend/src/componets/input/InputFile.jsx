import React, { useCallback } from 'react';

import './inputFile.css';

const InputFile = ({
  className = "",
  onChange,
  disabled,
  id = "",
  title = 'Cargar archivo',
}) => {
  const handleOnChange = useCallback((event) => {
    const { files } = event.target;
    const input = files[0];

    if (!input) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const values = event.target.result.split('\n');

      onChange({ fileName: input.name, values });
    };

    reader.readAsText(input);
  }, [onChange])

  return (
    <div className={`fab-inp-container ${className} ${disabled ? 'fab-inp-container-disabled' : ''}`}>
      <label className="input-file" htmlFor={`inp-file-${id}`}>
        <div className='input-file-title'>
          <span className="material-icons">drive_folder_upload</span>

          <span>{title}</span>
        </div>

        <input
          accept='.csv'
          className='input-file'
          disabled={disabled}
          id={`inp-file-${id}`}
          onChange={handleOnChange}
          type="file"
        />
      </label>
    </div>
  );
}

export { InputFile };
