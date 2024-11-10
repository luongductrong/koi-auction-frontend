import React from 'react';
import { Typography, Layout, Row, Col, Card, Space } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function ContactPage() {
  return (
    <Layout style={{ backgroundColor: 'transparent' }}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1} style={{ color: 'var(--primary-color)', textAlign: 'center' }}>
            Liên Hệ Với KOIAUCTION
          </Title>

          <Row gutter={[32, 32]}>
            <Col span={24}>
              <Card
                title={
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>Thông tin liên hệ</span>
                }
                bordered={false}
              >
                <Space direction="vertical" align="center" size="middle" style={{ width: '100%' }}>
                  <Paragraph>
                    <MailOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    Email: support@example.com
                  </Paragraph>
                  <Paragraph>
                    <PhoneOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    Điện thoại: 0123 456 789
                  </Paragraph>
                  <Paragraph>
                    <EnvironmentOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                  </Paragraph>
                  <Paragraph>
                    <FacebookOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    Facebook: /koiauction
                  </Paragraph>
                  <Paragraph>
                    <InstagramOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                    Instagram: @koiauction
                  </Paragraph>
                </Space>
              </Card>

              <Card
                title={<span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>Trụ sở</span>}
                style={{ marginTop: 16 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.858181237279!2d106.80048060349132!3d10.874984647344146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2zTmjDoCBWxINuIGjDs2EgU2luaCB2acOqbiBUUC5IQ00!5e0!3m2!1svi!2s!4v1731196546563!5m2!1svi!2s"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </Card>
            </Col>

            {/* <Col span={24}>
              <Card
                title={
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                    Để lại đánh giá, nhận xét
                  </span>
                }
                bordered={false}
              >
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSewbH4dHEjraw0HVRSOtnDADzci1X2HsL_rMd4xHv-ml4JyPg/viewform?embedded=true"
                  width="100%"
                  height="1100"
                  frameborder="0"
                  marginheight="0"
                  marginwidth="0"
                >
                  Đang tải…
                </iframe>
              </Card>
            </Col> */}
          </Row>
        </Space>
      </Content>
    </Layout>
  );
}

export default ContactPage;
