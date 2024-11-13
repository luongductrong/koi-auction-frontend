import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Slider, Button, Typography, Modal, Upload } from 'antd';
import { getOrientation } from 'get-orientation/browser';
// import ImgDialog from './ImgDialog';
import { getCroppedImg, getRotatedImage } from '../../utils/canvasAPI';

const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};

const ImageCropper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  const onFileChange = async (file) => {
    const imageDataUrl = await readFile(file);
    try {
      const orientation = await getOrientation(file);
      const rotation = ORIENTATION_TO_ANGLE[orientation];
      if (rotation) {
        const rotatedImage = await getRotatedImage(imageDataUrl, rotation);
        setImageSrc(rotatedImage);
      } else {
        setImageSrc(imageDataUrl);
      }
    } catch (e) {
      console.warn('Failed to detect the orientation', e);
    }
  };

  return (
    <div>
      {imageSrc ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '100%', height: 400, marginBottom: 16 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Typography.Text>Zoom</Typography.Text>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(value) => setZoom(value)}
              style={{ width: 200 }}
            />
            <Typography.Text>Rotation</Typography.Text>
            <Slider
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(value) => setRotation(value)}
              style={{ width: 200 }}
            />
          </div>
          <Button type="primary" onClick={showCroppedImage} style={{ marginTop: 16 }}>
            Show Result
          </Button>
          <Modal visible={!!croppedImage} footer={null} onCancel={onClose}>
            {/* <ImgDialog img={croppedImage} /> */}
            <div>{croppedImage}</div>
          </Modal>
        </div>
      ) : (
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            onFileChange(file);
            return false;
          }}
        >
          <Button>Upload Image</Button>
        </Upload>
      )}
    </div>
  );
};

async function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export default ImageCropper;
