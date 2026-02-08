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
  Input,
  Tag,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PaymentModal = ({ visible, onClose, onSave }) => {
  const [paymentType, setPaymentType] = useState('in');
  const [amount, setAmount] = useState('');
  const [selectedHint, setSelectedHint] = useState('');

  // Quick payment hints
  const paymentHints = [
    'BC',
    'Electricity',
    'Rent',
    'Salary',
    'Supplies',
    'Maintenance',
    
  ];

  // Handle calculator button click
  const handleCalculatorClick = (value) => {
    if (value === 'C') {
      setAmount('');
    } else if (value === '⌫') {
      setAmount(amount.length > 0 ? amount.slice(0, -1) : '');
    } else {
      setAmount(amount + value);
    }
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Handle hint selection
  const handleHintClick = (hint) => {
    setSelectedHint(hint);
  };

  // Handle Save
  const handleSave = () => {
    const amountValue = parseFloat(amount) || 0;
    
    if (amountValue <= 0) {
      message.warning('Please enter a valid amount!');
      return;
    }

    if (!selectedHint) {
      message.warning('Please select a payment category!');
      return;
    }

    const paymentData = {
      type: paymentType,
      amount: amountValue,
      category: selectedHint,
      timestamp: new Date().toISOString(),
    };

    console.log('Payment Data:', paymentData);
    
    if (onSave) {
      onSave(paymentData);
    }

    message.success(`Payment ${paymentType === 'in' ? 'In' : 'Out'}: Rs. ${amountValue} (${selectedHint}) saved successfully!`);
    
    // Reset form
    setPaymentType('in');
    setAmount('');
    setSelectedHint('');
    onClose();
  };

  // Handle Modal Close
  const handleClose = () => {
    setPaymentType('in');
    setAmount('');
    setSelectedHint('');
    onClose();
  };

  return (
    <Modal
      title="Payment"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={320}
      centered
      maskClosable={true}
    >
      <Space direction="vertical" size={10} style={{ width: '100%' }}>
        {/* Radio Buttons - In/Out */}
        <Card 
          bordered={false} 
          bodyStyle={{ padding: 8 }}
          style={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 6,
          }}
        >
          <Radio.Group
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            style={{ width: '100%' }}
          >
            <Row gutter={6}>
              <Col span={12}>
                <Radio.Button
                  value="in"
                  style={{
                    width: '100%',
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
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
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
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

        {/* Amount Input Field */}
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <Card
            bordered={false}
            bodyStyle={{ padding: 0 }}
          >
            <Input
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              prefix={<Text strong style={{ color: paymentType === 'in' ? '#52c41a' : '#ff4d4f', fontSize: 14 }}>Rs.</Text>}
              style={{
                background: paymentType === 'in' ? '#f6ffed' : '#fff2f0',
                border: `2px solid ${paymentType === 'in' ? '#52c41a' : '#ff4d4f'}`,
                padding: '6px 10px',
                borderRadius: 6,
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'monospace',
                color: paymentType === 'in' ? '#52c41a' : '#ff4d4f',
                minHeight: 36,
              }}
              autoFocus
            />
          </Card>

          {/* Payment Category Hints - One Line */}
          <Flex wrap="wrap" gap={4} style={{ paddingLeft: 2 }}>
            {paymentHints.map((hint) => (
              <Tag
                key={hint}
                color={selectedHint === hint ? (paymentType === 'in' ? 'green' : 'red') : 'default'}
                style={{
                  cursor: 'pointer',
                  fontSize: 9,
                  padding: '1px 5px',
                  margin: 0,
                  borderRadius: 6,
                  fontWeight: selectedHint === hint ? 'bold' : 'normal',
                }}
                onClick={() => handleHintClick(hint)}
              >
                {hint}
              </Tag>
            ))}
          </Flex>
        </Space>

        {/* Calculator */}
        <Card
          bordered={false}
          bodyStyle={{ padding: 4 }}
          style={{
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 6,
          }}
        >
          <Row gutter={[3, 3]}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
              <Col span={8} key={btn}>
                <Button
                  block
                  size="small"
                  onClick={() => handleCalculatorClick(btn)}
                  style={{
                    height: 30,
                    fontSize: 13,
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
          size="middle"
          icon={<SaveOutlined />}
          onClick={handleSave}
          style={{
            height: 36,
            fontSize: 13,
            fontWeight: 'bold',
            background: '#1890ff',
            borderColor: '#1890ff',
          }}
        >
          Save {selectedHint && `- ${selectedHint}`}
        </Button>
      </Space>
    </Modal>
  );
};

export default PaymentModal;