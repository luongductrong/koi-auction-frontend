import React, { useState } from 'react';
import { FloatButton } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import ContactList from './ContactList';
import ChatBox from './ChatBox';
import styles from './index.module.scss';

function ChatFloatButton() {
  const [isContactListOpen, setIsContactListOpen] = useState(false);
  const [openChats, setOpenChats] = useState([]);
  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Hello!', unreadCount: 2 },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'How are you?',
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'See you later!',
      unreadCount: 1,
    },
  ]);

  const toggleContactList = () => {
    setIsContactListOpen(!isContactListOpen);
  };

  const openChat = (contactId) => {
    if (!openChats.includes(contactId)) {
      setOpenChats([...openChats, contactId]);
    }
  };

  const closeChat = (contactId) => {
    setOpenChats(openChats.filter((id) => id !== contactId));
  };

  const totalUnreadCount = contacts.reduce((sum, contact) => sum + contact.unreadCount, 0);

  return (
    <div className={styles.fixedContainer}>
      <FloatButton
        className={styles.floatButton}
        icon={<MessageOutlined />}
        badge={{ count: totalUnreadCount, overflowCount: 99 }}
        onClick={toggleContactList}
      />
      {isContactListOpen && <ContactList contacts={contacts} onContactClick={openChat} />}
      {openChats.map((contactId) => (
        <ChatBox
          key={contactId}
          contact={contacts.find((c) => c.id === contactId) || {}}
          onClose={() => closeChat(contactId)}
        />
      ))}
    </div>
  );
}

export default ChatFloatButton;
