import React, { useState } from 'react';
import { Input, Button, Avatar } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import styles from './ChatBox.module.scss';

export default function ChatBox({ contact, onClose }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log(`Sending message to ${contact.name}: ${message}`);
      setMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Avatar src={contact.avatar} />
          <span className={styles.contactName}>{contact.name}</span>
        </div>
        <Button type="text" icon={<CloseOutlined />} onClick={onClose} className={styles.closeButton} />
      </div>
      <div className={styles.chatMessages}>{/* Chat messages sẽ nằm ở đây */}</div>
      <div className={styles.inputContainer}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Type a message..."
          className={styles.input}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} className={styles.sendButton} />
      </div>
    </div>
  );
}
