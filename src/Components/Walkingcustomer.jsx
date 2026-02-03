import React, { useState, useEffect } from 'react';
import {
  Modal,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  InputNumber,
  message,
  Divider,
  Statistic,
} from 'antd';
import {
  DollarOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const WalkingCustomer = ({ visible, onClose, orderTotal, onPaymentComplete }) => {
  const [cashReceived, setCashReceived] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Set cash received to order total when modal opens
  useEffect(() => {
    if (visible) {
      setCashReceived(orderTotal);
    }
  }, [visible, orderTotal]);

  const change = cashReceived - orderTotal;

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    if (cashReceived < orderTotal) {
      message.error('Cash received is less than the order total!');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        method: 'cash',
        amount: orderTotal,
        cashReceived: cashReceived,
        change: change,
        timestamp: new Date().toISOString(),
      };

      console.log('Payment completed:', paymentData);
      message.success(`Payment of Rs. ${orderTotal.toFixed(2)} completed successfully!`);
      
      if (onPaymentComplete) {
        onPaymentComplete(paymentData);
      }

      handleClose();
    }, 500);
  };

  // Handle modal close
  const handleClose = () => {
    setCashReceived(0);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      title={
        <Space size={12}>
          <WalletOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>
            Walking Customer Payment
          </Title>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      width={550}
      footer={[
        <Button 
          key="cancel" 
          size="large" 
          onClick={handleClose} 
          icon={<CloseCircleOutlined />}
        >
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          size="large"
          icon={<CheckCircleOutlined />}
          onClick={handleConfirmPayment}
          loading={isProcessing}
          disabled={cashReceived < orderTotal}
          style={{
            background: '#52c41a',
            borderColor: '#52c41a',
          }}
        >
          Complete Payment
        </Button>,
      ]}
      centered
    >
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Order Total */}
        <Card
          style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            border: 'none',
            borderRadius: 8,
          }}
          bodyStyle={{ padding: 20 }}
        >
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
              Total Amount
            </Text>
            <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
              Rs. {orderTotal.toFixed(2)}
            </Title>
          </Space>
        </Card>

        {/* Cash Payment Details */}
        <Card 
          title={
            <Space size={8}>
              <DollarOutlined style={{ fontSize: 18, color: '#52c41a' }} />
              <Text strong style={{ fontSize: 15 }}>Cash Payment</Text>
            </Space>
          }
          style={{ borderRadius: 8 }}
        >
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 14 }}>
                Cash Received
              </Text>
              <InputNumber
                size="large"
                value={cashReceived}
                onChange={(value) => setCashReceived(value || 0)}
                min={0}
                prefix="Rs."
                style={{ width: '100%' }}
                placeholder="Enter cash received"
              />
            </div>

            <Divider style={{ margin: 0 }} />

            {/* Change Calculation */}
            {cashReceived > 0 && (
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Cash Received"
                    value={cashReceived}
                    prefix="Rs."
                    valueStyle={{ color: '#1890ff', fontSize: 20 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Change"
                    value={change}
                    prefix="Rs."
                    valueStyle={{
                      color: change >= 0 ? '#52c41a' : '#ff4d4f',
                      fontSize: 20,
                    }}
                  />
                </Col>
              </Row>
            )}

            {cashReceived > 0 && cashReceived < orderTotal && (
              <Card
                size="small"
                style={{
                  background: '#fff2e8',
                  border: '1px solid #ffbb96',
                  borderRadius: 6,
                }}
                bodyStyle={{ padding: 12 }}
              >
                <Text type="danger" strong>
                  ⚠️ Insufficient cash! Need Rs. {(orderTotal - cashReceived).toFixed(2)} more
                </Text>
              </Card>
            )}
          </Space>
        </Card>
      </Space>
    </Modal>
  );
};

export default WalkingCustomer;