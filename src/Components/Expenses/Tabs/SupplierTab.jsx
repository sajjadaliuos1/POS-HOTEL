import React, { useState, useEffect } from 'react';
import {
  Select,
  InputNumber,
  Input,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Space,
  message,
} from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

// Sample data
const suppliers = [
  { id: 1, name: 'Supplier 1', remainingAmount: 5000 },
  { id: 2, name: 'Supplier 2', remainingAmount: 8000 },
  { id: 3, name: 'Supplier 3', remainingAmount: 3500 },
  { id: 4, name: 'Supplier 4', remainingAmount: 12000 },
  { id: 5, name: 'Supplier 5', remainingAmount: 6500 },
  { id: 6, name: 'Supplier 6', remainingAmount: 9200 },
  { id: 7, name: 'Supplier 7', remainingAmount: 4800 },
  { id: 8, name: 'Supplier 8', remainingAmount: 7300 },
];

const SupplierTab = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierRemainingAmount, setSupplierRemainingAmount] = useState(0);
  const [supplierDiscount, setSupplierDiscount] = useState('');
  const [supplierPaid, setSupplierPaid] = useState('');
  const [supplierRemaining, setSupplierRemaining] = useState(0);
  const [supplierDescription, setSupplierDescription] = useState('');

  // Handle Supplier Selection
  const handleSupplierChange = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setSelectedSupplier(supplierId);
    setSupplierRemainingAmount(supplier ? supplier.remainingAmount : 0);
  };

  // Calculate Supplier Remaining Amount
  useEffect(() => {
    if (selectedSupplier) {
      const paid = parseFloat(supplierPaid) || 0;
      const discount = parseFloat(supplierDiscount) || 0;
      const remaining = supplierRemainingAmount - paid - discount;
      setSupplierRemaining(remaining > 0 ? remaining : 0);
    }
  }, [supplierPaid, supplierDiscount, supplierRemainingAmount, selectedSupplier]);

  // Reset Form
  const resetForm = () => {
    setSelectedSupplier(null);
    setSupplierRemainingAmount(0);
    setSupplierDiscount('');
    setSupplierPaid('');
    setSupplierRemaining(0);
    setSupplierDescription('');
  };

  // Handle Save
  const handleSave = () => {
    if (!selectedSupplier) {
      message.warning('Please select a supplier!');
      return;
    }
    if (!supplierPaid) {
      message.warning('Please enter paid amount!');
      return;
    }

    const suppliersData = {
      supplier: suppliers.find(s => s.id === selectedSupplier)?.name,
      remainingAmount: supplierRemainingAmount,
      discount: supplierDiscount,
      paid: supplierPaid,
      remaining: supplierRemaining,
      description: supplierDescription,
    };

    console.log('Suppliers Data:', suppliersData);
    message.success('Supplier payment saved successfully!');
    resetForm();
  };

  return (
    <Space direction="vertical" size={8} style={{ width: '100%' }}>
      {/* Select Supplier - Searchable */}
      <div>
        <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
          Select Supplier
        </Text>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Search and select supplier"
          value={selectedSupplier}
          onChange={handleSupplierChange}
          size="middle"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
          }
        >
          {suppliers.map(supplier => (
            <Select.Option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Remaining Amount Display */}
      {selectedSupplier && (
        <Card
          bordered={false}
          bodyStyle={{ padding: 6 }}
          style={{
            background: '#fff2e8',
            border: '1px solid #ff7a45',
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong style={{ fontSize: 11 }}>Remaining Amount:</Text>
            </Col>
            <Col>
              <Text strong style={{ fontSize: 13, color: '#ff4d4f' }}>
                Rs. {supplierRemainingAmount.toLocaleString()}
              </Text>
            </Col>
          </Row>
        </Card>
      )}

      {/* Discount & Paid */}
      <Row gutter={8}>
        <Col span={12}>
          <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
            Discount
          </Text>
          <InputNumber
            style={{ width: '100%' }}
            size="middle"
            value={supplierDiscount}
            onChange={setSupplierDiscount}
            placeholder="Discount"
            prefix="Rs."
            min={0}
            formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={value => value.replace(/Rs.\s?|(,*)/g, '')}
          />
        </Col>
        <Col span={12}>
          <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
            Paid
          </Text>
          <InputNumber
            style={{ width: '100%' }}
            size="middle"
            value={supplierPaid}
            onChange={setSupplierPaid}
            placeholder="Paid amount"
            prefix="Rs."
            min={0}
            formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={value => value.replace(/Rs.\s?|(,*)/g, '')}
          />
        </Col>
      </Row>

      {/* Remaining Amount After Payment */}
      {selectedSupplier && (
        <Card
          bordered={false}
          bodyStyle={{ padding: 6 }}
          style={{
            background: supplierRemaining > 0 ? '#fff2e8' : '#f6ffed',
            border: supplierRemaining > 0 ? '1px solid #ff7a45' : '1px solid #52c41a',
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong style={{ fontSize: 11 }}>
                {supplierRemaining > 0 ? 'New Remaining:' : 'Fully Paid'}
              </Text>
            </Col>
            <Col>
              <Text
                strong
                style={{
                  fontSize: 13,
                  color: supplierRemaining > 0 ? '#ff4d4f' : '#52c41a',
                }}
              >
                Rs. {supplierRemaining.toLocaleString()}
              </Text>
            </Col>
          </Row>
        </Card>
      )}

      {/* Description */}
      <div>
        <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
          Description
        </Text>
        <TextArea
          rows={2}
          value={supplierDescription}
          onChange={(e) => setSupplierDescription(e.target.value)}
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
        Save Supplier Payment
      </Button>
    </Space>
  );
};

export default SupplierTab;