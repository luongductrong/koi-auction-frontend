import React from 'react';
import { Tag, Flex } from 'antd';
import moment from 'moment';

function Cover({ status, startTime, imageSrc }) {
  const time = startTime ? moment(startTime).format('DD/MM/YYYY HH:mm:ss') : 'Đang tải...';

  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={imageSrc}
        alt="Cuộc đấu giá"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      />
      <Flex
        style={{
          width: '100%',
          height: '20%',
          position: 'absolute',
          justifyContent: 'center',
          borderRadius: '20px',
          bottom: '20px',
          left: '0',
          zIndex: 1,
        }}
      >
        <Tag
          style={{
            height: '2.4rem',
            lineHeight: '2.4rem',
            textAlign: 'center',
            borderRadius: '20px',
            padding: '0 12px',
            fontSize: '1rem',
          }}
        >
          {status || time || ''}
        </Tag>
      </Flex>
    </div>
  );
}

export default Cover;