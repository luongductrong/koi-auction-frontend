import React, { useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, DatePicker, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const KoiForm = ({ open, onCancel, initialValues = {}, mode = 'create' }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      birthday: initialValues.birthday ? moment(initialValues.birthday) : null,
    });
  }, [initialValues, form]);

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

  return (
    <Drawer
      open={open}
      title={mode === 'create' ? 'Thêm cá Koi mới' : 'Cập nhật thông tin cá Koi'}
      onClose={onCancel}
      width={700}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} type="primary">
            {mode === 'create' ? 'Thêm' : 'Cập nhật'}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" name="form_in_drawer">
        <Form.Item label="Tên cá" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên cá!' }]}>
          <Input placeholder="Nhập tên cá" />
        </Form.Item>

        <Form.Item label="Loại cá" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại cá!' }]}>
          <Select placeholder="Chọn loại cá">
            <Option value="Loại 1">Loại 1</Option>
            <Option value="Loại 2">Loại 2</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Nguồn gốc" name="origin" rules={[{ required: true, message: 'Vui lòng nhập nguồn gốc!' }]}>
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
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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
