import React, { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';

const InputModal = ({
  inputType = 'text',
  label = 'Nhập dữ liệu',
  buttonTitle = 'Mở Modal',
  placeholder = 'Vui lòng nhập...',
  okText = 'Xác nhận',
  cancelText = 'Hủy',
  onOk = () => {},
  btnClassName = '',
  message = 'Vui lòng nhập dữ liệu!',
  ...props
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
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className={btnClassName}>
        {buttonTitle}
      </Button>
      <Modal
        title={label}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="inputValue" rules={[{ required: true, message: `${message}` }]}>
            <Input type={inputType} placeholder={placeholder} {...props} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export { InputModal };
