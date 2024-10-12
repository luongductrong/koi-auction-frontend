import { Form, Input, Checkbox } from 'antd';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Thông tin tài khoản',
    content: (
      <>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng điền tên đăng nhập!' }]}
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
      </>
    ),
  },
  {
    title: 'Thông tin cá nhân',
    content: (
      <>
        <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
          <Input placeholder="Họ và tên" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải bao gồm 10 chữ số!' },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input placeholder="Địa chỉ" />
        </Form.Item>
      </>
    ),
  },
  {
    title: 'Mật khẩu',
    content: (
      <>
        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>
      </>
    ),
  },
  {
    title: 'Điều khoản',
    content: (
      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản')),
          },
        ]}
      >
        <Checkbox>
          Tôi đồng ý với <Link to="/terms">điều khoản sử dụng</Link>.
        </Checkbox>
      </Form.Item>
    ),
  },
];

export { steps };
