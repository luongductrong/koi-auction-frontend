import React, { useState } from 'react';
import { Drawer, Form, Input, Button, App } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import api from '../../configs';

function PasswordChangeDrawer({ open = false, onClose = () => {} }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu mới không khớp!');
      return;
    }
    setLoading(true);
    try {
      await api.put(
        '/security/password',
        { password: currentPassword, newPassword: newPassword },
        { requiresAuth: true },
      );
      message.success('Đặt mật khẩu mới thành công!');
      form.resetFields();
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error('Mật khẩu hiện tại không đúng!');
      } else {
        message.error('Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer title="Đổi mật khẩu" placement="right" onClose={onClose} open={open} width={500}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
            { max: 100, message: 'Không được vượt quá 100 ký tự!' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
              message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu mới"
            onChange={() => form.validateFields(['confirmPassword'])}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default PasswordChangeDrawer;
