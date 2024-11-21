import React from 'react';
import { Tag, Flex, Image } from 'antd';
import moment from 'moment';
import fallback from '../../assets/images/auction-image-df.jpg';

function Cover({ status, startTime, imageSrc }) {
  const time = startTime ? moment(startTime).format('DD/MM/YYYY HH:mm:ss') : '...';

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: 3 / 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Image
        src={imageSrc}
        width={'100%'}
        alt="Cuộc đấu giá"
        fallback={fallback}
        preview={false}
        style={{
          width: '100%',
          height: '100%',
          minWidth: '100%',
          objectFit: 'cover',
          transition: 'transform 1s ease-in-out',
        }}
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
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            fontSize: '1rem',
          }}
        >
          {status === 'Scheduled' ? time : status === 'Ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
        </Tag>
      </Flex>
    </div>
  );
}

export default Cover;
