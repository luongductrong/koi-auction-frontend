import React, { useState } from 'react';
import { FloatButton, Popover, Avatar, Form, Input, List, Button, Flex, ConfigProvider } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import Comment from '../../components/Comment';
import { MessageOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

function FloatingMessage({ commentList, onSubmit }) {
  const [comment, setComment] = useState('');
  const handleChange = (e) => {
    setComment(e.target.value);
  };
  const content = (
    <Flex vertical>
      <List
        dataSource={commentList}
        itemLayout="horizontal"
        renderItem={(item) => (
          <li>
            <Comment
              author={item.author}
              avatar={<Avatar icon={<MessageOutlined />} />}
              content={<p>{item.content}</p>}
            />
          </li>
        )}
        className={styles.commentList}
      />
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 10,
            },
          },
        }}
      >
        <Form onFinish={onSubmit} style={{ marginTop: '10px' }}>
          <Form.Item name="comment" style={{ flexGrow: 1 }}>
            <Input.TextArea
              value={comment}
              onChange={handleChange}
              placeholder="Viết bình luận..."
              autoSize={{ minRows: 2, maxRows: 6 }}
              style={{ resize: 'none' }}
            />
          </Form.Item>
          <Form.Item style={{ width: '100%', textAlign: 'right' }}>
            <Button
              htmlType="submit"
              type="primary"
              icon={<SendOutlined />}
              onClick={onSubmit}
              style={{ marginLeft: '8px' }}
            >
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </Flex>
  );

  return (
    <Popover
      content={content}
      title="Bình luận"
      trigger="click"
      placement="topRight"
      overlayStyle={{ minWidth: 500, maxWidth: '50vw' }}
    >
      <FloatButton
        className={styles.floatingButton}
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        badge={{
          count: 5,
        }}
      />
    </Popover>
  );
}

export default FloatingMessage;
