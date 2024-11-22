import React, { useState, useEffect } from 'react';
import { FloatButton, Drawer, List, Avatar, Input, Button, Empty, App } from 'antd';
import { MessageOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import api from '../../configs';

function ChatFloatButton() {
  const user = useSelector((state) => state.user.user);
  const { message } = App.useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([{ id: 1, fullName: 'Quản trị viên hệ thống' }]);
  const [pagination, setPagination] = useState({ current: 0, pageSize: 0 });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response1 = await api.get(`/chat/systemchat`, { requiresAuth: true });
        const response2 = await api.get(`/chat/userchat?userId=${user.userId}`, { requiresAuth: true });
        setContacts([...response1.data, ...response2.data]);
      } catch (error) {
        message.error('Lỗi khi tải danh sách liên hệ!');
        console.error('Failed to fetch contacts:', error);
      }
    };
    if (user) {
      fetchContacts();
    }
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedContact) {
        try {
          const response = await api.get(
            `/chat/messages?receiverId=${selectedContact.userId}&page=${pagination.current}`,
            {
              requiresAuth: true,
            },
          );
          setMessages(response.data.content);
        } catch (error) {
          message.error('Lỗi khi tải tin nhắn!');
          console.error('Failed to fetch messages:', error);
        }
      }
    };
    fetchMessages();
  }, [selectedContact]);

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedContact) {
      try {
        await api.post('/chat', { receiverId: selectedContact.userId, message: messageInput }, { requiresAuth: true });
        setMessageInput('');
      } catch (error) {
        message.error('Lỗi khi gửi tin nhắn!');
        console.error('Failed to send message:', error);
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <FloatButton icon={<MessageOutlined />} onClick={() => setIsDrawerOpen(true)} style={{ bottom: 80, right: 30 }} />
      <Drawer title="Chat" placement="right" onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen} width={700}>
        <div style={{ display: 'flex', height: '100%' }}>
          {/* Contact List */}
          <div style={{ width: '30%', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
            <List
              itemLayout="horizontal"
              dataSource={contacts}
              renderItem={(contact) => (
                <List.Item onClick={() => setSelectedContact(contact)} style={{ cursor: 'pointer' }}>
                  <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={contact.fullName} />
                </List.Item>
              )}
            />
          </div>

          {/* Chat Box */}
          <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
            {selectedContact ? (
              <>
                <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{selectedContact.fullName}</span>
                </div>
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
                  {messages.map((message) => (
                    <div
                      key={message.chatId}
                      style={{
                        marginBottom: '10px',
                        textAlign: message.senderId === user?.userId ? 'right' : 'left',
                      }}
                    >
                      <div
                        style={{
                          background: message.senderId === user?.userId ? '#1890ff' : '#f0f0f0',
                          color: message.senderId === user?.userId ? 'white' : 'black',
                          padding: '8px 12px',
                          borderRadius: '16px',
                          display: 'inline-block',
                          maxWidth: '70%',
                        }}
                      >
                        {message.message}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        {message.datetime ? moment(message.datetime).format('DD/MM/YYYY HH:mm:ss') : ''}
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && <Empty description="Chưa có tin nhắn" style={{ marginTop: 50 }} />}
                </div>
                <div style={{ padding: '10px', borderTop: '1px solid #f0f0f0', display: 'flex' }}>
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onPressEnter={handleSendMessage}
                    placeholder="Type a message..."
                    style={{ flexGrow: 1, marginRight: '10px' }}
                  />
                  <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} />
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                Chọn một người để bắt đầu trò chuyện
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default ChatFloatButton;
