import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Upload, Card, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../configs';

export default function ImageCropper() {
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result));
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/webp');
    });
  };

  const uploadImage = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'cropped-image.jpg');

    try {
      const response = await api.post('/customize-file', formData, {
        requiresAuth: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedImageUrl(response.data);
      message.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image');
    }
  };

  const handleCropAndUpload = async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        await uploadImage(croppedImage);
      }
    }
  };

  return (
    <Card title="Image Cropper and Uploader" style={{ width: 400, margin: 'auto' }}>
      <Upload
        accept="image/*"
        showUploadList={false}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess('ok', file);
          }, 0);
        }}
        onChange={handleFileChange}
      >
        <Button icon={<UploadOutlined />}>Select Image</Button>
      </Upload>
      {image && (
        <div style={{ height: 300, position: 'relative', marginTop: 20 }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}
      <Button type="primary" onClick={handleCropAndUpload} disabled={!image} style={{ marginTop: 20 }}>
        Crop and Upload
      </Button>
      {uploadedImageUrl && (
        <div style={{ marginTop: 20, wordBreak: 'break-all' }}>
          <p>Uploaded Image URL:</p>
          <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
            {uploadedImageUrl}
          </a>
        </div>
      )}
    </Card>
  );
}
