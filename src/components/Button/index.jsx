import { Button as AntBtn } from 'antd';
import clsx from 'clsx';
import styles from './index.module.scss';

function Button({ children, style, primary, ghostPrimary }) {
  return (
    <AntBtn
      style={style}
      className={clsx(styles.btn, {
        [styles.btnPrimary]: primary,
        [styles.btnGhostPrimary]: ghostPrimary,
      })}
    >
      {children}
    </AntBtn>
  );
}

export default Button;
