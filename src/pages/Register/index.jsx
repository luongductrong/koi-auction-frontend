import React, { useState } from 'react';
import { Button, Form, message, Steps } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../configs';
import styles from './index.module.scss';
import { steps } from './steps';

const { Step } = Steps;

function Register() {
  console.log('Register render');

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const next = (values) => {
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await api.post('/register', formData);
      message.success('Đăng ký thành công!');
      console.log('Register Response:', response.data);
    } catch (error) {
      message.error('Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.');
      console.error('Register Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    if (currentStep === steps.length - 1) {
      setFormData({ ...formData, ...values });
      handleRegister();
    } else {
      next(values);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerForm}>
        <h2 className={styles.registerTitle}>Đăng ký</h2>
        <div className={styles.registerContent}>
          <Form
            name="register"
            onFinish={onFinish}
            initialValues={formData}
            layout="vertical"
            className={styles.formStepContent}
          >
            {steps[currentStep].content}
            <div className={styles.stepActions}>
              {currentStep > 0 && (
                <Button onClick={prev} className={styles.stepActions}>
                  Quay lại
                </Button>
              )}
              <Button type="primary" htmlType="submit" loading={loading}>
                {currentStep === steps.length - 1 ? 'Đăng kí' : 'Tiếp tục'}
              </Button>
            </div>
          </Form>

          <Link to="/login" className={styles.loginLink}>
            Đã có tài khoản? Đăng nhập ngay!
          </Link>
        </div>

        <div>
          <Steps current={currentStep} direction="vertical">
            {steps.map((step) => (
              <Step key={step.title} title={step.title} />
            ))}
          </Steps>
        </div>
      </div>
    </div>
  );
}

export default Register;
