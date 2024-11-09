import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, Button, DatePicker, Table, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';
import api from '../../configs';
import useAuth from '../../hook/useAuth';

const { Option } = Select;

const AuctionForm = ({ open, onCancel, mode = 'create', auctionId }) => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { onUnauthorized } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState({});
  const [koiList, setKoiList] = useState([]);
  const [koiData, setKoiData] = useState([]);

  const onUnauthorizedCallback = () => {
    onUnauthorized({
      error: true,
      messageText: 'Phiên đăng nhập đã hết hạn!',
      clear: true,
      navigation: true,
    });
  };

  useEffect(() => {
    console.log('AuctionId', auctionId);
    console.log('Mode', mode);
    const fetchKoiList = async () => {
      try {
        const response = await api.get('/koi-fish', {
          requiresAuth: true,
          onUnauthorizedCallback: onUnauthorizedCallback,
        });
        setKoiList(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setKoiList([]);
          message.info('Không có cá Koi nào!');
        } else {
          console.error('Failed to fetch koi list:', error);
          message.error('Lỗi khi tải thông tin cá Koi!');
        }
      }
    };
    fetchKoiList();

    if (mode !== 'create' && auctionId) {
      const fetchAuctionInfo = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/auction/${auctionId}`);
          if (response?.data) {
            setAuctionInfo(response.data);
            setKoiData(response.data.koiData || []);
            form.setFieldsValue({
              ...response.data,
              startTime: response.data.startTime ? moment(response.data.startTime) : null,
              endTime: response.data.endTime ? moment(response.data.endTime) : null,
            });
          } else {
            throw new Error("Can't get auction data");
          }
        } catch (error) {
          console.error('Failed to fetch auction info:', error);
          message.error('Lỗi khi tải thông tin đấu giá!');
        } finally {
          setLoading(false);
        }
      };
      fetchAuctionInfo();
    }
    setKoiData([]);
  }, [auctionId, form, mode, open]);

  const handleSubmit = () => {
    const onCreate = async (values) => {
      try {
        setLoading(true);
        console.log('Creating auction:', values);

        const res = await api.post('/auction/breeder/add-auction?', values, {
          requiresAuth: true,
          onUnauthorizedCallback: onUnauthorizedCallback,
        });
        message.success('Tạo phiên đấu giá thành công!');
        navigate('/account-center/auction');
      } catch (error) {
        console.error('Failed to create auction:', error);
        message.error('Lỗi khi tạo phiên đấu giá!');
      } finally {
        setLoading(false);
      }
    };

    console.log('Form values before validate:', form.getFieldsValue());
    form
      .validateFields()
      .then((values) => {
        values = {
          ...values,
          startTime: values.startTime ? values.startTime.toISOString() : null,
          endTime: values.endTime ? values.endTime.toISOString() : null,
          startingPrice: values.startingPrice ? Number(values.startingPrice) : null,
          buyoutPrice: values.buyoutPrice ? Number(values.buyoutPrice) : null,
          bidStep: values.bidStep ? Number(values.bidStep) : null,
          bidderDeposit: values.bidderDeposit ? Number(values.bidderDeposit) : null,
          koiIds: koiData.map((koi) => koi.id),
        };
        form.resetFields();
        console.log('Form values:', values);
        if (mode === 'create') {
          onCreate(values);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleAddKoi = (koiId) => {
    const koi = koiList.find((k) => k.id === koiId);
    if (koi && !koiData.some((item) => item.id === koi.id)) {
      setKoiData((prev) => [...prev, koi]);
    }
  };

  const handleRemoveKoi = (koiId) => {
    setKoiData((prev) => prev.filter((koi) => koi.id !== koiId));
  };

  const columns = [
    {
      title: 'Koi ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Koi Name',
      dataIndex: `${mode === 'create' ? 'name' : 'koiName'}`,
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="link" onClick={() => handleRemoveKoi(record.id)}>
          Xoá khỏi danh sách
        </Button>
      ),
    },
  ];

  return (
    <Drawer
      open={open}
      title={mode === 'create' ? 'Thêm phiên đấu giá mới' : `Thông tin đấu giá: AuctionID ${auctionId}`}
      onClose={onCancel}
      width={700}
      loading={loading}
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
      <Form form={form} layout="vertical" name="auction_form">
        <Form.Item
          label="Phương thức đấu giá"
          name="auctionMethod"
          rules={[{ required: true, message: 'Vui lòng chọn phương thức đấu giá!' }]}
        >
          <Select placeholder="Chọn phương thức đấu giá">
            <Option value="Ascending">Trả giá lên</Option>
            <Option value="Descending">Đặt giá xuống</Option>
            <Option value="Fixed-price">Bán với giá xác định</Option>
            <Option value="First-come">Bỏ giá một lần</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá khởi điểm"
          name="startingPrice"
          rules={[{ required: true, message: 'Vui lòng nhập giá khởi điểm!' }]}
        >
          <Input type="number" placeholder="Nhập giá khởi điểm" />
        </Form.Item>

        <Form.Item
          label="Giá mua ngay"
          name="buyoutPrice"
          rules={[{ required: true, message: 'Vui lòng nhập giá mua ngay!' }]}
        >
          <Input type="number" placeholder="Nhập giá mua ngay" />
        </Form.Item>

        <Form.Item label="Bước giá" name="bidStep" rules={[{ required: true, message: 'Vui lòng nhập bước giá!' }]}>
          <Input type="number" placeholder="Nhập bước giá" />
        </Form.Item>

        <Form.Item
          label="Số tiền cọc"
          name="bidderDeposit"
          rules={[{ required: true, message: 'Vui lòng nhập số tiền cọc!' }]}
        >
          <Input type="number" placeholder="Yêu cầu người tham gia cọc trước..." />
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name="startTime"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
        >
          <DatePicker style={{ width: '100%' }} showTime />
        </Form.Item>

        <Form.Item
          label="Thời gian kết thúc"
          name="endTime"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            showTime
            onChange={(_, day) => {
              console.log(day);
            }}
          />
        </Form.Item>

        <Form.Item label="Chọn cá Koi">
          <Select placeholder="Chọn cá Koi để thêm vào phiên đấu giá" onChange={handleAddKoi} style={{ width: '100%' }}>
            {koiList
              .filter((koi) => koi.status === 'Active')
              .map((koi) => (
                <Option key={koi.id} value={koi.id}>
                  {`ID: ${koi.id} - ${koi.name}`}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Danh sách cá Koi đã chọn">
          <Table columns={columns} dataSource={koiData.map((item) => ({ ...item, key: item.id }))} pagination={false} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AuctionForm;
