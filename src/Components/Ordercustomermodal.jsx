import React, { useState } from 'react';
import {
  Modal,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Tag,
  Space,
  Empty,
  Input,
  Avatar,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Sample customer data
const customerData = [
  { id: 1, name: 'ahmed ali', phone: '0300-1234567', address: 'gulberg, lahore' },
  { id: 2, name: 'ali hassan', phone: '0301-2345678', address: 'model town, lahore' },
  { id: 3, name: 'asad khan', phone: '0302-3456789', address: 'johar town, lahore' },
  { id: 4, name: 'bilal ahmed', phone: '0303-4567890', address: 'dha phase 5, lahore' },
  { id: 5, name: 'danish ali', phone: '0304-5678901', address: 'bahria town, lahore' },
  { id: 6, name: 'fahad malik', phone: '0305-6789012', address: 'canal road, lahore' },
  { id: 7, name: 'hamza shah', phone: '0306-7890123', address: 'garden town, lahore' },
  { id: 8, name: 'imran khan', phone: '0307-8901234', address: 'township, lahore' },
  { id: 9, name: 'irfan ali', phone: '0308-9012345', address: 'allama iqbal town' },
  { id: 10, name: 'junaid ahmad', phone: '0309-0123456', address: 'wapda town, lahore' },
  { id: 11, name: 'kamran ali', phone: '0310-1234567', address: 'valencia town' },
  { id: 12, name: 'mansoor khan', phone: '0311-2345678', address: 'faisal town, lahore' },
  { id: 13, name: 'nadeem shah', phone: '0312-3456789', address: 'iqbal town, lahore' },
  { id: 14, name: 'omar farooq', phone: '0313-4567890', address: 'sabzazar, lahore' },
  { id: 15, name: 'rashid ali', phone: '0314-5678901', address: 'shalimar town' },
  { id: 16, name: 'saad khan', phone: '0315-6789012', address: 'muslim town, lahore' },
  { id: 17, name: 'usman ahmed', phone: '0316-7890123', address: 'kot lakhpat, lahore' },
  { id: 18, name: 'waqar ali', phone: '0317-8901234', address: 'thokar niaz baig' },
  { id: 19, name: 'yasir shah', phone: '0318-9012345', address: 'chungi amar sidhu' },
  { id: 20, name: 'zain abbas', phone: '0319-0123456', address: 'raiwind road, lahore' },
];

const OrderCustomerModal = ({ visible, onClose, onSelectCustomer }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Generate A-Z letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filter customers by search and selected letter
  const filteredCustomers = customerData.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         customer.phone.includes(searchText);
    const matchesLetter = selectedLetter 
      ? customer.name.toUpperCase().startsWith(selectedLetter)
      : true;
    return matchesSearch && matchesLetter;
  });

  // Handle letter click
  const handleLetterClick = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  // Handle customer card click
  const handleCustomerClick = (customer) => {
    onSelectCustomer(customer);
    onClose();
    // Reset state
    setSearchText('');
    setSelectedLetter(null);
  };

  // Handle modal close
  const handleClose = () => {
    setSearchText('');
    setSelectedLetter(null);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      width={900}
      footer={null}
        bodyStyle={{ padding: 0,height: '65vh', overflow: 'hidden' }}
      centered
      style={{ top: 20 }}
    >
     
        
       
     
      <Row gutter={12}>
        {/* Main Content - Customer Cards */}
        <Col xs={24} lg={19}>
          <Card bodyStyle={{ padding: 12 }}>
            {/* Customer Cards Container with Fixed Height and Scroll */}
            <div style={{ 
              height: '500px', 
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {filteredCustomers.length > 0 ? (
                <Row gutter={[8, 8]}>
                  {filteredCustomers.map((customer) => (
                    <Col xs={24} sm={12} md={8} key={customer.id}>
                      <Card
                        hoverable
                        onClick={() => handleCustomerClick(customer)}
                        bodyStyle={{ padding: 10 }}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                      >
                        <Space direction="vertical" size={6} style={{ width: '100%' }}>
                          <Space>
                            <Avatar 
                              size={35} 
                              style={{ 
                                backgroundColor: '#1890ff',
                                fontWeight: 'bold',
                                fontSize: 14
                              }}
                            >
                              {customer.name.charAt(0)}
                            </Avatar>
                            <div>
                              <Text strong style={{ fontSize: 13, display: 'block' }}>
                                {customer.name}
                              </Text>
                              <Space size={4}>
                                <PhoneOutlined style={{ fontSize: 11, color: '#8c8c8c' }} />
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  {customer.phone}
                                </Text>
                              </Space>
                            </div>
                          </Space>

                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {customer.address}
                          </Text>
                        </Space>
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
          </Card>
        </Col>

        {/* Right Side - Search & Alphabet Filter */}
        <Col xs={24} lg={5}>
          <Card bodyStyle={{ padding: 12 }}>
            {/* Search Field */}
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ marginBottom: 12 }}
            />

            {/* Alphabet Buttons */}
            <Row gutter={[6, 6]}>
              {alphabet.map((letter) => {
                const hasCustomers = customerData.some(c => 
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
  );
};

export default OrderCustomerModal;