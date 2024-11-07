import React, { useEffect, useState } from 'react';
import { Input, Avatar, Carousel } from 'antd';
import UserPopover from '../../components/Popover/UserPopover';
import PostModal from '../../components/Modal/PostModal';
import styles from './index.module.scss';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost:4000/blogs');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch blog posts', error);
      }
    };

    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:4000/contacts');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setContacts(data);
      } catch (error) {
        console.error('Failed to fetch contacts', error);
      }
    };

    fetchBlogs();
    fetchContacts();
  }, []);

  const handlePostSubmit = () => {
    if (text || images.length) {
      const newPost = {
        userId: '18',
        content: text,
        images: images.map((file) => ({
          url: URL.createObjectURL(file.originFileObj),
        })),
      };
      setPosts([newPost, ...posts]);
      setText('');
      setImages([]);
      setIsModalVisible(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.contactList}>
        <h3 className={styles.title}>List of Breeders</h3>
        <ul>
          {contacts.map((contact) => (
            <li className={styles.listItem} key={contact.id}>
              <Avatar className={styles.postAvt} />
              {contact.name}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.blogContent}>
        <div className={styles.postForm}>
          <Avatar size={'large'} className={styles.postAvt} />
          <Input placeholder="Enter anything . . ." onClick={showModal} readOnly />
        </div>

        <div className={styles.postList}>
          {posts.map((post) => (
            <div key={post.id} className={styles.blogPost}>
              <div>
                <UserPopover userId={post.userId}>
                  <Avatar size={'large'} className={styles.avtPopover} />
                  <b className={styles.name}>Nguyen Van A</b>
                </UserPopover>
              </div>
              <div className={styles.content}>
                <p className={styles.text}>
                  {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                </p>
                <Carousel>
                  {post.images.map((img, idx) => (
                    <img key={idx} src={img.url} alt={`Post ${idx}`} className={styles.image} />
                  ))}
                </Carousel>
              </div>
            </div>
          ))}
        </div>

        <PostModal
          visible={isModalVisible}
          onClose={handleModalClose}
          onSubmit={handlePostSubmit}
          text={text}
          setText={setText}
          images={images}
          setImages={setImages}
        />
      </div>
    </div>
  );
};

export default Blog;
