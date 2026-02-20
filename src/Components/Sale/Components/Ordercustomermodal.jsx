import React, { useState, useEffect } from 'react';
import {
  Modal,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Tag,
  Empty,
  Input,
  Tooltip,
  Tabs,
  InputNumber,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import AddCustomerModal from '../../Customer/AddCustomerModal';

const { Text } = Typography;

// Sample customer data
const customerData = [
  { id: 1, name: 'Ahmed Ali', phone: '0300-1234567', address: 'gulberg, lahore', loanAmount: 0 },
  { id: 2, name: 'Ali Hassan', phone: '0301-2345678', address: 'model town, lahore', loanAmount: 1500 },
  { id: 3, name: 'Asad Khan', phone: '0302-3456789', address: 'johar town, lahore', loanAmount: 0 },
  { id: 4, name: 'Bilal Ahmed', phone: '0303-4567890', address: 'dha phase 5, lahore', loanAmount: 2500 },
  { id: 5, name: 'Danish Ali', phone: '0304-5678901', address: 'bahria town, lahore', loanAmount: 0 },
  { id: 6, name: 'Fahad Malik', phone: '0305-6789012', address: 'canal road, lahore', loanAmount: 800 },
  { id: 7, name: 'Hamza Shah', phone: '0306-7890123', address: 'garden town, lahore', loanAmount: 0 },
  { id: 8, name: 'Imran Khan', phone: '0307-8901234', address: 'township, lahore', loanAmount: 0 },
  { id: 9, name: 'Irfan Ali', phone: '0308-9012345', address: 'allama iqbal town', loanAmount: 3200 },
  { id: 10, name: 'Junaid Ahmad', phone: '0309-0123456', address: 'wapda town, lahore', loanAmount: 0 },
  { id: 11, name: 'Kamran Ali', phone: '0310-1234567', address: 'valencia town', loanAmount: 1200 },
  { id: 12, name: 'Mansoor Khan', phone: '0311-2345678', address: 'faisal town, lahore', loanAmount: 0 },
  { id: 13, name: 'Nadeem Shah', phone: '0312-3456789', address: 'iqbal town, lahore', loanAmount: 0 },
  { id: 14, name: 'Omar Farooq', phone: '0313-4567890', address: 'sabzazar, lahore', loanAmount: 500 },
  { id: 15, name: 'Rashid Ali', phone: '0314-5678901', address: 'shalimar town', loanAmount: 0 },
];

// Sample employee data
const employeeData = [
  { id: 1, name: 'Adnan Raza', phone: '0320-1111111', address: 'gulberg, lahore', designation: 'Sales Manager' },
  { id: 2, name: 'Babar Azam', phone: '0321-2222222', address: 'model town, lahore', designation: 'Cashier' },
  { id: 3, name: 'Faisal Nawaz', phone: '0322-3333333', address: 'johar town, lahore', designation: 'Sales Staff' },
  { id: 4, name: 'Hassan Raza', phone: '0323-4444444', address: 'dha phase 5, lahore', designation: 'Accountant' },
  { id: 5, name: 'Khalid Mehmood', phone: '0324-5555555', address: 'bahria town, lahore', designation: 'Sales Staff' },
  { id: 6, name: 'Luqman Ali', phone: '0325-6666666', address: 'canal road, lahore', designation: 'Store Keeper' },
  { id: 7, name: 'Mubashir Ahmed', phone: '0326-7777777', address: 'garden town, lahore', designation: 'Sales Staff' },
  { id: 8, name: 'Naeem Akhtar', phone: '0327-8888888', address: 'township, lahore', designation: 'Cashier' },
  { id: 9, name: 'Qasim Ali', phone: '0328-9999999', address: 'allama iqbal town', designation: 'Sales Manager' },
  { id: 10, name: 'Rehan Butt', phone: '0329-0000000', address: 'wapda town, lahore', designation: 'Sales Staff' },
  { id: 11, name: 'Salman Farsi', phone: '0330-1234567', address: 'valencia town', designation: 'Accountant' },
  { id: 12, name: 'Tariq Jameel', phone: '0331-2345678', address: 'faisal town, lahore', designation: 'Store Keeper' },
  { id: 13, name: 'Usman Ghani', phone: '0332-3456789', address: 'iqbal town, lahore', designation: 'Sales Staff' },
  { id: 14, name: 'Waseem Akram', phone: '0333-4567890', address: 'sabzazar, lahore', designation: 'Cashier' },
  { id: 15, name: 'Zafar Iqbal', phone: '0334-5678901', address: 'shalimar town', designation: 'Sales Manager' },
];

// Sample payment data with outstanding amounts
const paymentData = [
  { id: 1, name: 'Ahmed Ali', phone: '0300-1234567', address: 'gulberg, lahore', totalPaid: 5000, outstandingAmount: 2000, lastPayment: '2024-01-15' },
  { id: 2, name: 'Ali Hassan', phone: '0301-2345678', address: 'model town, lahore', totalPaid: 3200, outstandingAmount: 1500, lastPayment: '2024-01-20' },
  { id: 3, name: 'Asad Khan', phone: '0302-3456789', address: 'johar town, lahore', totalPaid: 8500, outstandingAmount: 3500, lastPayment: '2024-02-01' },
  { id: 4, name: 'Bilal Ahmed', phone: '0303-4567890', address: 'dha phase 5, lahore', totalPaid: 2100, outstandingAmount: 900, lastPayment: '2024-01-10' },
  { id: 5, name: 'Danish Ali', phone: '0304-5678901', address: 'bahria town, lahore', totalPaid: 6700, outstandingAmount: 2300, lastPayment: '2024-01-25' },
  { id: 6, name: 'Fahad Malik', phone: '0305-6789012', address: 'canal road, lahore', totalPaid: 4300, outstandingAmount: 1700, lastPayment: '2024-02-05' },
  { id: 7, name: 'Hamza Shah', phone: '0306-7890123', address: 'garden town, lahore', totalPaid: 9200, outstandingAmount: 4800, lastPayment: '2024-01-30' },
  { id: 8, name: 'Imran Khan', phone: '0307-8901234', address: 'township, lahore', totalPaid: 1500, outstandingAmount: 500, lastPayment: '2024-01-18' },
  { id: 9, name: 'Irfan Ali', phone: '0308-9012345', address: 'allama iqbal town', totalPaid: 7800, outstandingAmount: 3200, lastPayment: '2024-02-03' },
  { id: 10, name: 'Junaid Ahmad', phone: '0309-0123456', address: 'wapda town, lahore', totalPaid: 3900, outstandingAmount: 1100, lastPayment: '2024-01-28' },
];

// Reusable Alphabet Filter Component
const AlphabetFilter = ({ data, selectedLetter, onLetterClick, onClearFilter }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <>
      <Row gutter={[6, 6]}>
        {alphabet.map((letter) => {
          const hasData = data.some(item =>
            item.name.toUpperCase().startsWith(letter)
          );

          return (
            <Col span={6} key={letter}>
              <Tooltip title={hasData ? `Filter by ${letter}` : 'No data'}>
                <Button
                  block
                  size="middle"
                  onClick={() => onLetterClick(letter)}
                  disabled={!hasData}
                  type={selectedLetter === letter ? 'primary' : 'default'}
                  style={{
                    height: 40,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {letter}
                </Button>
              </Tooltip>
            </Col>
          );
        })}
      </Row>

      {selectedLetter && (
        <Button
          block
          type="dashed"
          onClick={onClearFilter}
          style={{ marginTop: 12 }}
        >
          Clear Filter
        </Button>
      )}
    </>
  );
};

const OrderCustomerModal = ({ visible, onClose, onSelectCustomer, onSelectEmployee }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [addCustomerVisible, setAddCustomerVisible] = useState(false);
  const [customers, setCustomers] = useState(customerData);
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedPaymentCustomer, setSelectedPaymentCustomer] = useState(null);
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  // Calculate payment breakdown whenever payment amount or discount changes
  useEffect(() => {
    if (selectedPaymentCustomer) {
      const payment = parseFloat(paymentAmount?.toString().replace(/,/g, '')) || 0;
      const discountVal = parseFloat(discount?.toString().replace(/,/g, '')) || 0;
      const outstanding = selectedPaymentCustomer.outstandingAmount || 0;

      const paid = payment - discountVal;
      setPaidAmount(paid);

      const remaining = outstanding - paid;
      setRemainingAmount(remaining > 0 ? remaining : 0);
    } else {
      setPaidAmount(0);
      setRemainingAmount(selectedPaymentCustomer?.outstandingAmount || 0);
    }
  }, [paymentAmount, discount, selectedPaymentCustomer]);

  const getRowColor = (index) => {
    const rowIndex = Math.floor(index / 4);
    const colors = ['#fff1f0', '#fff7e6', '#fcffe6', '#e6fffb', '#f0f5ff', '#f9f0ff'];
    return colors[rowIndex % colors.length];
  };

  const getCurrentData = () => {
    if (activeTab === 'customers') return customers;
    if (activeTab === 'payments') return paymentData;
    if (activeTab === 'employees') return employeeData;
    return [];
  };

  const filteredItems = getCurrentData().filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.includes(searchText);
    const matchesLetter = selectedLetter
      ? item.name.toUpperCase().startsWith(selectedLetter)
      : true;
    return matchesSearch && matchesLetter;
  });

  const handleLetterClick = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  const handleCustomerClick = (customer) => {
    if (activeTab === 'customers') {
      onSelectCustomer(customer);
      onClose();
      resetFilters();
    }
  };

  // Handle employee card click
  const handleEmployeeClick = (employee) => {
    if (activeTab === 'employees') {
      if (onSelectEmployee) {
        onSelectEmployee(employee);
      }
      onClose();
      resetFilters();
    }
  };

  const resetFilters = () => {
    setSearchText('');
    setSelectedLetter(null);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    resetFilters();
  };

  const handleClose = () => {
    resetFilters();
    setActiveTab('customers');
    onClose();
  };

  const handleAddCustomer = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };

  const resetPaymentModal = () => {
    setPaymentMethodVisible(false);
    setSelectedPaymentCustomer(null);
    setPaymentAmount('');
    setDiscount('');
    setPaidAmount(0);
    setRemainingAmount(0);
  };

  // Render Customer Card
  const renderCustomerCard = (customer, index) => (
    <Col xs={12} sm={8} md={6} key={customer.id}>
      <Card
        hoverable
        onClick={() => handleCustomerClick(customer)}
        style={{
          borderColor: customer.loanAmount > 0 ? '#ff4d4f' : '#52c41a',
          borderWidth: 2,
          background: getRowColor(index),
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          minHeight: '60px',
          maxWidth: '150px',
        }}
        bodyStyle={{
          padding: 8,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Text
          strong
          style={{
            fontSize: 12,
            color: customer.loanAmount > 0 ? '#ff4d4f' : '#52c41a',
            lineHeight: 1.2,
          }}
        >
          {customer.name}
        </Text>
        <Text
          type="secondary"
          style={{
            fontSize: 10,
            lineHeight: 1.2,
          }}
        >
          {customer.address}
        </Text>
      </Card>
    </Col>
  );

  // Render Employee Card
  const renderEmployeeCard = (employee, index) => (
    <Col xs={12} sm={8} md={6} key={employee.id}>
      <Card
        hoverable
        onClick={() => handleEmployeeClick(employee)}
        style={{
          borderColor: '#1677ff',
          borderWidth: 2,
          background: getRowColor(index),
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          minHeight: '70px',
          maxWidth: '150px',
        }}
        bodyStyle={{
          padding: 8,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Text
          strong
          style={{
            fontSize: 12,
            color: '#1677ff',
            lineHeight: 1.2,
          }}
        >
          {employee.name}
        </Text>
        <Text
          type="secondary"
          style={{
            fontSize: 10,
            lineHeight: 1.2,
          }}
        >
          {employee.address}
        </Text>
        <Tag
          color="blue"
          style={{
            fontSize: 10,
            margin: 0,
            padding: '2px 6px',
          }}
        >
          {employee.designation}
        </Tag>
      </Card>
    </Col>
  );

  // Render Payment Card
  const renderPaymentCard = (payment, index) => (
    <Col xs={12} sm={8} md={6} key={payment.id}>
      <Card
        hoverable
        onClick={() => {
          setSelectedPaymentCustomer(payment);
          setPaymentMethodVisible(true);
        }}
        style={{
          borderColor: '#52c41a',
          borderWidth: 2,
          background: getRowColor(index),
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          minHeight: '80px',
          maxWidth: '150px',
        }}
        bodyStyle={{
          padding: 8,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Text
          strong
          style={{
            fontSize: 12,
            color: '#52c41a',
            lineHeight: 1.2,
          }}
        >
          {payment.name}
        </Text>
        <Text
          type="secondary"
          style={{
            fontSize: 10,
            lineHeight: 1.2,
          }}
        >
          {payment.address}
        </Text>
        <Tag
          color="green"
          style={{
            fontSize: 10,
            margin: 0,
            padding: '2px 6px',
          }}
        >
          Rs. {payment.totalPaid}
        </Tag>
      </Card>
    </Col>
  );

  return (
    <>
      <Modal
        open={visible}
        onCancel={handleClose}
        width={1000}
        footer={null}
        bodyStyle={{ padding: 0, height: '75vh', overflow: 'hidden' }}
        centered
        style={{ top: 0 }}
        maskClosable={true}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs at Top */}
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            tabBarStyle={{
              margin: 0,
              padding: '0 16px',
              background: '#fafafa',
              marginBottom: 0,
            }}
            items={[
              {
                key: 'customers',
                label: (
                  <span>
                    <UserOutlined /> Select Customer
                  </span>
                ),
              },
              {
                key: 'employees',
                label: (
                  <span>
                    <TeamOutlined /> Select Employee
                  </span>
                ),
              },
              {
                key: 'payments',
                label: (
                  <span>
                    <DollarOutlined /> Customer Payments
                  </span>
                ),
              },
            ]}
          />

          <Row gutter={12} style={{ flex: 1, overflow: 'hidden' }}>
            {/* Main Content - Cards */}
            <Col xs={24} lg={19} style={{ height: '100%' }}>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#f0f2f5',
                }}
              >
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  padding: 10,
                }}>
                  {filteredItems.length > 0 ? (
                    <Row gutter={[6, 6]}>
                      {filteredItems.map((item, index) => {
                        if (activeTab === 'customers') return renderCustomerCard(item, index);
                        if (activeTab === 'employees') return renderEmployeeCard(item, index);
                        return renderPaymentCard(item, index);
                      })}
                    </Row>
                  ) : (
                    <Empty
                      description={
                        <Text type="secondary">
                          {searchText || selectedLetter
                            ? `No ${activeTab} found matching your search`
                            : `No ${activeTab} available`}
                        </Text>
                      }
                      style={{ marginTop: 100 }}
                    />
                  )}
                </div>
              </div>
            </Col>

            {/* Right Side - Search & Alphabet Filter */}
            <Col xs={24} lg={5} style={{ height: '100%' }}>
              <Card bodyStyle={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Search Field - Add button only for customers tab */}
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  suffix={
                    activeTab === 'customers' ? (
                      <Tooltip title="Add New Customer">
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => setAddCustomerVisible(true)}
                          style={{ marginLeft: 4 }}
                        />
                      </Tooltip>
                    ) : null
                  }
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  style={{ marginBottom: 12 }}
                  size="large"
                />

                {/* Alphabet Filter */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                  <AlphabetFilter
                    data={getCurrentData()}
                    selectedLetter={selectedLetter}
                    onLetterClick={handleLetterClick}
                    onClearFilter={() => setSelectedLetter(null)}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* Add Customer Modal */}
      <AddCustomerModal
        visible={addCustomerVisible}
        onClose={() => setAddCustomerVisible(false)}
        onAddCustomer={handleAddCustomer}
      />

      {/* Payment Method Modal */}
      <Modal
        title={`Add Payment - ${selectedPaymentCustomer?.name || ''}`}
        open={paymentMethodVisible}
        onCancel={resetPaymentModal}
        onOk={() => {
          if (!paymentAmount || paymentAmount === '0') return;
          console.log('Payment Amount:', paymentAmount);
          console.log('Discount:', discount);
          console.log('Paid Amount:', paidAmount);
          console.log('Remaining Amount:', remainingAmount);
          console.log('Customer:', selectedPaymentCustomer);
          resetPaymentModal();
        }}
        okText="Submit Payment"
        cancelText="Cancel"
        width={400}
        centered
        bodyStyle={{ padding: '12px' }}
        maskClosable={true}
      >
        {selectedPaymentCustomer && (
          <div>
            {/* Customer Info Card */}
            <Card
              style={{ marginBottom: 10, background: '#fafafa' }}
              bodyStyle={{ padding: 8 }}
              bordered={false}
            >
              <Row gutter={[8, 4]}>
                <Col span={24}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Customer:</Text>
                  <br />
                  <Text strong style={{ fontSize: 13 }}>{selectedPaymentCustomer.name}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 10 }}>Phone:</Text>
                  <br />
                  <Text style={{ fontSize: 11 }}>{selectedPaymentCustomer.phone}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 10 }}>Total Paid:</Text>
                  <br />
                  <Text strong style={{ color: '#52c41a', fontSize: 11 }}>Rs. {selectedPaymentCustomer.totalPaid}</Text>
                </Col>
              </Row>
            </Card>

            {/* Payment Amount Input */}
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>
                  Payment Amount
                </Text>
                <InputNumber
                  style={{ width: '100%' }}
                  size="middle"
                  value={paymentAmount}
                  onChange={(value) => setPaymentAmount(value?.toString() || '')}
                  placeholder="Enter amount"
                  prefix="Rs."
                  min={0}
                  formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                  parser={value => value.replace(/\Rs.\s?|(,*)/g, '')}
                />
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>
                  Discount (Optional)
                </Text>
                <InputNumber
                  style={{ width: '100%' }}
                  size="middle"
                  value={discount}
                  onChange={(value) => {
                    const discountValue = value?.toString() || '';
                    const paymentValue = parseFloat(paymentAmount?.toString().replace(/,/g, '')) || 0;
                    const discountNum = parseFloat(discountValue.replace(/,/g, '')) || 0;
                    if (discountNum <= paymentValue) {
                      setDiscount(discountValue);
                    }
                  }}
                  placeholder="Enter discount"
                  prefix="Rs."
                  min={0}
                  formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                  parser={value => value.replace(/\Rs.\s?|(,*)/g, '')}
                />
              </Col>
            </Row>

            {/* Paid Amount Display */}
            <Card
              bordered={false}
              bodyStyle={{ padding: 8 }}
              style={{
                marginBottom: 8,
                background: '#f6ffed',
                border: '2px solid #52c41a',
              }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Text strong style={{ fontSize: 11, color: '#52c41a' }}>Paid Amount:</Text>
                </Col>
                <Col>
                  <Text strong style={{ fontSize: 16, color: '#52c41a', fontFamily: 'monospace' }}>
                    Rs. {paidAmount.toLocaleString()}
                  </Text>
                </Col>
              </Row>
            </Card>

            {/* Remaining Amount Display */}
            <Card
              bordered={false}
              bodyStyle={{ padding: 8 }}
              style={{
                marginBottom: 8,
                background: remainingAmount > 0 ? '#fff2e8' : '#f6ffed',
                border: remainingAmount > 0 ? '2px solid #ff7a45' : '2px solid #52c41a',
              }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Text strong style={{ fontSize: 11 }}>
                    {remainingAmount > 0 ? 'Remaining Amount:' : 'Fully Paid'}
                  </Text>
                </Col>
                <Col>
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                      color: remainingAmount > 0 ? '#ff4d4f' : '#52c41a',
                      fontFamily: 'monospace',
                    }}
                  >
                    Rs. {remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </Text>
                </Col>
              </Row>
            </Card>

            {/* Calculator */}
            <Card
              title={<span style={{ fontSize: 11 }}>Quick Calculator</span>}
              bordered={false}
              bodyStyle={{ padding: 5 }}
              headStyle={{ minHeight: 32, padding: '6px 10px' }}
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
                      size="small"
                      onClick={() => {
                        if (btn === 'C') {
                          setPaymentAmount('');
                        } else if (btn === '⌫') {
                          const currentVal = paymentAmount?.toString() || '';
                          setPaymentAmount(currentVal.length > 0 ? currentVal.slice(0, -1) : '');
                        } else {
                          const currentVal = paymentAmount?.toString() || '';
                          setPaymentAmount(currentVal + btn);
                        }
                      }}
                      style={{
                        height: 34,
                        fontSize: 14,
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
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrderCustomerModal;