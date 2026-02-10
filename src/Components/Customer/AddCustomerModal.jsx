import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Tag,
  Space,
} from 'antd';

const AddCustomerModal = ({ visible, onClose, onAddCustomer }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample name hints
  const nameHints = [
    'ali1',
    'ahmad4',
    'sara2',
    'bilal7',
    'fatima3',
    'usman9',
    'ayesha5',
    'hassan8',
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Create new customer object
      const newCustomer = {
        id: Date.now(), // Generate unique ID
        name: values.name,
        phone: values.phone || '',
        address: values.address || '',
      };

      // Call parent function to add customer
      onAddCustomer(newCustomer);
      message.success('Customer added successfully!');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleNameHintClick = (name) => {
    form.setFieldsValue({ name });
  };

  // Handle phone number input - only allow numbers
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    form.setFieldsValue({ phone: value });
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: 18, fontWeight: 'bold' }}>
          Add New Customer
        </span>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="Customer Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter customer name' },
            { min: 3, message: 'Name must be at least 3 characters' },
          ]}
        >
          <Input 
            placeholder="Enter customer name" 
            size="large"
          />
        </Form.Item>

        {/* Name Hints */}
        <div style={{ marginTop: -16, marginBottom: 16, display: 'flex', gap: 4, flexWrap: 'nowrap', overflowX: 'auto' }}>
          {nameHints.map((hint) => (
            <Tag
              key={hint}
              color="blue"
              style={{ cursor: 'pointer', fontSize: 11, margin: 0, padding: '2px 6px' }}
              onClick={() => handleNameHintClick(hint)}
            >
              {hint}
            </Tag>
          ))}
        </div>

        <Form.Item
          label={
            <span>
              Phone Number <span style={{ color: '#999', fontSize: 12 }}>(Optional)</span>
            </span>
          }
          name="phone"
          rules={[
            { 
              pattern: /^03\d{9}$/, 
              message: 'Please enter valid 11-digit number (e.g., 03001234567)' 
            },
          ]}
        >
          <Input 
            placeholder="03001234567" 
            size="large"
            maxLength={11}
            onChange={handlePhoneChange}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Address <span style={{ color: '#999', fontSize: 12 }}>(Optional)</span>
            </span>
          }
          name="address"
        >
          <Input.TextArea 
            placeholder="Enter customer address" 
            rows={3}
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Button 
                block 
                size="large" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Col>
            <Col span={12}>
              <Button 
                type="primary" 
                block 
                size="large" 
                htmlType="submit"
                loading={loading}
              >
                Add Customer
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;