import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, Button, DatePicker, Modal, Table, message } from 'antd';
import moment from 'moment';
import api from '../../configs';

const { Option } = Select;

const AuctionForm = ({ open, onCancel, mode = 'create', auctionId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState({});
  const [koiData, setKoiData] = useState([]);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [isKoiModalVisible, setIsKoiModalVisible] = useState(false);

  useEffect(() => {
    if (mode !== 'create' && auctionId) {
      const fetchAuctionInfo = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/auction/${auctionId}`);
          setAuctionInfo(response.data);
          setKoiData(response.data.koiData || []);
          form.setFieldsValue({
            ...response.data,
            startTime: response.data.startTime ? moment(response.data.startTime) : null,
            endTime: response.data.endTime ? moment(response.data.endTime) : null,
          });
        } catch (error) {
          console.error('Failed to fetch auction info:', error);
          message.error('Lỗi khi tải thông tin đấu giá!');
        } finally {
          setLoading(false);
        }
      };
      fetchAuctionInfo();
    }
  }, [auctionId, form, mode, open]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        // onCreate(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleViewKoiDetails = (koi) => {
    setSelectedKoi(koi);
    setIsKoiModalVisible(true);
  };

  const handleKoiModalClose = () => {
    setIsKoiModalVisible(false);
    setSelectedKoi(null);
  };

  const columns = [
    {
      title: 'Koi Name',
      dataIndex: 'koiName',
      key: 'koiName',
    },
    {
      title: 'Type',
      dataIndex: 'koiType',
      key: 'koiType',
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="link" onClick={() => handleViewKoiDetails(record)}>
          View Details
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
            <Option value="Ascending">Ascending</Option>
            <Option value="Descending">Descending</Option>
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

        <Form.Item
          label="Ngày bắt đầu"
          name="startTime"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker style={{ width: '100%' }} showTime />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="endTime"
          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
        >
          <DatePicker style={{ width: '100%' }} showTime />
        </Form.Item>

        <Form.Item label="Danh sách cá Koi">
          <Table columns={columns} dataSource={koiData.map((item) => ({ ...item, key: item.id }))} pagination={false} />
        </Form.Item>
      </Form>

      {/* Modal to view detailed Koi information */}
      <Modal
        title={`Chi tiết Koi: ${selectedKoi?.koiName}`}
        open={isKoiModalVisible}
        onCancel={handleKoiModalClose}
        footer={[
          <Button key="close" onClick={handleKoiModalClose}>
            Đóng
          </Button>,
        ]}
      >
        {selectedKoi && (
          <div>
            <p>
              <b>Loại:</b> {selectedKoi.koiType}
            </p>
            <p>
              <b>Cân nặng:</b> {selectedKoi.weight} kg
            </p>
            <p>
              <b>Chiều dài:</b> {selectedKoi.length} cm
            </p>
            <p>
              <b>Giới tính:</b> {selectedKoi.sex}
            </p>
            <p>
              <b>Ngày sinh:</b> {selectedKoi.birthday}
            </p>
            <p>
              <b>Mô tả:</b> {selectedKoi.description}
            </p>
            {/* Add other fields as necessary */}
          </div>
        )}
      </Modal>
    </Drawer>
  );
};

export default AuctionForm;
