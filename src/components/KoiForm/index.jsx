import React, { useEffect, useState, useRef } from 'react';
import { Drawer, Form, Input, Select, Button, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../configs';
import moment from 'moment';

const { Option } = Select;

const KoiForm = ({ open, onCancel, mode = 'create', koiId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [koiInfo, setKoiInfo] = useState({});

  useEffect(() => {
    if (mode !== 'create' && koiId) {
      const fetchKoiInfo = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/koi-fish/${koiId}`);
          setKoiInfo(response.data);
          form.setFieldsValue({
            ...response.data,
            birthday: response.data.birthday ? moment(response.data.birthday) : null,
          });
        } catch (error) {
          console.error('Failed to fetch koi info:', error);
          message.error('Lỗi khi tải thông tin cá Koi!');
        } finally {
          setLoading(false);
        }
      };
      console.log('Fetching koi info...', koiId);
      fetchKoiInfo();
    }
  }, [koiId, form, mode, open]);

  const imageBeforeUpload = (file) => {
    const isValidImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isValidImage) {
      message.error('Chỉ được tải lên file hình ảnh (jpg, png, webp)');
    }
    return isValidImage ? true : Upload.LIST_IGNORE;
  };

  const videoBeforeUpload = (file) => {
    const isValidVideo = file.type === 'video/mp4';
    if (!isValidVideo) {
      message.error('Chỉ được tải lên file video định dạng mp4');
    }
    return isValidVideo ? true : Upload.LIST_IGNORE;
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const hasImages = values.images && values.images.fileList.length > 0;
        const hasVideos = values.videos && values.videos.fileList.length > 0;

        if (!hasImages) {
          message.error('Vui lòng tải lên ít nhất một hình ảnh!');
          return;
        }

        if (!hasVideos) {
          message.error('Vui lòng tải lên ít nhất một video!');
          return;
        }

        form.resetFields();
        // onCreate(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleClose = () => {
    if (mode !== 'create') {
      form.resetFields();
    }
    onCancel();
  };

  return (
    <Drawer
      open={open}
      title={mode === 'create' ? 'Thêm cá Koi mới' : `Thông tin cá Koi: KoiID ${koiId}`}
      onClose={handleClose}
      width={700}
      loading={loading}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} type="primary">
            {mode === 'create' ? 'Thêm' : 'Cập nhật'}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" name="form_in_drawer">
        <Form.Item label="Tên cá" name="koiName" rules={[{ required: true, message: 'Vui lòng nhập tên cá!' }]}>
          <Input placeholder="Nhập tên cá" />
        </Form.Item>

        <Form.Item label="Loại cá" name="koiTypeName" rules={[{ required: true, message: 'Vui lòng chọn loại cá!' }]}>
          <Select placeholder="Chọn loại cá">
            <Option value="Loại 1">Loại 1</Option>
            <Option value="Loại 2">Loại 2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Nguồn gốc"
          name="koiOriginName"
          rules={[{ required: true, message: 'Vui lòng nhập nguồn gốc!' }]}
        >
          <Input placeholder="Nhập nguồn gốc" />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
          <Select placeholder="Chọn trạng thái">
            <Option value="Đang nuôi">Đang nuôi</Option>
            <Option value="Bán">Bán</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Cân nặng (kg)" name="weight" rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}>
          <Input type="number" placeholder="Nhập cân nặng" />
        </Form.Item>

        <Form.Item
          label="Chiều dài (cm)"
          name="length"
          rules={[{ required: true, message: 'Vui lòng nhập chiều dài!' }]}
        >
          <Input type="number" placeholder="Nhập chiều dài" />
        </Form.Item>

        <Form.Item label="Giới tính" name="sex" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
          <Select placeholder="Chọn giới tính">
            <Option value="Male">Đực</Option>
            <Option value="Female">Cái</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ngày sinh" name="birthday" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            onChange={(date) => {
              if (date) {
                form.setFieldsValue({ birthday: date });
              } else {
                form.setFieldsValue({ birthday: null });
              }
            }}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          label="Tải lên hình ảnh"
          name="images"
          rules={[{ required: true, message: 'Vui lòng tải lên ít nhất một hình ảnh!' }]}
        >
          <Upload multiple maxCount={5} listType="picture" beforeUpload={imageBeforeUpload}>
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Tải lên video"
          name="videos"
          rules={[{ required: true, message: 'Vui lòng tải lên ít nhất một video!' }]}
        >
          <Upload multiple maxCount={3} beforeUpload={videoBeforeUpload}>
            <Button icon={<UploadOutlined />}>Chọn video</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default KoiForm;
