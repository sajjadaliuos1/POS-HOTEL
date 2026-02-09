import React, { useState } from 'react';
import {
  Modal,
  Tabs,
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
import {
  DollarOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

// Sample data
const communities = [
  { id: 1, name: 'Community A' },
  { id: 2, name: 'Community B' },
  { id: 3, name: 'Community C' },
];

const suppliers = [
  { id: 1, name: 'Supplier 1', remainingAmount: 5000 },
  { id: 2, name: 'Supplier 2', remainingAmount: 8000 },
  { id: 3, name: 'Supplier 3', remainingAmount: 3500 },
];

const ExpenseModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState('bc');

  // BC Tab States
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [dailyPayment, setDailyPayment] = useState('');
  const [bcPayment, setBcPayment] = useState('');
  const [bcDescription, setBcDescription] = useState('');

  // Suppliers Tab States
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierRemainingAmount, setSupplierRemainingAmount] = useState(0);
  const [supplierDiscount, setSupplierDiscount] = useState('');
  const [supplierPaid, setSupplierPaid] = useState('');
  const [supplierRemaining, setSupplierRemaining] = useState(0);
  const [supplierDescription, setSupplierDescription] = useState('');

  // Others Tab States
  const [othersPayment, setOthersPayment] = useState('');
  const [othersDescription, setOthersDescription] = useState('');

  // Handle Supplier Selection
  const handleSupplierChange = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setSelectedSupplier(supplierId);
    setSupplierRemainingAmount(supplier ? supplier.remainingAmount : 0);
  };

  // Calculate Supplier Remaining Amount
  React.useEffect(() => {
    if (selectedSupplier) {
      const paid = parseFloat(supplierPaid) || 0;
      const discount = parseFloat(supplierDiscount) || 0;
      const remaining = supplierRemainingAmount - paid - discount;
      setSupplierRemaining(remaining > 0 ? remaining : 0);
    }
  }, [supplierPaid, supplierDiscount, supplierRemainingAmount, selectedSupplier]);

  // Reset BC Form
  const resetBCForm = () => {
    setSelectedCommunity(null);
    setDailyPayment('');
    setBcPayment('');
    setBcDescription('');
  };

  // Reset Suppliers Form
  const resetSuppliersForm = () => {
    setSelectedSupplier(null);
    setSupplierRemainingAmount(0);
    setSupplierDiscount('');
    setSupplierPaid('');
    setSupplierRemaining(0);
    setSupplierDescription('');
  };

  // Reset Others Form
  const resetOthersForm = () => {
    setOthersPayment('');
    setOthersDescription('');
  };

  // Handle BC Save
  const handleBCSave = () => {
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
    resetBCForm();
  };

  // Handle Suppliers Save
  const handleSuppliersSave = () => {
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
    resetSuppliersForm();
  };

  // Handle Others Save
  const handleOthersSave = () => {
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
    resetOthersForm();
  };

  // Handle Modal Close
  const handleClose = () => {
    resetBCForm();
    resetSuppliersForm();
    resetOthersForm();
    setActiveTab('bc');
    onClose();
  };

  return (
    <Modal
      title="Payment Management"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      maskClosable={true}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="small"
        items={[
          {
            key: 'bc',
            label: (
              <span style={{ fontSize: 13 }}>
                <DollarOutlined /> BC
              </span>
            ),
            children: (
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {/* Select Community */}
                <div>
                  <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
                    Select Community
                  </Text>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Choose community"
                    value={selectedCommunity}
                    onChange={setSelectedCommunity}
                    size="middle"
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
                  onClick={handleBCSave}
                  style={{ marginTop: 4, height: 36 }}
                >
                  Save BC Payment
                </Button>
              </Space>
            ),
          },
          {
            key: 'suppliers',
            label: (
              <span style={{ fontSize: 13 }}>
                <ShoppingOutlined /> Suppliers
              </span>
            ),
            children: (
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {/* Select Supplier */}
                <div>
                  <Text type="secondary" style={{ fontSize: 11, marginBottom: 2, display: 'block' }}>
                    Select Supplier
                  </Text>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Choose supplier"
                    value={selectedSupplier}
                    onChange={handleSupplierChange}
                    size="middle"
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
                  onClick={handleSuppliersSave}
                  style={{ marginTop: 4, height: 36 }}
                >
                  Save Supplier Payment
                </Button>
              </Space>
            ),
          },
          {
            key: 'others',
            label: (
              <span style={{ fontSize: 13 }}>
                <AppstoreOutlined /> Others
              </span>
            ),
            children: (
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
                  onClick={handleOthersSave}
                  style={{ marginTop: 4, height: 36 }}
                >
                  Save
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default ExpenseModal;