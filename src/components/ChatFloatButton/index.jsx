import React, { useState, useEffect, useRef } from 'react';
import { FloatButton, Drawer, List, Avatar, Input, Button, Empty, App, Divider, Spin } from 'antd';
import WebSocketService from '../../services/WebSocketService';
import { MessageOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import api from '../../configs';

function ChatFloatButton() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [contacts, setContacts] = useState([{ id: 1, fullName: 'Quản trị viên', role: 'Admin' }]);
  const [pagination, setPagination] = useState({ current: 0, totalPages: 0 });
  const [contactLoading, setContactLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [fetch, setFetch] = useState(false);

  //webSocket
  useEffect(() => {
    const token = user?.token;
    const displayChatMessage = (chatMessage) => {
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
      setHasNewMessage(true);
    };

    if (user && selectedContact) {
      WebSocketService.connectToChatService(token, user?.user?.userId, selectedContact?.userId, displayChatMessage);
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [user, selectedContact]);

  useEffect(() => {
    if (hasNewMessage) {
      lastMessageRef?.current?.scrollIntoView({ behavior: 'smooth' });
      setHasNewMessage(false);
    }
  }, [hasNewMessage]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setContactLoading(true);
        const response1 = await api.get(`/chat/systemchat`, {
          requiresAuth: true,
          onUnauthorizedCallback: () => {
            navigate('/login');
          },
        });
        const response2 = await api.get(`/chat/userchat?userId=${user.user.userId}`, {
          requiresAuth: true,
          onUnauthorizedCallback: () => {
            navigate('/login');
          },
        });
        setContacts([...response1.data, ...response2.data.map((contact) => ({ ...contact, role: 'contact' }))]);
      } catch (error) {
        message.error('Lỗi khi tải danh sách liên hệ!');
        console.error('Failed to fetch contacts:', error);
      } finally {
        setContactLoading(false);
      }
    };
    if (user?.user) {
      fetchContacts();
    }
  }, [user, fetch]);

  const fetchMessages = async (page) => {
    if (selectedContact) {
      try {
        setMessageLoading(true);
        const response = await api.get(`/chat/messages?receiverId=${selectedContact.userId}&page=${page}`, {
          requiresAuth: true,
        });
        if (page === 0) {
          setMessages(response.data.content);
        } else {
          setMessages((prevMessages) => [...prevMessages, ...response.data.content]);
        }
        setPagination({ current: response.data?.number || 0, totalPages: response.data?.totalPages });
      } catch (error) {
        message.error('Lỗi khi tải tin nhắn!');
        console.error('Failed to fetch messages:', error);
      } finally {
        setMessageLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMessages(0);
    setHasNewMessage(true);
  }, [selectedContact]);

  // useEffect(() => {
  //   if (messagesContainerRef.current) {
  //     const container = messagesContainerRef.current;
  //     const previousScrollHeight = container.scrollHeight;

  //     fetchMessages(pagination.current + 1).then(() => {
  //       // Giữ nguyên vị trí cuộn sau khi thêm tin nhắn
  //       container.scrollTop = container.scrollHeight - previousScrollHeight;
  //     });
  //   }
  // }, [messages]); // Gọi khi `messages` được cập nhật

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop } = messagesContainerRef.current;
        if (scrollTop === 0 && pagination.current < pagination.totalPages - 1) {
          fetchMessages(pagination.current + 1);
        }
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [messagesContainerRef]);

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

  if (!user?.user) return null;

  return (
    <>
      <FloatButton icon={<MessageOutlined />} onClick={() => setIsDrawerOpen(true)} style={{ bottom: 80, right: 30 }} />
      <Drawer
        title="Chat"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={700}
        afterOpenChange={() => setFetch(!fetch)}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          {/* Contact List */}
          <div style={{ width: '36%', borderRight: '1px solid #f0f0f0', overflowY: 'auto', paddingRight: '10px' }}>
            <Spin spinning={contactLoading}>
              <List
                itemLayout="horizontal"
                dataSource={contacts}
                renderItem={(contact) => (
                  <List.Item onClick={() => setSelectedContact(contact)} style={{ cursor: 'pointer' }}>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={contact.fullName}
                      description={
                        contact.role === 'Admin'
                          ? 'Quản trị viên'
                          : contact.role === 'Staff'
                          ? 'Nhân viên hệ thống'
                          : contact.role === 'Breeder'
                          ? 'Người bán hàng'
                          : contact.role === 'User'
                          ? 'Người dùng KoiAuction'
                          : 'Liên hệ gần đây'
                      }
                    />
                  </List.Item>
                )}
              />
            </Spin>
          </div>

          {/* Chat Box */}
          <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
            {selectedContact ? (
              <>
                <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{selectedContact.fullName}</span>
                </div>
                <div ref={messagesContainerRef} style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
                  <Spin spinning={messageLoading}>
                    {pagination?.current === pagination?.totalPages - 1 && (
                      <Divider orientation="center">
                        <p style={{ fontSize: '14px' }}>Đã xem hết tin nhắn</p>
                      </Divider>
                    )}
                    {messages.map((message, index) => (
                      <>
                        {index === 0 ||
                        (messages[index].datetime &&
                          moment.utc(messages[index].datetime).local().format('DD/MM/YYYY') !==
                            moment
                              .utc(messages[index - 1].datetime)
                              .local()
                              .format('DD/MM/YYYY')) ? (
                          <Divider orientation="center">
                            <p style={{ fontSize: '14px' }}>
                              {moment.utc(message.datetime).local().format('DD/MM/YYYY')}
                            </p>
                          </Divider>
                        ) : null}
                        <div
                          ref={message === messages[messages.length - 1] ? lastMessageRef : null}
                          key={message.chatId}
                          style={{
                            marginBottom: '10px',
                            textAlign: message.senderId === user?.user.userId ? 'right' : 'left',
                          }}
                        >
                          <div
                            style={{
                              background: message.senderId === user?.user.userId ? '#d4163c' : '#f0f0f0',
                              color: message.senderId === user?.user.userId ? 'white' : 'black',
                              padding: '8px 12px',
                              borderRadius: '16px',
                              display: 'inline-block',
                              maxWidth: '70%',
                            }}
                          >
                            {message.message}
                            <br />
                            {(index === messages.length - 1 ||
                              messages[index].senderId !== messages[index + 1].senderId) && (
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: message.senderId === user?.user.userId ? '#dbd5d5' : '#888',
                                  marginTop: '4px',
                                }}
                              >
                                {message.datetime ? moment.utc(message.datetime).local().format('HH:mm') : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ))}
                    {messages.length === 0 && <Empty description="Chưa có tin nhắn" style={{ marginTop: 50 }} />}
                  </Spin>
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
