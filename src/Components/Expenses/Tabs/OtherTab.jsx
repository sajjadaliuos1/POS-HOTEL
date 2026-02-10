import React, { useState } from 'react';
import {
  InputNumber,
  Input,
  Button,
  Typography,
  Space,
  message,
} from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

const OtherTab = () => {
  const [othersPayment, setOthersPayment] = useState('');
  const [othersDescription, setOthersDescription] = useState('');

  // Reset Form
  const resetForm = () => {
    setOthersPayment('');
    setOthersDescription('');
  };

  // Handle Save
  const handleSave = () => {
    if (!othersPayment) {
      message.warning('Please enter payment amount!');
      return;
    }

    const othersData = {
      payment: othersPayment,
      description: othersDescription,
    };

    console.log('Others Data:', othersData);
    message.success('Other expense saved successfully!');
    resetForm();
  };

  return (
    <Space direction="vertical" size={8} style={{ width: '100%' }}>
      {/* Payment */}
      <div>
        <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
          Payment
        </Text>
        <InputNumber
          style={{ width: '100%' }}
          size="middle"
          value={othersPayment}
          onChange={setOthersPayment}
          placeholder="Enter amount"
          prefix="Rs."
          min={0}
          formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
          parser={value => value.replace(/Rs.\s?|(,*)/g, '')}
        />
      </div>

      {/* Description */}
      <div>
        <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
          Description
        </Text>
        <TextArea
          rows={3}
          value={othersDescription}
          onChange={(e) => setOthersDescription(e.target.value)}
          placeholder="Enter description (optional)"
          style={{ fontSize: 12 }}
        />
      </div>

      {/* Save Button */}
      <Button
        type="primary"
        block
        size="middle"
        onClick={handleSave}
        style={{ marginTop: 4, height: 36 }}
      >
        Save
      </Button>
    </Space>
  );
};

export default OtherTab;