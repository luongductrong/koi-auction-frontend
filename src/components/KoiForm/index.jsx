import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, Button, DatePicker, Upload, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../configs';
import moment from 'moment';

const { Option } = Select;

const KoiForm = ({ open, onCancel, mode = 'create', koiId }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [koiInfo, setKoiInfo] = useState({});
  const [headerImage, setHeaderImage] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [video, setVideo] = useState([]);

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
            name: response.data.koiName,
            koiTypeID: response.data.koiTypeName,
            countryID: response.data.koiOriginName,
          });
          if (response.data.headerImage) setHeaderImage([{ url: response.data.headerImage }]);
          if (response.data.detailImages) setDetailImages(response.data.detailImages.map((img) => ({ url: img })));
          if (response.data.video) setVideo([{ url: response.data.video }]);
        } catch (error) {
          console.error('Failed to fetch koi info:', error);
          message.error('Lỗi khi tải thông tin cá Koi!');
        } finally {
          setLoading(false);
        }
      };
      fetchKoiInfo();
    }
  }, [koiId, form, mode, open]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (headerImage.length === 0) {
          message.error('Vui lòng tải lên một hình ảnh chính!');
          return;
        }

        if (detailImages.length === 0) {
          message.error('Vui lòng tải lên ít nhất một hình ảnh chi tiết!');
          return;
        }

        if (video.length === 0) {
          message.error('Vui lòng tải lên ít nhất một video!');
          return;
        }

        if (mode === 'create') handleFormSubmitCreate();
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleFormSubmitCreate = async () => {
    try {
      const values = form.getFieldsValue();
      console.log('Form Values:', values);
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('koiTypeID', values.koiTypeID);
      formData.append('countryID', values.countryID);
      formData.append('weight', values.weight);
      formData.append('length', values.length);
      formData.append('sex', values.sex);
      formData.append('birthday', values.birthday ? values.birthday.format('YYYY-MM-DD') : null);
      formData.append('description', values.description || '');

      // Thêm hình ảnh chính
      formData.append('image-header', headerImage[0].originFileObj); // Ảnh chính
      // Thêm hình ảnh chi tiết
      detailImages.forEach((file) => {
        formData.append('image-detail', file.originFileObj); // Ảnh chi tiết
      });
      // Thêm video
      video.forEach((file) => {
        formData.append('video', file.originFileObj); // Video
      });

      console.log('Form Data:', formData);

      const response = await api.post('/koi-fish/customize-koi-fish', formData, {
        requiresAuth: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Thêm cá Koi thành công!');
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Failed to create Koi:', error);
      message.error('Lỗi khi thêm cá Koi!');
    }
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

        <Form.Item label="Loại cá" name="koiTypeID" rules={[{ required: true, message: 'Vui lòng chọn loại cá!' }]}>
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

        <Form.Item label="Nguồn gốc" name="countryID" rules={[{ required: true, message: 'Vui lòng chọn nguồn gốc!' }]}>
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

        <Form.Item
          label="Cân nặng (kg) (ước tính)"
          name="weight"
          rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}
        >
          <Input type="number" placeholder="Nhập cân nặng" />
        </Form.Item>

        <Form.Item
          label="Chiều dài (cm) (ước tính)"
          name="length"
          rules={[{ required: true, message: 'Vui lòng nhập chiều dài!' }]}
        >
          <Input type="number" placeholder="Nhập chiều dài" />
        </Form.Item>

        <Form.Item label="Giới tính" name="sex" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
          <Select placeholder="Chọn giới tính">
            <Option value="Male">Đực</Option>
            <Option value="Female">Cái</Option>
            <Option value="Unknown">Không xác định</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày sinh (ước tính)"
          name="birthday"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
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
          <Input.TextArea rows={3} placeholder="Nhập mô tả (không bắt buộc)" />
        </Form.Item>

        <Form.Item
          label="Tải lên hình ảnh chính"
          name="image-header"
          rules={[{ required: true, message: 'Vui lòng tải lên ít nhất một hình ảnh chính!' }]}
        >
          <Upload
            listType="picture-card"
            fileList={headerImage}
            onChange={({ fileList }) => setHeaderImage(fileList)}
            beforeUpload={() => false} // Chặn upload tự động
          >
            {headerImage.length < 1 && <UploadOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Tải lên hình ảnh chi tiết"
          name="image-detail"
          rules={[{ required: true, message: 'Vui lòng tải lên ít nhất một hình ảnh chi tiết!' }]}
        >
          <Upload
            listType="picture-card"
            fileList={detailImages}
            onChange={({ fileList }) => setDetailImages(fileList)}
            beforeUpload={() => false} // Chặn upload tự động
            multiple
          >
            {detailImages.length < 5 && <UploadOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Tải lên video"
          name="video"
          rules={[{ required: true, message: 'Vui lòng tải lên ít nhất một video!' }]}
        >
          <Upload
            accept="video/*"
            listType="picture-card"
            fileList={video}
            onChange={({ fileList }) => setVideo(fileList)}
            beforeUpload={() => false} // Chặn upload tự động
          >
            {video.length < 1 && <UploadOutlined />}
          </Upload>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default KoiForm;
