import React from 'react';
import { List, Avatar, Badge } from 'antd';
import styles from './ContactList.module.scss';

export default function ContactList({ contacts, onContactClick }) {
  return (
    <div className={styles.container}>
      <List
        itemLayout="horizontal"
        dataSource={contacts}
        renderItem={(contact) => (
          <List.Item onClick={() => onContactClick(contact.id)} className={styles.listItem}>
            <List.Item.Meta
              avatar={<Avatar src={contact.avatar} />}
              title={<span>{contact.name}</span>}
              description={contact.lastMessage}
            />
            {contact.unreadCount > 0 && <Badge count={contact.unreadCount} />}
          </List.Item>
        )}
      />
    </div>
  );
}
