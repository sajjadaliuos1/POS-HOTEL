import React, { useState } from 'react';
import {
  Select,
  InputNumber,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Space,
  message,
} from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

// Sample data
const communities = [
  { id: 1, name: 'Community A' },
  { id: 2, name: 'Community B' },
  { id: 3, name: 'Community C' },
  { id: 4, name: 'Community D' },
  { id: 5, name: 'Community E' },
  { id: 6, name: 'Community F' },
  { id: 7, name: 'Community G' },
  { id: 8, name: 'Community H' },
];

const BCTab = () => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [dailyPayment, setDailyPayment] = useState('');
  const [bcPayment, setBcPayment] = useState('');
  const [bcDescription, setBcDescription] = useState('');

  // Reset Form
  const resetForm = () => {
    setSelectedCommunity(null);
    setDailyPayment('');
    setBcPayment('');
    setBcDescription('');
  };

  // Handle Save
  const handleSave = () => {
    if (!selectedCommunity) {
      message.warning('Please select a community!');
      return;
    }
    if (!dailyPayment && !bcPayment) {
      message.warning('Please enter payment amount!');
      return;
    }

    const bcData = {
      community: communities.find(c => c.id === selectedCommunity)?.name,
      dailyPayment,
      payment: bcPayment,
      description: bcDescription,
    };

    console.log('BC Data:', bcData);
    message.success('BC payment saved successfully!');
    resetForm();
  };

  return (
    <Space direction="vertical" size={8} style={{ width: '100%' }}>
      {/* Select Community - Searchable */}
      <div>
        <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
          Select Community
        </Text>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Search and select community"
          value={selectedCommunity}
          onChange={setSelectedCommunity}
          size="middle"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
          }
        >
          {communities.map(community => (
            <Select.Option key={community.id} value={community.id}>
              {community.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Daily Payment & Payment */}
      <Row gutter={8}>
        <Col span={12}>
          <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
            Daily Payment
          </Text>
          <InputNumber
            style={{ width: '100%' }}
            size="middle"
            value={dailyPayment}
            onChange={setDailyPayment}
            placeholder="Amount"
            prefix="Rs."
            min={0}
            formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={value => value.replace(/Rs.\s?|(,*)/g, '')}
          />
        </Col>
        <Col span={12}>
          <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
            Payment
          </Text>
          <InputNumber
            style={{ width: '100%' }}
            size="middle"
            value={bcPayment}
            onChange={setBcPayment}
            placeholder="Amount"
            prefix="Rs."
            min={0}
            formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={value => value.replace(/Rs.\s?|(,*)/g, '')}
          />
        </Col>
      </Row>

      {/* Description */}
      <div>
        <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
          Description
        </Text>
        <TextArea
          rows={2}
          value={bcDescription}
          onChange={(e) => setBcDescription(e.target.value)}
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
        Save BC Payment
      </Button>
    </Space>
  );
};

export default BCTab;