import React from 'react';
import { Typography, Layout, Space, Card, Row, Col, List } from 'antd';
import { TeamOutlined, SafetyOutlined, TrophyOutlined, GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function AboutPage() {
  const { t } = useTranslation();
  const features = [
    {
      icon: <SafetyOutlined style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />,
      title: t('page.about.features.security_trust_title'),
      description: t('page.about.features.security_trust_description'),
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />,
      title: t('page.about.features.top_quality_title'),
      description: t('page.about.features.top_quality_description'),
    },
    {
      icon: <TeamOutlined style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />,
      title: t('page.about.features.vibrant_community_title'),
      description: t('page.about.features.vibrant_community_description'),
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />,
      title: t('page.about.features.global_access_title'),
      description: t('page.about.features.global_access_description'),
    },
  ];

  return (
    <Layout style={{ backgroundColor: 'transparent' }}>
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1} style={{ color: 'var(--primary-color)', textAlign: 'center' }}>
            {t('page.about.page_title')}
          </Title>

          <div>
            <Paragraph style={{ fontSize: '16px', textAlign: 'justify' }}>
              {t('page.about.intro_paragraph_1')}
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', textAlign: 'justify' }}>
              {t('page.about.intro_paragraph_2')}
            </Paragraph>
          </div>

          <Title level={2} style={{ textAlign: 'center' }}>
            {t('page.about.why_choose_us_title')}
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
            <Title level={3}>{t('page.about.commitment_title')}</Title>
            <List
              dataSource={[
                t('page.about.commitments.authentic_quality'),
                t('page.about.commitments.transparent_info'),
                t('page.about.commitments.customer_support'),
                t('page.about.commitments.platform_update'),
                t('page.about.commitments.healthy_community'),
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
            {t('page.about.join_us_cta')}
          </Paragraph>
        </Space>
      </Content>
    </Layout>
  );
}

export default AboutPage;
