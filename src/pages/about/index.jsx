import React from 'react';
import { Typography, Layout, Space, Card, Row, Col, List } from 'antd';
import { TeamOutlined, SafetyOutlined, TrophyOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function AboutPage() {
  const features = [
    {
      icon: <SafetyOutlined style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />,
      title: 'Bảo mật và Tin cậy',
      description: 'Chúng tôi đảm bảo mọi giao dịch đều an toàn và minh bạch.',
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />,
      title: 'Chất lượng Hàng đầu',
      description: 'Chỉ những con cá Koi chất lượng cao nhất mới được đưa lên đấu giá.',
    },
    {
      icon: <TeamOutlined style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />,
      title: 'Cộng đồng Sôi động',
      description: 'Kết nối với những người yêu thích cá Koi khác trên toàn quốc.',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />,
      title: 'Tiếp cận Toàn cầu',
      description: 'Cơ hội sở hữu những con cá Koi độc đáo từ khắp nơi trên thế giới.',
    },
  ];

  return (
    <Layout style={{ backgroundColor: 'transparent' }}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1} style={{ color: 'var(--primary-color)', textAlign: 'center' }}>
            Về KOIAUCTION
          </Title>

          <div>
            <Paragraph style={{ fontSize: '16px', textAlign: 'justify' }}>
              KOIAUCTION là nền tảng đấu giá trực tuyến hàng đầu dành cho những người yêu thích cá Koi. Chúng tôi ra đời
              với sứ mệnh tạo ra một không gian đấu giá trực tuyến tiện lợi, an toàn và đáng tin cậy cho cộng đồng yêu
              thích cá Koi tại Việt Nam và trên toàn thế giới.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', textAlign: 'justify' }}>
              Dù bạn là người mới bắt đầu tìm hiểu về cá Koi hay đã là một nhà sưu tầm lâu năm, KOIAUCTION cam kết mang
              đến trải nghiệm đấu giá trực tuyến tuyệt vời. Chúng tôi không ngừng nỗ lực để tạo ra một môi trường dễ
              dàng sử dụng, bảo mật cao và thân thiện, nơi mọi người có thể kết nối, giao lưu và tham gia vào những
              phiên đấu giá đầy hứng khởi.
            </Paragraph>
          </div>

          <Title level={2} style={{ textAlign: 'center' }}>
            Tại sao chọn KOIAUCTION?
          </Title>
          <Row gutter={[16, 16]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={<div style={{ padding: '24px', textAlign: 'center' }}>{feature.icon}</div>}
                >
                  <Card.Meta
                    title={<span style={{ color: 'var(--primary-color)' }}>{feature.title}</span>}
                    description={feature.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <Card>
            <Title level={3}>Cam kết của chúng tôi</Title>
            <List
              dataSource={[
                'Đảm bảo tính xác thực và chất lượng của mỗi con cá Koi được đưa lên đấu giá.',
                'Cung cấp thông tin chi tiết và minh bạch về nguồn gốc, lịch sử và đặc điểm của từng con cá.',
                'Hỗ trợ khách hàng 24/7 trong quá trình đấu giá và sau khi giao dịch hoàn tất.',
                'Liên tục cập nhật và cải tiến nền tảng để mang lại trải nghiệm tốt nhất cho người dùng.',
                'Xây dựng một cộng đồng yêu thích cá Koi lành mạnh và phát triển.',
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>
                    <SafetyOutlined style={{ color: 'var(--primary-color)', marginRight: '8px' }} />
                    {item}
                  </Typography.Text>
                </List.Item>
              )}
            />
          </Card>

          <Paragraph
            style={{ fontSize: '20px', textAlign: 'center', color: 'var(--primary-color)', textTransform: 'uppercase' }}
          >
            Hãy tham gia cùng KOIAUCTION ngay hôm nay!
          </Paragraph>
        </Space>
      </Content>
    </Layout>
  );
}

export default AboutPage;
