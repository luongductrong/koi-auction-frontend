import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const InputModal = ({
  inputType = 'text',
  label = 'Nhập dữ liệu',
  placeholder = 'Vui lòng nhập...',
  onOk = () => {},
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // Tạo instance form

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values.inputValue); // Gửi dữ liệu input ra ngoài thông qua prop onOk
      setIsModalVisible(false);
      form.resetFields(); // Reset form sau khi submit
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form khi hủy
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Mở Modal
      </Button>
      <Modal
        title={label}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="inputValue" rules={[{ required: true, message: `Vui lòng nhập ${label.toLowerCase()}!` }]}>
            <Input type={inputType} placeholder={placeholder} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export { InputModal };
