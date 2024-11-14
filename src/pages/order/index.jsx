import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Space, Row, Col, Select, App, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook';
import { ShoppingCartOutlined } from '@ant-design/icons';
import api, { provinceApi } from '../../configs';
import styles from './index.module.scss';
import shipping from '../../assets/images/arriving-soon-delivery.gif';

const { Title, Text } = Typography;

function Order() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const { onUnauthorized } = useAuth();
  const auctionId = new URLSearchParams(location.search).get('auction-id');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [auctionInfo, setAuctionInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const fetchAuctionInfo = async () => {
      try {
        setDataLoading(true);
        const response = await api.get(`/auction/${auctionId}`);
        console.log('Auction Info:', response?.data);
        setAuctionInfo(response?.data);
      } catch (error) {
        console.error('Failed to fetch auction info:', error);
        message.error('Lỗi khi tải thông tin đấu giá!');
      } finally {
        setDataLoading(false);
      }
    };
    if (auctionId) {
      fetchAuctionInfo();
    } else {
      navigate('/404');
    }
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await provinceApi.get('/1/0.htm');
        setProvinces(response?.data?.data);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
        message.error('Lỗi khi tải danh sách tỉnh thành!');
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = (_, option) => {
    form.setFieldsValue({
      province: option.label,
      district: null,
      ward: null,
    });
    setDistricts([]);
    setWards([]);

    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const response = await provinceApi.get(`/2/${option.value}.htm`);
        setDistricts(response?.data?.data);
      } catch (error) {
        console.error('Failed to fetch districts:', error);
        message.error('Lỗi khi tải danh sách quận huyện!');
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  };

  const handleDistrictChange = (_, option) => {
    form.setFieldsValue({
      district: option.label,
      ward: null,
    });
    setWards([]);
    const fetchWards = async () => {
      try {
        setLoading(true);
        const response = await provinceApi.get(`/3/${option.value}.htm`);
        setWards(response?.data?.data);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
        message.error('Lỗi khi tải danh sách xã phường!');
      } finally {
        setLoading(false);
      }
    };
    fetchWards();
  };

  const handleWardChange = (_, option) => {
    form.setFieldsValue({
      ward: option.label,
    });
  };

  const onFinish = (values) => {
    const order = async (req) => {
      try {
        setBtnLoading(true);
        await api.post('/order', req, {
          requiresAuth: true,
          onUnauthorizedCallback: () =>
            onUnauthorized({
              navigation: true,
              clear: true,
              error: true,
              messageText: 'Phiên đăng nhập đã hết hạn!',
            }),
        });
        message.success('Tạo đơn hàng thành công!');
        navigate('/account-center/order');
      } catch (error) {
        console.error('Failed to place order:', error);
        message.error('Lỗi khi đặt hàng!');
      } finally {
        setBtnLoading(false);
      }
    };

    const req = {
      ...values,
      address: JSON.stringify({
        province: values.province,
        district: values.district,
        ward: values.ward,
        address: values.address,
      }),
      auctionID: auctionId,
    };
    delete req.province;
    delete req.district;
    delete req.ward;
    console.log('Form values:', req);
    order(req);
  };

  return (
    <div className={styles.container}>
      <Row>
        <Col xs={24} md={12} className={styles.leftCol}>
          {dataLoading ? (
            <div className={styles.loading}>
              <Spin />
            </div>
          ) : (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <img src={shipping} alt="shipping" className={styles.img} />
              <div>
                <Title level={5}>Chi tiết thanh toán</Title>
                <Space direction="vertical">
                  <Text>{`Tổng tiền đơn hàng: ${auctionInfo?.finalPrice?.toLocaleString()} VND`}</Text>
                  <Text>{`Số tiền đã cọc trước: ${auctionInfo?.bidderDeposit?.toLocaleString()} VNĐ`}</Text>
                  <Text strong>{`Tổng tiền thanh toán: ${(
                    auctionInfo?.finalPrice - auctionInfo?.bidderDeposit || 0
                  ).toLocaleString('vi-VN')} VND`}</Text>
                </Space>
              </div>
            </Space>
          )}
        </Col>
        <Col xs={24} md={12} className={styles.rightCol}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={3}>Thông tin người nhận hàng</Title>
              <Text>Vui lòng điền đầy đủ thông tin bên dưới để hoàn tất đơn hàng</Text>
            </div>
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input placeholder="Nhập họ và tên của bạn" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
                ]}
              >
                <Input
                  placeholder="Nhập số điện thoại của bạn"
                  count={{
                    show: true,
                    max: 10,
                  }}
                />
              </Form.Item>

              <Form.Item label="Địa chỉ" style={{ marginBottom: 0 }}>
                <Form.Item
                  name="province"
                  rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                  className={styles.addressInput}
                >
                  <Select
                    mode="combobox"
                    placeholder="Tỉnh/Thành phố"
                    loading={loading}
                    onChange={handleProvinceChange}
                    options={provinces.map((province) => ({ value: province.id, label: province.full_name }))}
                  />
                </Form.Item>

                <Form.Item
                  name="district"
                  rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                  className={styles.addressInput}
                >
                  <Select
                    placeholder="Quận/Huyện"
                    loading={loading}
                    onChange={handleDistrictChange}
                    disabled={!form.getFieldValue().province || !districts?.length > 0}
                    options={districts.map((district) => ({ value: district.id, label: district.full_name }))}
                  />
                </Form.Item>

                <Form.Item
                  name="ward"
                  rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                  className={styles.addressInput}
                >
                  <Select
                    placeholder="Phường/Xã"
                    loading={loading}
                    onChange={handleWardChange}
                    disabled={!form.getFieldValue().district || !wards?.length > 0}
                    options={wards.map((ward) => ({ value: ward.id, label: ward.full_name }))}
                  />
                </Form.Item>

                <Form.Item name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                  <Input placeholder="Số nhà, tên đường" />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea placeholder="Ghi chú thêm (nếu có)" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  style={{ width: '100%' }}
                  loading={btnLoading}
                >
                  Thanh toán
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default Order;
// {"province": "Thành phố Hồ Chí Minh", "district": "Thành phố Thủ Đức", "ward": "Phường Linh Trung", "address": "Linh Trung"}
