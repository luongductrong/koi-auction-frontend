import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, Button, DatePicker, App, InputNumber, Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import api from '../../configs';
import useAuth from '../../hook/useAuth';
import { handleFormVisibleConfig } from './formConfig';

const { Option } = Select;

const AuctionForm = ({ open, onCancel, mode = 'create', auctionId, onSuccess }) => {
  const { message } = App.useApp();
  const { onUnauthorized } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState({});
  const [koiActiveList, setKoiActiveList] = useState([]);
  const [auctionAmount, setAuctionAmount] = useState({ auctionFee: 0, depositFee: 0 });
  const [modalOpen, setModalOpen] = useState(false);

  const [auctionMethod, setAuctionMethod] = useState('Ascending');
  const [formVisibleConfig, setFormVisibleConfig] = useState(handleFormVisibleConfig(auctionMethod));
  const [modalValues, setModalValues] = useState({});

  const [koiAuctionData, setKoiAuctionData] = useState([]);

  const onUnauthorizedCallback = () => {
    onUnauthorized({
      error: true,
      messageText: 'Phiên đăng nhập đã hết hạn!',
      clear: true,
      navigation: true,
    });
  };

  const onClose = () => {
    setAuctionMethod('Ascending');
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    setFormVisibleConfig(handleFormVisibleConfig(auctionMethod));
  }, [auctionMethod]);

  useEffect(() => {
    console.log('AuctionId', auctionId);
    console.log('Mode', mode);
    const fetchKoiActiveList = async () => {
      try {
        const response = await api.get('/koi-fish/koi-active', {
          requiresAuth: true,
          onUnauthorizedCallback: onUnauthorizedCallback,
        });
        setKoiActiveList(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.response?.status === 404) {
          setKoiActiveList([]);
          message.info('Không có cá Koi nào!');
        } else {
          console.error('Failed to fetch koi list:', error);
          message.error('Lỗi khi tải thông tin cá Koi!');
        }
      }
      try {
        const [auctionFeeRes, depositFeeRes] = await Promise.all([
          api.get('/system-config/auction-fee'),
          api.get('/system-config/breeder-deposit'),
        ]);
        setAuctionAmount({ auctionFee: auctionFeeRes.data, depositFee: depositFeeRes.data });
      } catch (error) {
        console.error('Failed to fetch auction amount:', error);
        message.error('Lỗi khi tải thông tin về phí hệ thống!');
      }
    };
    fetchKoiActiveList();

    if (mode !== 'create' && auctionId) {
      const fetchAuctionInfo = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/auction/${auctionId}`);
          if (response?.data) {
            setAuctionInfo(response.data);
            setKoiAuctionData(response.data.koiData || []);
            setAuctionMethod(response?.data?.auctionMethod || 'Ascending');
            form.setFieldsValue({
              ...response.data,
              startTime: response.data.startTime ? moment(response.data.startTime) : null,
              endTime: response.data.endTime ? moment(response.data.endTime) : null,
              koiIds: response.data.koiData.map((koi) => koi.id),
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
    setKoiAuctionData([]);
  }, [auctionId, form, mode, open]);

  const calculateDesc = () => {
    if (auctionMethod === 'Descending') {
      try {
        const { startingPrice, reductionStep, bidStep, startTime, durationStepInput, durationUnit } =
          form.getFieldsValue();
        if (startingPrice && reductionStep && bidStep) {
          const buyoutPrice = Number(startingPrice) - Number(reductionStep) * Number(bidStep);
          form.setFieldsValue({ buyoutPrice: buyoutPrice > 0 ? buyoutPrice : 0 });
        }

        if (startTime && reductionStep && durationStepInput && durationUnit) {
          console.log('Start Time:', startTime);
          console.log('Duration Step:', durationStepInput);
          console.log('Duration Unit:', durationUnit);
          console.log('Reduction Step:', reductionStep);
          const endTime = moment(startTime.toISOString()).add(durationStepInput * reductionStep, durationUnit);
          console.log('End Time:', endTime);
          form.setFieldsValue({ endTime });
        } else {
          form.setFieldsValue({ endTime: null });
        }
      } catch (error) {
        console.error('Failed to calculate desc:', error);
        message.error('Lỗi hệ thống!');
      }
    }
  };

  const onCreate = async (values) => {
    try {
      setLoading(true);
      console.log('Creating auction:', values);

      await api.post('/auction/breeder/add-auction?', values, {
        requiresAuth: true,
        onUnauthorizedCallback: onUnauthorizedCallback,
      });
      message.success('Tạo phiên đấu giá thành công!');
      form.resetFields();
      setModalOpen(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create auction:', error);
      message.error('Lỗi khi tạo phiên đấu giá!');
      setModalOpen(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    console.log('Form values before validate:', form.getFieldsValue());
    form
      .validateFields()
      .then((values) => {
        values = {
          ...values,
          startTime: values.startTime ? values.startTime.toISOString() : null,
          endTime: values.endTime ? values.endTime.toISOString() : null,
          startingPrice: values.startingPrice ? Number(values.startingPrice) : 0,
          buyoutPrice: values.buyoutPrice ? Number(values.buyoutPrice) : 0,
          bidStep: values.bidStep ? Number(values.bidStep) : 0,
          bidderDeposit: values.bidderDeposit ? Number(values.bidderDeposit) : 0,
          koiIds: values.koiIds,
        };
        console.log('Form values:', values);
        if (mode === 'create') {
          setModalValues(values);
          setModalOpen(true);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Drawer
      open={open}
      title={
        mode === 'create'
          ? 'Thêm phiên đấu giá mới'
          : `Thông tin đấu giá: ${auctionId} - Đấu giá ${koiAuctionData.map((koi) => koi.koiName).join(', ')}`
      }
      onClose={onClose}
      width={700}
      loading={loading}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          {mode === 'update' && (
            <Button onClick={() => alert('Chưa hỗ trợ')} type="primary" ghost style={{ marginRight: 8 }}>
              Yêu cầu huỷ
            </Button>
          )}
          <Button onClick={() => handleSubmit()} type="primary">
            {mode === 'create' ? 'Gửi yêu cầu' : 'Cập nhật'}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" name="auction_form">
        {mode == 'create' && (
          <Form.Item>
            <span style={{ fontStyle: 'italic', color: 'gray' }}>
              <strong>Thông tin quan trọng:</strong>
              <br />
              1. Để đăng ký tổ chức phiên đấu giá, bạn cần chuẩn bị trước số tiền tương ứng như sau:
              <br />
              <span style={{ marginLeft: '16px' }}>
                - Phí đăng ký đấu giá: {auctionAmount.auctionFee.toLocaleString()} VND.
              </span>
              <br />
              <span style={{ marginLeft: '16px' }}>
                - Số tiền cọc trước: {auctionAmount.depositFee * 100}% tương ứng với giá khởi điểm hoặc giá cố định.
              </span>
              <br />
              2. Tiền cọc sẽ được hoàn trả sau khi phiên đấu giá kết thúc.
              <br />
              3. Yêu cầu tham gia đấu giá sẽ được gửi đến hệ thống để chờ phê duyệt.
              <br />
              4. Trong trường hợp xảy ra sự cố, quyết định của hệ thống sẽ là quyết định cuối cùng.
              <br />
              5. Vui lòng đọc kỹ các quy định để đảm bảo tuân thủ và tránh các tình huống không mong muốn xảy ra.
            </span>
          </Form.Item>
        )}
        <Form.Item
          label="Phương thức đấu giá"
          name="auctionMethod"
          rules={[{ required: true, message: 'Vui lòng chọn phương thức đấu giá!' }]}
          initialValue={auctionMethod}
        >
          <Select
            placeholder="Chọn phương thức đấu giá"
            onChange={(value) => {
              setAuctionMethod(value);
              console.log('Auction Method:', value);
            }}
            disabled={mode === 'update'}
          >
            <Option value="Ascending">Trả giá lên</Option>
            <Option value="Descending">Đặt giá xuống</Option>
            <Option value="Fixed-price">Bán với giá xác định</Option>
            <Option value="First-come">Bỏ giá một lần</Option>
          </Select>
        </Form.Item>

        {formVisibleConfig.startingPrice && (
          <Form.Item
            label="Giá khởi điểm"
            name="startingPrice"
            rules={[{ required: true, message: 'Vui lòng nhập giá khởi điểm!' }]}
          >
            <Input type="number" placeholder="Nhập giá khởi điểm" onChange={() => calculateDesc()} />
          </Form.Item>
        )}

        {formVisibleConfig.buyoutPrice && (
          <Form.Item
            label={
              auctionMethod === 'Descending' ? (
                <span style={{ fontStyle: 'italic' }}>{'Giá cuối (Mức giá thấp nhất mà người mua có thể mua)'}</span>
              ) : (
                'Giá mua ngay'
              )
            }
            name="buyoutPrice"
            rules={[{ required: true, message: 'Vui lòng nhập giá mua ngay!' }]}
          >
            <Input
              type="number"
              placeholder={auctionMethod !== 'Descending' ? 'Nhập giá mua ngay' : '0'}
              disabled={auctionMethod === 'Descending'}
            />
          </Form.Item>
        )}

        {formVisibleConfig.bidStep && (
          <Form.Item label="Bước giá" name="bidStep" rules={[{ required: true, message: 'Vui lòng nhập bước giá!' }]}>
            <Input type="number" placeholder="Nhập bước giá" onChange={() => calculateDesc()} />
          </Form.Item>
        )}

        {formVisibleConfig.reductionStep && (
          <Form.Item
            label="Số lần giảm giá"
            name="reductionStep"
            rules={[{ required: true, message: 'Vui lòng nhập số lần giảm giá!' }]}
          >
            <InputNumber
              placeholder="Nhập số lần giảm giá"
              type="number"
              step={1}
              min={1}
              style={{ width: '100%' }}
              onChange={() => calculateDesc()}
            />
          </Form.Item>
        )}

        {formVisibleConfig.bidderDeposit && (
          <Form.Item
            label="Số tiền người mua cọc"
            name="bidderDeposit"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền cọc!' }]}
          >
            <Input type="number" placeholder="Yêu cầu người tham gia cọc trước..." />
          </Form.Item>
        )}

        <Form.Item
          label="Chọn cá Koi"
          name="koiIds"
          rules={[{ required: true, message: 'Vui lòng thêm ít nhất một con cá!' }]}
        >
          <Select
            placeholder="Chọn cá Koi để thêm vào phiên đấu giá"
            style={{ width: '100%' }}
            mode="multiple"
            allowClear
          >
            {koiActiveList.map((koi) => (
              <Option key={koi.id} value={koi.id}>
                {`ID: ${koi.id} - ${koi.name}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name="startTime"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
        >
          <DatePicker style={{ width: '100%' }} showTime onChange={() => calculateDesc()} />
        </Form.Item>

        {formVisibleConfig.durationStep && (
          <Form.Item label="Thời gian giữa mỗi lần giảm giá" required>
            <Input.Group compact>
              <Form.Item name="durationUnit" noStyle initialValue="hours">
                <Select
                  style={{ width: '32%' }}
                  onChange={() => {
                    form.setFieldsValue({ durationStepInput: 0 });
                  }}
                >
                  <Select.Option key="days" value="days">
                    Ngày
                  </Select.Option>
                  <Select.Option key="hours" value="hours">
                    Giờ
                  </Select.Option>
                  <Select.Option key="minutes" value="minutes">
                    Phút
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="durationStepInput"
                noStyle
                rules={[{ required: true, message: 'Vui lòng nhập số khoảng thời gian!' }]}
              >
                <InputNumber min={0} placeholder="Nhập số" style={{ width: '68%' }} onChange={() => calculateDesc()} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        )}

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
            disabled={formVisibleConfig.durationStep}
          />
        </Form.Item>
      </Form>
      <Modal
        title={'Xác nhận gửi yêu cầu'}
        open={modalOpen}
        onOk={() => onCreate(modalValues)}
        onCancel={() => setModalOpen(false)}
      >
        <br />
        <span>Số tiền cọc sẽ được trừ thẳng vào ví của bạn</span>
      </Modal>
    </Drawer>
  );
};

export default AuctionForm;
