import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Typography, Tabs, Card, Collapse } from 'antd';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

function Policy() {
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(tab === 'privacy' ? '2' : tab === 'refund' ? '3' : '1');

  console.log('Policy render');

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab === 'privacy') {
      setActiveTab('2');
    } else if (tab === 'refund') {
      setActiveTab('3');
    } else {
      setActiveTab('1');
    }
  }, [location.search]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    const url = `/policy?tab=${key === '2' ? 'privacy' : key === '3' ? 'refund' : 'terms'}`;
    console.log('URL:', url);
    window.history.pushState({}, '', url);
  };

  return (
    <Layout>
      <Content style={{ padding: '50px 50px', backgroundColor: '#fff' }}>
        <Title level={1} style={{ color: '#c41e3a', textAlign: 'center', marginBottom: '2rem' }}>
          Chính sách của KOIAUCTION
        </Title>
        <Card>
          <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
            <TabPane tab="Điều Khoản Dịch Vụ" key="1">
              <Collapse ghost>
                <Panel header="1. Giới thiệu" key="1">
                  <Paragraph>
                    Chào mừng bạn đến với KOIAUCTION.
                    <br />
                    Bằng cách truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các
                    điều khoản và điều kiện sau đây.
                  </Paragraph>
                </Panel>
                <Panel header="2. Đăng ký tài khoản" key="2">
                  <Paragraph>
                    - Để tham gia đấu giá trên KOIAUCTION, bạn cần đăng ký tài khoản.
                    <br />
                    - Bạn phải cung cấp thông tin chính xác và cập nhật.
                    <br />- Bạn có trách nhiệm duy trì bảo mật tài khoản của mình.
                  </Paragraph>
                </Panel>
                <Panel header="3. Quy tắc đấu giá" key="3">
                  <Paragraph>
                    - Tất cả các cuộc đấu giá đều có thời gian cụ thể.
                    <br />
                    - Giá khởi điểm và bước giá của mỗi cuộc đấu giá sẽ được công khai rõ ràng.
                    <br />
                    - Đối với phương thức trả giá lên: người thắng cuộc là người đưa ra mức giá cao nhất tại thời điểm
                    kết thúc.
                    <br />
                    - Đối với phương thức đặt giá xuống: người thắng cuộc là người đầu tiên chấp nhận mức giá khởi điểm
                    hoặc giá đã giảm.
                    <br />
                    - Đối với phương thức bán với giá xác định: người thắng cuộc là người chấp nhận mức giá niêm yết;
                    nếu có nhiều người cùng muốn mua, hệ thống sẽ tiến hành bốc thăm ngẫu nhiên.
                    <br />- Đối với phương thức bỏ giá một lần: người thắng cuộc là người đưa ra mức giá cao nhất tại
                    thời điểm kết thúc.
                  </Paragraph>
                </Panel>
                <Panel header="4. Trách nhiệm của người bán" key="4">
                  <Paragraph>
                    - Người bán phải cung cấp thông tin chính xác về cá Koi, bao gồm hình ảnh, kích thước, và lịch sử.
                    <br />- Việc giao hàng phải được thực hiện trong thời gian đã thỏa thuận.
                  </Paragraph>
                </Panel>
                <Panel header="5. Quyền của KOIAUCTION" key="5">
                  <Paragraph>
                    KOIAUCTION có quyền từ chối hoặc hủy bỏ bất kỳ giao dịch nào nếu nghi ngờ có gian lận hoặc vi phạm
                    điều khoản dịch vụ.
                  </Paragraph>
                </Panel>
              </Collapse>
            </TabPane>
            <TabPane tab="Chính Sách Bảo Mật" key="2">
              <Collapse ghost>
                <Panel header="1. Thu thập thông tin" key="1">
                  <Paragraph>
                    Chúng tôi thu thập thông tin cá nhân như tên, địa chỉ email, số điện thoại khi bạn đăng ký tài khoản
                    hoặc tham gia đấu giá.
                  </Paragraph>
                </Panel>
                <Panel header="2. Sử dụng thông tin" key="2">
                  <Paragraph>
                    Thông tin của bạn được sử dụng để quản lý tài khoản, xử lý giao dịch, và cải thiện dịch vụ của chúng
                    tôi. <br />
                    Chúng tôi không bán hoặc chia sẻ thông tin cá nhân với bên thứ ba.
                  </Paragraph>
                </Panel>
                <Panel header="3. Bảo mật thông tin" key="3">
                  <Paragraph>
                    Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn khỏi truy cập trái
                    phép, thay đổi, tiết lộ hoặc phá hủy.
                  </Paragraph>
                </Panel>
                <Panel header="4. Quyền của người dùng" key="4">
                  <Paragraph>
                    Bạn có quyền yêu cầu truy cập, sửa đổi thông tin cá nhân của mình bất kỳ lúc nào.
                  </Paragraph>
                </Panel>
              </Collapse>
            </TabPane>
            <TabPane tab="Chính Sách Hoàn Tiền" key="3">
              <Collapse ghost>
                <Panel header="1. Điều kiện hoàn tiền" key="1">
                  <Paragraph>
                    - Cá Koi không khớp với mô tả hoặc hình ảnh đăng tải.
                    <br /> - Cá Koi bị tổn thương hoặc chết trong quá trình vận chuyển.
                    <br /> - Giao dịch bị hủy bởi người bán.
                  </Paragraph>
                </Panel>
                <Panel header="2. Thời hạn yêu cầu hoàn tiền" key="2">
                  <Paragraph>Yêu cầu hoàn tiền phải được gửi trong vòng 48 giờ kể từ khi nhận được cá Koi.</Paragraph>
                </Panel>
                <Panel header="3. Quy trình hoàn tiền" key="3">
                  <Paragraph>
                    1. Gửi yêu cầu hoàn tiền qua trang hỗ trợ của KOIAUCTION.
                    <br /> 2. Cung cấp bằng chứng và lý do chi tiết cho yêu cầu. <br /> 3. Đội ngũ hỗ trợ sẽ xem xét yêu
                    cầu trong vòng 3 ngày làm việc. <br /> 4. Nếu được chấp thuận, tiền sẽ được hoàn trả trong vòng 5-10
                    ngày làm việc.
                  </Paragraph>
                </Panel>
                <Panel header="4. Phí hoàn trả" key="4">
                  <Paragraph>
                    KOIAUCTION không tính phí xử lý hoàn tiền. Tuy nhiên, phí vận chuyển có thể không được hoàn lại
                    trong một số trường hợp.
                  </Paragraph>
                </Panel>
                <Panel header="5. Trường hợp không được hoàn tiền" key="5">
                  <Paragraph>
                    - Yêu cầu hoàn tiền sau thời hạn quy định. <br /> - Cá Koi đã được sử dụng hoặc thay đổi sau khi
                    nhận.
                    <br /> - Người mua không tuân thủ hướng dẫn chăm sóc cá Koi.
                  </Paragraph>
                </Panel>
              </Collapse>
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}

export default Policy;
