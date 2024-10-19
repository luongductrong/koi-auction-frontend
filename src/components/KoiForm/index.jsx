// KoiForm.jsx
import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const KoiForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Thêm cá Koi mới"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
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
      </Form>
    </Modal>
  );
};

export default KoiForm;
