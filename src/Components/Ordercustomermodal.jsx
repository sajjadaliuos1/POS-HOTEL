import React, { useState } from 'react';
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
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import AddCustomerModal from './AddCustomerModal';

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
  { id: 16, name: 'Kamran Ali', phone: '0310-1234567', address: 'valencia town', loanAmount: 1200 },
  { id: 17, name: 'Mansoor Khan', phone: '0311-2345678', address: 'faisal town, lahore', loanAmount: 0 },
  { id: 18, name: 'Nadeem Shah', phone: '0312-3456789', address: 'iqbal town, lahore', loanAmount: 0 },
  { id: 19, name: 'Omar Farooq', phone: '0313-4567890', address: 'sabzazar, lahore', loanAmount: 500 },
  { id: 20, name: 'Rashid Ali', phone: '0314-5678901', address: 'shalimar town', loanAmount: 0 },
];

const OrderCustomerModal = ({ visible, onClose, onSelectCustomer }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [addCustomerVisible, setAddCustomerVisible] = useState(false);
  const [customers, setCustomers] = useState(customerData);

  // Generate A-Z letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filter customers by search and selected letter
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         customer.phone.includes(searchText);
    const matchesLetter = selectedLetter 
      ? customer.name.toUpperCase().startsWith(selectedLetter)
      : true;
    return matchesSearch && matchesLetter;
  });

  // Get row color based on row index
  const getRowColor = (index) => {
    const rowIndex = Math.floor(index / 4);
    const colors = ['#fff1f0', '#fff7e6', '#fcffe6', '#e6fffb', '#f0f5ff', '#f9f0ff'];
    return colors[rowIndex % colors.length];
  };

  // Handle letter click
  const handleLetterClick = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  // Handle customer card click
  const handleCustomerClick = (customer) => {
    onSelectCustomer(customer);
    onClose();
    setSearchText('');
    setSelectedLetter(null);
  };

  // Handle modal close
  const handleClose = () => {
    setSearchText('');
    setSelectedLetter(null);
    onClose();
  };

  // Handle add customer
  const handleAddCustomer = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };

  return (
    <>
      <Modal
        open={visible}
        onCancel={handleClose}
        width={1000}
        footer={null}
        bodyStyle={{ padding: 0, height: '70vh', overflow: 'hidden' }}
        centered
        style={{ top: 0 }}
        maskClosable={true}
      >
        <Row gutter={12} style={{ height: '100%' }}>
          {/* Main Content - Customer Cards */}
          <Col xs={24} lg={19} style={{ height: '100%' }}>
            <div 
              style={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#f0f2f5',
              }}
            >
              {/* Customer Cards Container with Scroll */}
              <div style={{ 
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 10,
              }}>
                {filteredCustomers.length > 0 ? (
                  <Row gutter={[6, 6]}>
                    {filteredCustomers.map((customer, index) => (
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
                    ))}
                  </Row>
                ) : (
                  <Empty
                    description={
                      <Text type="secondary">
                        {searchText || selectedLetter
                          ? 'No customers found matching your search'
                          : 'No customers available'}
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
            <Card bodyStyle={{ padding: 12, height: '100%' }}>
              {/* Search Field with Plus Button */}
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                suffix={
                  <Tooltip title="Add New Customer">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => setAddCustomerVisible(true)}
                      style={{
                        marginLeft: 4,
                      }}
                    />
                  </Tooltip>
                }
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ marginBottom: 12 }}
                size="large"
              />

              {/* Alphabet Buttons */}
              <Row gutter={[6, 6]}>
                {alphabet.map((letter) => {
                  const hasCustomers = customers.some(c => 
                    c.name.toUpperCase().startsWith(letter)
                  );
                  
                  return (
                    <Col span={6} key={letter}>
                      <Tooltip title={hasCustomers ? `Filter by ${letter}` : 'No customers'}>
                        <Button
                          block
                          size="middle"
                          onClick={() => handleLetterClick(letter)}
                          disabled={!hasCustomers}
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
                  onClick={() => setSelectedLetter(null)}
                  style={{ marginTop: 12 }}
                >
                  Clear Filter
                </Button>
              )}
            </Card>
          </Col>
        </Row>
      </Modal>

      {/* Add Customer Modal */}
      <AddCustomerModal
        visible={addCustomerVisible}
        onClose={() => setAddCustomerVisible(false)}
        onAddCustomer={handleAddCustomer}
      />
    </>
  );
};

export default OrderCustomerModal;