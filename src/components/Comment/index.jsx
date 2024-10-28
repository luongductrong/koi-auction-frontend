import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Comment = ({ author, content }) => (
  <div style={{ display: 'flex', marginBottom: '16px' }}>
    <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
    <div>
      <div style={{ fontWeight: 'bold' }}>{author}</div>
      <div>{content}</div>
    </div>
  </div>
);

export default Comment;
