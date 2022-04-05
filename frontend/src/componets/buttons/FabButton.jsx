import React, { useCallback } from 'react';

import './fabButton.css'

const FabButton = ({
  maxHeight = 1050,
  maxWidth = 1680,
  onLoad,
}) => {
  const resizeMe = useCallback(({ image, ext }) => {
    const canvas = document.createElement('canvas');

    let width = image.width;
    let height = image.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        //height *= maxWidth / width;
        height = Math.round(height *= maxWidth / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        //width *= maxHeight / height;
        width = Math.round(width *= maxHeight / height);
        height = maxHeight;
      }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL(`image/${ext}`, 0.8); // get the data from canvas as 70% JPG (can be also PNG, etc.)
  }, []);

  const processFile = useCallback((file) => {
    if (!file) {
      return;
    }

    // read the files
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    const { name } = file;
    const lastDot = name.lastIndexOf('.');

    const ext = name.substring(lastDot + 1).toLowerCase();

    reader.onload = function (event) {
      // blob stuff
      const blob = new Blob([event.target.result]); // create blob...
      window.URL = window.URL || window.webkitURL;
      const blobURL = window.URL.createObjectURL(blob); // and get it's URL

      // helper Image object
      const image = new Image();
      image.src = blobURL;
      //preview.appendChild(image); // preview commented out, I am using the canvas instead
      image.onload = function () {
        // have to wait till it's loaded
        const resized = resizeMe({ image, ext: ext === "png" ? ext : 'jpeg' }); // send it to canvas

        if (onLoad) {
          onLoad({ target: { value: resized, file } });
        }
      }
    };
  }, [])

  const handleOnChange = useCallback((event) => {
    const { files } = event.target;

    console.log('eup')

    processFile(files[0])
  }, []);

  return (
    <div className="fab-inp-container">
      <label className="input-file" htmlFor="inp-file">
        <div className="input-file-icon"><span>+</span></div>

        <input
          accept="image/*"
          className="input-file"
          id="inp-file"
          onChange={handleOnChange}
          type="file"
        />
      </label>
    </div>
  )
};

export { FabButton };
