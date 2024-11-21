import React, { useState } from 'react';
import { Modal, Button, Typography, Checkbox, Form, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../configs';

const { Text } = Typography;

function RegisterAuctionModal({ open = false, onClose, auctionId, depositAmount, setIsRegisted }) {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleRegister = async () => {
    if (!isChecked) {
      message.warning('Vui lòng xác nhận rằng bạn đã đọc và hiểu các quy định.');
      return;
    }

    if (!auctionId) {
      message.error('Không tìm thấy thông tin đấu giá.');
      onClose();
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`auction-participant/participant?auctionId=${auctionId}`, null, {
        requiresAuth: true,
        onUnauthorizedCallback: () => {
          message.error('Vui lòng đăng nhập để tham gia đấu giá.');
          navigate('/login');
        },
      });
      console.log('Register Auction Response 1:', response?.data);
      setIsRegisted(true);
      message.success('Đã đăng ký tham gia!');
    } catch (error) {
      if (error.response?.status === 402) {
        message.error('Số dư tài khoản không đủ.');
      } else {
        message.error('Đăng ký tham gia đấu giá thất bại! Vui lòng thử lại sau.');
        console.error('Register Auction Error:', error.response ? error.response.data : error.message);
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Đăng ký tham gia đấu giá"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleRegister} disabled={!isChecked} loading={loading}>
          Đăng ký
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Số tiền cọc (VND)" style={{ marginTop: '20px' }}>
          <Text strong type="danger">
            {depositAmount ? depositAmount.toLocaleString() : 0} VND
          </Text>
        </Form.Item>

        <Form.Item label="Quy định tham gia đấu giá">
          <Text>
            1. Tiền cọc sẽ được tự động trừ từ ví khi đăng ký tham gia đấu giá.
            <br />
            2. Số tiền cọc sẽ được hoàn lại nếu không thắng đấu giá.
            <br />
            3. Người tham gia có trách nhiệm tuân thủ tất cả quy định của hệ thống.
            <br />
            4. Số tiền đặt cọc sẽ bị giữ nếu có hành vi gian lận.
          </Text>
        </Form.Item>

        <Form.Item>
          <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
            Tôi đã đọc và hiểu các quy định tham gia đấu giá
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RegisterAuctionModal;
