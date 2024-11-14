import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, Button, DatePicker, Upload, App, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../configs';
import moment from 'moment';

const { Option } = Select;

const KoiForm = ({ open, onCancel, mode = 'create', koiId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [headerImage, setHeaderImage] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [video, setVideo] = useState([]);

  useEffect(() => {
    if (mode !== 'create' && koiId) {
      fetchKoiInfo(koiId);
    }
  }, [koiId, form, mode, open]);

  const fetchKoiInfo = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/koi-fish/${id}`, { requiresAuth: true });
      const data = response.data;
      form.setFieldsValue({
        ...data,
        birthday: data.birthday ? moment(data.birthday) : null,
        name: data.koiName,
        koiTypeID: data.koiTypeName,
        countryID: data.koiOriginName,
      });
      if (data.headerImage) setHeaderImage([{ url: data.headerImage }]);
      if (data.detailImages) setDetailImages(data.detailImages.map((img) => ({ url: img })));
      if (data.video) setVideo([{ url: data.video }]);
    } catch (error) {
      console.error('Failed to fetch koi info:', error);
      message.error('Lỗi khi tải thông tin cá Koi!');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    try {
      const response = await api.post('/customize-file', formData, {
        requiresAuth: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload file:', error);
      message.error('Lỗi khi tải lên file!');
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (headerImage.length === 0 || detailImages.length === 0 || video.length === 0) {
        message.error('Vui lòng tải lên đầy đủ hình ảnh và video!');
        return;
      }

      setLoading(true);

      // Upload files and get URLs
      const headerImageUrl = await uploadFile(headerImage[0].originFileObj, 'header');
      const detailImageUrls = await Promise.all(detailImages.map((file) => uploadFile(file.originFileObj, 'detail')));
      const videoUrl = await uploadFile(video[0].originFileObj, 'video');

      if (!headerImageUrl || detailImageUrls.includes(null) || !videoUrl) {
        message.error('Lỗi khi tải lên file. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      const koiData = {
        ...values,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
        imageHeader: headerImageUrl,
        imageDetail: detailImageUrls,
        video: videoUrl,
      };

      console.log('Koi Data:', koiData);

      const response = await api.post('/koi-fish/customize-koi-fish', koiData, { requiresAuth: true });

      message.success('Thêm cá Koi thành công!');
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Failed to submit form:', error);
      message.error('Lỗi khi thêm cá Koi!');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info, setter) => {
    setter(info.fileList);
  };

  return (
    <Drawer
      open={open}
      title={mode === 'create' ? 'Thêm cá Koi mới' : `Thông tin cá Koi: KoiID ${koiId}`}
      onClose={onCancel}
      width={700}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} type="primary" loading={loading}>
            {mode === 'create' ? 'Thêm' : 'Cập nhật'}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" name="form_in_drawer">
        <Form.Item name="name" label="Tên cá" rules={[{ required: true, message: 'Vui lòng nhập tên cá!' }]}>
          <Input placeholder="Nhập tên cá" />
        </Form.Item>

        <Form.Item name="koiTypeID" label="Loại cá" rules={[{ required: true, message: 'Vui lòng chọn loại cá!' }]}>
          <Select placeholder="Chọn loại cá">
            <Option value="1">Kohaku</Option>
            <Option value="2">Taisho Sanke</Option>
            <Option value="3">Showa Sanshoku</Option>
            <Option value="4">Shiro Utsuriu</Option>
            <Option value="5">Asagi</Option>
            <Option value="6">Shusui</Option>
            <Option value="7">Utsurimono</Option>
            <Option value="8">Bekko</Option>
            <Option value="9">Tancho</Option>
            <Option value="10">Ochiba Shigure</Option>
            <Option value="11">Kumonryu</Option>
            <Option value="12">Doitsu</Option>
            <Option value="13">Chagoi</Option>
            <Option value="14">Yamabuki Ogon</Option>
            <Option value="15">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item name="countryID" label="Nguồn gốc" rules={[{ required: true, message: 'Vui lòng chọn nguồn gốc!' }]}>
          <Select placeholder="Chọn nguồn gốc">
            <Option value="1">Nhật Bản</Option>
            <Option value="2">Việt Nam</Option>
            <Option value="3">Indonesia</Option>
            <Option value="4">Malaysia</Option>
            <Option value="5">Thái Lan</Option>
            <Option value="6">Trung Quốc</Option>
            <Option value="7">Singapore</Option>
            <Option value="8">Hàn Quốc</Option>
            <Option value="9">Đài Loan</Option>
            <Option value="10">Philippines</Option>
            <Option value="11">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}>
          <Input type="number" placeholder="Nhập cân nặng" />
        </Form.Item>

        <Form.Item
          name="length"
          label="Chiều dài (cm)"
          rules={[{ required: true, message: 'Vui lòng nhập chiều dài!' }]}
        >
          <Input type="number" placeholder="Nhập chiều dài" />
        </Form.Item>

        <Form.Item name="sex" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
          <Select placeholder="Chọn giới tính">
            <Option value="Male">Đực</Option>
            <Option value="Female">Cái</Option>
            <Option value="Unknown">Không xác định</Option>
          </Select>
        </Form.Item>

        <Form.Item name="birthday" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Nhập mô tả (không bắt buộc)" />
        </Form.Item>

        <Form.Item
          name="headerImage"
          label="Hình ảnh chính"
          rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh chính!' }]}
        >
          <Upload
            listType="picture-card"
            fileList={headerImage}
            onChange={(info) => handleFileChange(info, setHeaderImage)}
            beforeUpload={() => false}
          >
            {headerImage.length < 1 && <UploadOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item
          name="detailImages"
          label="Hình ảnh chi tiết"
          rules={[{ required: true, message: 'Vui lòng tải lên ít nhất một hình ảnh chi tiết!' }]}
        >
          <Upload
            listType="picture-card"
            fileList={detailImages}
            onChange={(info) => handleFileChange(info, setDetailImages)}
            beforeUpload={() => false}
            multiple
          >
            {detailImages.length < 5 && <UploadOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item name="video" label="Video" rules={[{ required: true, message: 'Vui lòng tải lên video!' }]}>
          <Upload
            accept="video/*"
            listType="picture-card"
            fileList={video}
            onChange={(info) => handleFileChange(info, setVideo)}
            beforeUpload={() => false}
          >
            {video.length < 1 && <UploadOutlined />}
          </Upload>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default KoiForm;
