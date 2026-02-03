import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Typography,
  Divider,
  Tag,
  Input,
  message,
  Modal,
  Flex,
  theme,
  Drawer,
  Badge,
  Space,
  Alert,
} from 'antd';
import {
  DeleteOutlined,
  CreditCardOutlined,
  DollarOutlined,
  SaveOutlined,
  UserOutlined,
  TableOutlined,
  ShoppingOutlined,
  WalletOutlined,
  CreditCardFilled,
  MobileOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import OrderCustomerModal from './Ordercustomermodal';
import TableBooking from './Tablebooking.jsx';
import WalkingCustomer from './Walkingcustomer.jsx';

const { Title, Text } = Typography;

// Sample data - NO IMAGES
const categories = [
  { id: 1, name: 'Fast Food', color: '#ff4d4f' },
  { id: 2, name: 'Biryani', color: '#52c41a' },
  { id: 3, name: 'Chinese', color: '#1890ff' },
  { id: 4, name: 'Beverages', color: '#faad14' },
  { id: 5, name: 'Desserts', color: '#eb2f96' },
  { id: 6, name: 'BBQ', color: '#722ed1' },
  { id: 7, name: 'BB', color: '#722ed1' },
  { id: 8, name: 'Q', color: '#722ed1' },
  { id: 9, name: 'BQ', color: '#722ed1' },
];

const products = [
  { id: 1, name: 'Chicken Biryani', price: 350, category: 2 },
  { id: 2, name: 'Mutton Biryani', price: 450, category: 2 },
  { id: 3, name: 'Zinger Burger', price: 250, category: 1 },
  { id: 4, name: 'Chicken Burger', price: 200, category: 1 },
  { id: 5, name: 'Beef Burger', price: 280, category: 1 },
  { id: 6, name: 'Chicken Chow Mein', price: 300, category: 3 },
  { id: 7, name: 'Fried Rice', price: 250, category: 3 },
  { id: 8, name: 'Spring Rolls', price: 150, category: 3 },
  { id: 9, name: 'Coca Cola', price: 80, category: 4 },
  { id: 10, name: 'Pepsi', price: 80, category: 4 },
  { id: 11, name: 'Fresh Juice', price: 150, category: 4 },
  { id: 12, name: 'Chocolate Cake', price: 200, category: 5 },
  { id: 13, name: 'Ice Cream', price: 120, category: 5 },
  { id: 14, name: 'BBQ Chicken', price: 400, category: 6 },
  { id: 15, name: 'Seekh Kabab', price: 350, category: 6 },
  { id: 16, name: 'Zinger Burger', price: 250, category: 1 },
  { id: 17, name: 'Zinger Burger', price: 250, category: 1 },
  { id: 18, name: 'Zinger Burger', price: 250, category: 1 },
  { id: 19, name: 'Zinssssssssssssssssssssssssger Burger', price: 250, category: 1 },
  { id: 20, name: 'Zinger Burger', price: 250, category: 1 },
];

const Dashboard = ({ selectedTable, onClearTable }) => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cart, setCart] = useState([]);
  const [calculatorDisplay, setCalculatorDisplay] = useState('');
  const [discountFocused, setDiscountFocused] = useState(false);
  const [discount, setDiscount] = useState('0');
  const [customerType, setCustomerType] = useState('walking');
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const [orderCustomerModalVisible, setOrderCustomerModalVisible] = useState(false);
  const [selectedOrderCustomer, setSelectedOrderCustomer] = useState(null);
  const [tableBookingModalVisible, setTableBookingModalVisible] = useState(false);
  const [bookedTables, setBookedTables] = useState(new Set());
  const [internalSelectedTable, setInternalSelectedTable] = useState(null);
  const [walkingCustomerModalVisible, setWalkingCustomerModalVisible] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Use internal state if no parent state is provided
  const currentSelectedTable = selectedTable || internalSelectedTable;

  // Filter products by category - now always filters by selected category
  const filteredProducts = products.filter((product) => product.category === selectedCategory);

  // Get category color
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#1890ff';
  };

  // Calculator button click
  const handleCalculatorClick = (value) => {
    if (discountFocused) {
      if (value === 'C') {
        setDiscount('0');
      } else if (value === '⌫') {
        setDiscount(discount.length > 1 ? discount.slice(0, -1) : '0');
      } else {
        setDiscount(discount === '0' ? value : discount + value);
      }
    } else {
      if (value === 'C') {
        setCalculatorDisplay('');
      } else if (value === '⌫') {
        setCalculatorDisplay(calculatorDisplay.slice(0, -1));
      } else {
        setCalculatorDisplay(calculatorDisplay + value);
      }
    }
  };

  // Handle product click
  const handleProductClick = (product) => {
    const quantity = parseInt(calculatorDisplay) || 1;
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    
    message.success(`${quantity} x ${product.name} added to cart`);
    setCalculatorDisplay('');
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    message.info('Item removed from cart');
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = parseFloat(discount) || 0;
  const tax = (subtotal - discountAmount) * 0.05;
  const total = subtotal - discountAmount + tax;

  // Handle Save to Database
  const handleSaveOrder = () => {
    if (cart.length === 0) {
      message.warning('Cart is empty!');
      return;
    }

    // For walking customers, show payment modal
    if (customerType === 'walking') {
      setWalkingCustomerModalVisible(true);
      return;
    }

    const orderData = {
      items: cart,
      subtotal,
      discount: discountAmount,
      tax,
      total,
      customerType,
      tableNumber: currentSelectedTable ? currentSelectedTable.number : null,
      tableCapacity: currentSelectedTable ? currentSelectedTable.capacity : null,
      orderCustomer: selectedOrderCustomer ? {
        name: selectedOrderCustomer.name,
        phone: selectedOrderCustomer.phone,
        loanAmount: selectedOrderCustomer.loanAmount,
      } : null,
      timestamp: new Date().toISOString(),
    };

    console.log('Saving order to database:', orderData);
    
    if (customerType === 'order' && selectedOrderCustomer) {
      if (selectedOrderCustomer.loanAmount > 0) {
        message.success(`Order saved for ${selectedOrderCustomer.name}! Added to existing loan of Rs. ${selectedOrderCustomer.loanAmount}`);
      } else {
        message.success(`Order saved for ${selectedOrderCustomer.name}! Payment pending.`);
      }
    } else {
      message.success('Order saved successfully! Payment completed.');
    }
    
    setCart([]);
    setDiscount('0');
    setCalculatorDisplay('');
    setDiscountFocused(false);
    
    if (currentSelectedTable) {
      setTimeout(() => {
        handleClearTable();
        setCustomerType('walking');
      }, 500);
    }
  };

  // Handle Table Customer Click
  const handleTableCustomer = () => {    
    setTableBookingModalVisible(true);
  };

  // Handle Table Selection from Modal
  const handleTableSelect = (table) => {
    // Close the modal directly
    setTableBookingModalVisible(false);
    
    // Update all states
    setCustomerType('table');
    setInternalSelectedTable(table);
    setBookedTables(prev => new Set([...prev, table.number]));
    
  
    // Show success message
    message.success(`Table ${table.number} selected successfully!`);
  };

  // Handle Clear Table
  const handleClearTable = () => {
    if (currentSelectedTable) {
      setBookedTables(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentSelectedTable.number);
        return newSet;
      });
    }
    
    setInternalSelectedTable(null);
    
    if (onClearTable) {
      onClearTable();
    }
    setCustomerType('walking');
  };

  // Handle Order Customer Click
  const handleOrderCustomer = () => {
    setCustomerType('order');
    setOrderCustomerModalVisible(true);
    handleClearTable();
  };

  // Handle Order Customer Selection
  const handleOrderCustomerSelect = (customer) => {
    setSelectedOrderCustomer(customer);
    message.success(`${customer.name} selected! You can now place an order.`);
  };

  // Handle Walking Customer Payment Complete
  const handleWalkingCustomerPayment = (paymentData) => {
    const orderData = {
      items: cart,
      subtotal,
      discount: discountAmount,
      tax,
      total,
      customerType: 'walking',
      paymentMethod: paymentData.method,
      cashReceived: paymentData.cashReceived,
      change: paymentData.change,
      timestamp: new Date().toISOString(),
    };

    console.log('Walking customer order saved:', orderData);
    
    // Clear cart and reset
    setCart([]);
    setDiscount('0');
    setCalculatorDisplay('');
    setDiscountFocused(false);
  };

  // Desktop Cart columns - UPDATED WITH COMPACT SPACING
  const desktopColumns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text) => (
        <Text 
          strong 
          style={{ 
            fontSize: 11,
            display: 'block',
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: '12%',
    },
    {
      title: 'Rs',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      render: (price) => <Text style={{ fontSize: 11 }}>Rs. {price}</Text>,
    },
    {
      title: 'Total',
      key: 'total',
      width: '14%',
      render: (_, record) => <Text strong style={{ fontSize: 11 }}>Rs. {record.price * record.quantity}</Text>,
    },
    {
      title: '',
      key: 'action',
      width: '7%',
      render: (_, record) => (
        <Button
          danger
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
        />
      ),
    },
  ];

  // Mobile Cart columns - NO IMAGES
  const mobileColumns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Text strong>{text}</Text>
          <Space size="small">
            <Text type="secondary" style={{ fontSize: 12 }}>Qty: {record.quantity}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>@Rs. {record.price}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: 80,
      align: 'right',
      render: (_, record) => (
        <Text strong style={{ fontSize: 14 }}>Rs. {record.price * record.quantity}</Text>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Button
          danger
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
        />
      ),
    },
  ];

  // Calculator Component
  const CalculatorComponent = ({ isModal = false }) => (
    <Card
      bordered={false}
      bodyStyle={{ padding: 8 }}
    >
      <Flex
        align="center"
        justify="flex-end"
        style={{
          background: '#001529',
          color: '#52c41a',
          padding: 10,
          borderRadius: 8,
          fontSize: isModal ? 20 : 18,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          height: isModal ? 45 : 42,
          marginBottom: 6,
        }}
      >
        {discountFocused ? `Disc: ${discount}` : (calculatorDisplay || '0')}
      </Flex>

      <Row gutter={[4, 4]}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
          <Col span={8} key={btn}>
            <Button
              block
              size="middle"
              onClick={() => handleCalculatorClick(btn)}
              style={{
                height: isModal ? 32 : 30,
                fontSize: isModal ? 18 : 16,
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
  );

  // Billing Summary Component
  const BillingSummary = ({ isModal = false }) => (
    <Card
      bordered={false}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        height: isModal ? 'auto' : 195,
      }}
      headStyle={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}
      bodyStyle={{ padding: isModal ? 16 : 8 }}
    >
      <Space direction="vertical" size={6} style={{ width: '100%' }}>
        <Flex justify="flex-end">
          <Text strong style={{ color: 'white', fontSize: 15 }}>
            Rs. {subtotal.toFixed(2)}
          </Text>
        </Flex>

        <Flex justify="flex-end">
          <Flex
            align="center"
            justify="flex-end"
            onClick={() => setDiscountFocused(!discountFocused)}
            style={{
              width: 95,
              fontWeight: 'bold',
              fontSize: 13,
              background: discountFocused ? '#fffbe6' : 'white',
              border: discountFocused ? '2px solid #faad14' : '1px solid #d9d9d9',
              borderRadius: 4,
              padding: '3px 8px',
              cursor: 'pointer',
            }}
          >
            Rs. {discount}
          </Flex>
        </Flex>

        <Divider
          style={{
            borderColor: 'rgba(255,255,255,0.3)',
            margin: '2px 0',
          }}
        />

        <Flex justify="flex-end">
          <Text strong style={{ color: 'white', fontSize: 22 }}>
            Rs. {total.toFixed(2)}
          </Text>
        </Flex>

        <Button
          type="primary"
          block
          size="small"
          icon={<SaveOutlined />}
          onClick={handleSaveOrder}
          disabled={cart.length === 0}
          style={{
            height: 30,
            background: '#106314',
            borderColor: '#106314',
          }}
        >
          Save
        </Button>
      </Space>
    </Card>
  );

  return (
    <>
      <div style={{
        padding: 10, 
        background: '#ffffff', 
        height: '96vh',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Table Number Display - Compact */}
        {currentSelectedTable && (
          <Space style={{ marginBottom: 10, flexShrink: 0 }}>
            <Tag 
              color="success" 
              closable
              onClose={handleClearTable}
              style={{ 
                fontSize: 14,
                padding: '4px 8px',
                margin: 0
              }}
            >
              <TableOutlined /> Table {currentSelectedTable.number} ({currentSelectedTable.capacity} seats)
            </Tag>
          </Space>
        )}

        {/* Order Customer Display - Compact */}
        {selectedOrderCustomer && (
          <Space style={{ marginBottom: 10, flexShrink: 0 }}>
            <Tag 
              color="warning"
              closable
              onClose={() => {
                setSelectedOrderCustomer(null);
                setCustomerType('walking');
              }}
              style={{ 
                fontSize: 14,
                padding: '4px 8px',
                margin: 0
              }}
            >
              <ShoppingOutlined /> Order for: {selectedOrderCustomer.name}
            </Tag>
          </Space>
        )}

        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <Row gutter={[10, 10]} align="top" style={{ height: '100%' }}>
          {/* Left Column - Products & Categories */}
          <Col xs={24} lg={16} style={{ height: '100%' }}>
            <Space direction="vertical" size={10} style={{ width: '100%', height: '100%' }}>
              {/* Products Section - UPDATED WITH PRICE AT BOTTOM AND 2-LINE NAME */}
              <Card
                style={{ height: '55vh' }}
                bodyStyle={{
                  height: 'calc(100% - 57px)',
                  padding: 8,
                  overflowY: 'auto',
                }}
              >
                <Row gutter={[6, 6]}>
                  {filteredProducts.map((product) => (
                    <Col
                      xs={12}
                      sm={8}
                      md={6}
                      lg={24 / 5}
                      xl={24 / 5}
                      key={product.id}
                    >
                      <Card
                        hoverable
                        onClick={() => handleProductClick(product)}
                        style={{
                          background: `linear-gradient(135deg, ${getCategoryColor(product.category)}15, ${getCategoryColor(product.category)}30)`,
                          borderLeft: `4px solid ${getCategoryColor(product.category)}`,
                          height: 80,
                        }}
                        bodyStyle={{
                          padding: 8,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%',
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: 11,
                            textAlign: 'center',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '1.3',
                            marginBottom: 4,
                          }}
                          title={product.name}
                        >
                          {product.name}
                        </Text>

                        <Tag 
                          color={getCategoryColor(product.category)} 
                          style={{ 
                            fontSize: 11, 
                            padding: '2px 6px', 
                            alignSelf: 'center',
                            margin: 0 
                          }}
                        >
                          Rs. {product.price}
                        </Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>

              {/* Categories Section */}
              <Card bodyStyle={{ padding: 8 }}>
                <Row gutter={[6, 6]}>
                  {categories.map((category) => (
                    <Col xs={8} sm={6} md={4} lg={4} key={category.id}>
                      <Button
                        type={selectedCategory === category.id ? 'primary' : 'default'}
                        block
                        size="large"
                        onClick={() => setSelectedCategory(category.id)}
                        style={{
                          height: 50,
                          fontSize: 12,
                          fontWeight: 'bold',
                          backgroundColor: selectedCategory === category.id ? undefined : category.color,
                          borderColor: selectedCategory === category.id ? undefined : category.color,
                          color: selectedCategory === category.id ? undefined : 'white',
                        }}
                      >
                        {category.name}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Card>

              {/* Customer Type Buttons */}
              <Row gutter={[6, 6]}>
                <Col xs={24} sm={8}>
                  <Button
                    type={customerType === 'walking' ? 'primary' : 'default'}
                    block
                    size="large"
                    icon={<UserOutlined />}
                    onClick={() => {
                      setCustomerType('walking');
                      setSelectedOrderCustomer(null);
                      handleClearTable();
                    }}
                    style={{
                      height: 45,
                      fontSize: 13,
                      fontWeight: 'bold',
                      background: customerType === 'walking' ? '#1890ff' : undefined,
                      borderColor: customerType === 'walking' ? '#1890ff' : undefined,
                    }}
                  >
                    Walking Customer
                  </Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Button
                    type={customerType === 'table' || currentSelectedTable ? 'primary' : 'default'}
                    block
                    size="large"
                    icon={<TableOutlined />}
                    onClick={handleTableCustomer}
                    style={{
                      height: 45,
                      fontSize: 13,
                      fontWeight: 'bold',
                      background: (customerType === 'table' || currentSelectedTable) ? '#52c41a' : undefined,
                      borderColor: (customerType === 'table' || currentSelectedTable) ? '#52c41a' : undefined,
                    }}
                  >
                    {currentSelectedTable ? `Table ${currentSelectedTable.number}` : 'Table Customer'}
                  </Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Button
                    type={customerType === 'order' || selectedOrderCustomer ? 'primary' : 'default'}
                    block
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={handleOrderCustomer}
                    style={{
                      height: 45,
                      fontSize: 13,
                      fontWeight: 'bold',
                      background: (customerType === 'order' || selectedOrderCustomer) ? '#faad14' : undefined,
                      borderColor: (customerType === 'order' || selectedOrderCustomer) ? '#faad14' : undefined,
                    }}
                  >
                    {selectedOrderCustomer ? selectedOrderCustomer.name : 'Order Customer'}
                  </Button>
                </Col>
              </Row>
            </Space>
          </Col>

          {/* Right Column - Cart & Calculator (Desktop Only) */}
        <Col xs={0} lg={8} style={{ height: '100%' }}>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    height: '100%'}}>

    {/* Cart Section - REMOVED TITLE, COMPACT TABLE */}
   <Card
  bordered
  style={{
    height: '55vh',
  }}
  bodyStyle={{
    padding: 0,
    height: '100%',
    overflow: 'hidden',
  }}
>
  <div style={{ height: '100%', overflow: 'auto' }}>
    <Table
      dataSource={cart}
      columns={desktopColumns}
      rowKey="id"
      pagination={false}
      size="small"
      scroll={{ y: 400 }}   // ⭐ NUMBER do, % nahi
      sticky={{ offsetHeader: -10 }}
          
    />
  </div>
</Card>



    {/* Calculator & Billing */}
    <Row gutter={10}>
      <Col span={13}>
        <CalculatorComponent />
      </Col>
      <Col span={11}>
        <BillingSummary />
      </Col>
    </Row>
  </div>
</Col>
        </Row>
        </div>
      </div>

      {/* Mobile Cart Drawer */}
      <Drawer
        title={
          <Space size="small">
            <Tag color="blue">{cart.length} items</Tag>
          </Space>
        }
        placement="right"
        onClose={() => setCartDrawerVisible(false)}
        open={cartDrawerVisible}
        width="100%"
        bodyStyle={{ padding: 0 }}
      >
        <Flex vertical style={{ height: '100%' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Table
              dataSource={cart}
              columns={mobileColumns}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'No items in cart' }}
              size="middle"
            />
          </div>

          <div style={{ padding: 16, background: colorBgContainer, borderTop: '1px solid #f0f0f0' }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <CalculatorComponent isModal={true} />
              <BillingSummary isModal={true} />
            </Space>
          </div>
        </Flex>
      </Drawer>

      {/* Order Customer Modal */}
      <OrderCustomerModal
        visible={orderCustomerModalVisible}
        onClose={() => setOrderCustomerModalVisible(false)}
        onSelectCustomer={handleOrderCustomerSelect}
      />

      {/* Walking Customer Payment Modal */}
      <WalkingCustomer
        visible={walkingCustomerModalVisible}
        onClose={() => setWalkingCustomerModalVisible(false)}
        orderTotal={total}
        onPaymentComplete={handleWalkingCustomerPayment}
      />

      {/* Table Booking Modal */}
      <Modal
        title={null}
        open={tableBookingModalVisible}
        onCancel={() => setTableBookingModalVisible(false)}
        footer={null}
       width={700}
        
       style={{ top: 20 }}
        bodyStyle={{ padding: 0,
           height: '65vh', overflow: 'hidden'
         }
      }
        maskClosable={true}
      >
        <TableBooking
          onTableSelect={handleTableSelect}
          onBack={() => setTableBookingModalVisible(false)}
          bookedTables={bookedTables}
        />
      </Modal>
    </>
  );
};

export default Dashboard;