import React, { useState } from 'react';
import {
  Modal,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Flex,
  Typography,
  Space,
  message,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PaymentModal = ({ visible, onClose, onSave }) => {
  const [paymentType, setPaymentType] = useState('in');
  const [amount, setAmount] = useState('0');

  // Handle calculator button click
  const handleCalculatorClick = (value) => {
    if (value === 'C') {
      setAmount('0');
    } else if (value === '⌫') {
      setAmount(amount.length > 1 ? amount.slice(0, -1) : '0');
    } else {
      setAmount(amount === '0' ? value : amount + value);
    }
  };

  // Handle Save
  const handleSave = () => {
    const amountValue = parseFloat(amount) || 0;
    
    if (amountValue <= 0) {
      message.warning('Please enter a valid amount!');
      return;
    }

    const paymentData = {
      type: paymentType,
      amount: amountValue,
      timestamp: new Date().toISOString(),
    };

    console.log('Payment Data:', paymentData);
    
    if (onSave) {
      onSave(paymentData);
    }

    message.success(`Payment ${paymentType === 'in' ? 'In' : 'Out'}: Rs. ${amountValue} saved successfully!`);
    
    // Reset form
    setPaymentType('in');
    setAmount('0');
    onClose();
  };

  // Handle Modal Close
  const handleClose = () => {
    setPaymentType('in');
    setAmount('0');
    onClose();
  };

  return (
    <Modal
      title="Payment"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={350}
      centered
      maskClosable={true}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {/* Radio Buttons - In/Out */}
        <Card 
          bordered={false} 
          bodyStyle={{ padding: 12 }}
          style={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 8,
          }}
        >
          <Radio.Group
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            style={{ width: '100%' }}
          >
            <Row gutter={8}>
              <Col span={12}>
                <Radio.Button
                  value="in"
                  style={{
                    width: '100%',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 'bold',
                    background: paymentType === 'in' ? '#52c41a' : undefined,
                    borderColor: paymentType === 'in' ? '#52c41a' : undefined,
                    color: paymentType === 'in' ? 'white' : undefined,
                  }}
                >
                  In
                </Radio.Button>
              </Col>
              <Col span={12}>
                <Radio.Button
                  value="out"
                  style={{
                    width: '100%',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 'bold',
                    background: paymentType === 'out' ? '#ff4d4f' : undefined,
                    borderColor: paymentType === 'out' ? '#ff4d4f' : undefined,
                    color: paymentType === 'out' ? 'white' : undefined,
                  }}
                >
                  Out
                </Radio.Button>
              </Col>
            </Row>
          </Radio.Group>
        </Card>

        {/* Amount Display */}
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <Flex
            align="center"
            justify="flex-end"
            style={{
              background: paymentType === 'in' ? '#f6ffed' : '#fff2f0',
              border: `2px solid ${paymentType === 'in' ? '#52c41a' : '#ff4d4f'}`,
              padding: 10,
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'monospace',
              color: paymentType === 'in' ? '#52c41a' : '#ff4d4f',
              minHeight: 45,
            }}
          >
            Rs. {amount}
          </Flex>
        </Card>

        {/* Calculator */}
        <Card
          bordered={false}
          bodyStyle={{ padding: 6 }}
          style={{
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 8,
          }}
        >
          <Row gutter={[4, 4]}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
              <Col span={8} key={btn}>
                <Button
                  block
                  size="middle"
                  onClick={() => handleCalculatorClick(btn)}
                  style={{
                    height: 38,
                    fontSize: 16,
                    fontWeight: 'bold',
                    background: btn === 'C' ? '#ff4d4f' : btn === '⌫' ? '#faad14' : undefined,
                    borderColor: btn === 'C' ? '#ff4d4f' : btn === '⌫' ? '#faad14' : undefined,
                    color: btn === 'C' || btn === '⌫' ? 'white' : undefined,
                  }}
                >
                  {btn}
                </Button>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Save Button */}
        <Button
          type="primary"
          block
          size="large"
          icon={<SaveOutlined />}
          onClick={handleSave}
          style={{
            height: 40,
            fontSize: 14,
            fontWeight: 'bold',
            background: '#1890ff',
            borderColor: '#1890ff',
          }}
        >
          Save Payment
        </Button>
      </Space>
    </Modal>
  );
};

export default PaymentModal;