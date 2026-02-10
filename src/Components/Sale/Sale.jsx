import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Radio,
  Table,
  Typography,
  Divider,
  Tag,
  message,
  Modal,
  Flex,
  theme,
  Badge,
  Space,
  Alert,
} from 'antd';
import {
  DeleteOutlined,
  SaveOutlined,
  UserOutlined,
  TableOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  StarOutlined,
  StarFilled,
  RollbackOutlined,
  DollarOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import TableBooking from './Components/TablebookingModal.jsx';
import ProceedOrderModal from './Components/ProceedOrderModal';
import ReturnOrderModal from './Components/Returnordermodal.jsx';
import PaymentModal from './Components/PaymentModal.jsx';

import RotiModal from './Components/RotiModal';
import OrderCustomerModal from './Components/Ordercustomermodal.jsx';
import ExpenseModal from '../Expenses/ExpenseModal.jsx';
const { Title, Text } = Typography;

// Sample data - NO IMAGES
const categories = [
  { id: 1, name: 'Fast Food', color: '#ff4d4f', orderBy: 1 },
  { id: 2, name: 'Biryani', color: '#52c41a', orderBy: 2 },
  { id: 3, name: 'Chinese', color: '#1890ff', orderBy: 3 },
  { id: 4, name: 'Beverages', color: '#faad14', orderBy: 4 },
  { id: 5, name: 'Desserts', color: '#eb2f96', orderBy: 5 },
  { id: 6, name: 'BBQ', color: '#722ed1', orderBy: 6 },
  { id: 7, name: 'BB', color: '#722ed1', orderBy: 7 },
  { id: 8, name: 'Q', color: '#722ed1', orderBy: 8 },
  { id: 9, name: 'BQ', color: '#722ed1', orderBy: 9 },
];

const products = [
  { id: 1, name: 'Chicken Biryani', price: 350, category: 2, color: '#ff4d4f', orderBy: 1 },
  { id: 2, name: 'Mutton Biryani', price: 450, category: 2, color: '#52c41a', orderBy: 2 },
  { id: 3, name: 'Zinger Burger', price: 250, category: 1, color: '#1890ff', orderBy: 3 },
  { id: 4, name: 'Chicken Burger', price: 200, category: 1, color: '#faad14', orderBy: 4 },
  { id: 5, name: 'Beef Burger', price: 280, category: 1, color: '#eb2f96', orderBy: 5 },
  { id: 6, name: 'Chicken Chow Mein', price: 300, category: 3, color: '#722ed1', orderBy: 6 },
  { id: 7, name: 'Fried Rice', price: 250, category: 3, color: '#ff4d4f', orderBy: 7 },
  { id: 8, name: 'Spring Rolls', price: 150, category: 3, color: '#52c41a', orderBy: 8 },
  { id: 9, name: 'Coca Cola', price: 80, category: 4, color: '#1890ff', orderBy: 9 },
  { id: 10, name: 'Pepsi', price: 80, category: 4, color: '#faad14', orderBy: 10 },
  { id: 11, name: 'Fresh Juice', price: 150, category: 4, color: '#eb2f96', orderBy: 11 },
  { id: 12, name: 'Chocolate Cake', price: 200, category: 5, color: '#722ed1', orderBy: 12 },
  { id: 13, name: 'Ice Cream', price: 120, category: 5, color: '#ff4d4f', orderBy: 13 },
  { id: 14, name: 'BBQ Chicken', price: 400, category: 6, color: '#52c41a', orderBy: 14 },
  { id: 15, name: 'Seekh Kabab', price: 350, category: 6, color: '#1890ff', orderBy: 15 },
  { id: 16, name: 'Zinger Burger', price: 250, category: 1, color: '#faad14', orderBy: 16 },
  { id: 17, name: 'Zinger Burger', price: 250, category: 1, color: '#eb2f96', orderBy: 17 },
  { id: 18, name: 'Zinger Burger', price: 250, category: 1, color: '#722ed1', orderBy: 18 },
  { id: 19, name: 'Zinssssssssssssssssssssssssger Burger', price: 250, category: 1, color: '#ff4d4f', orderBy: 19 },
  { id: 20, name: 'Zinger Burger', price: 250, category: 1, color: '#52c41a', orderBy: 20 },
];

const initialTables = [
  { id: 1, name: 'Baramdaa', capacity: 2, status: 'available', bookedBy: null, color: '#faad14', orderBy: 1 },
  { id: 2, name: 'Garden', capacity: 4, status: 'available', bookedBy: null, color: '#ff4d4f', orderBy: 2 },
  { id: 3, name: 'Rooftop', capacity: 4, status: 'available', bookedBy: null, color: '#52c41a', orderBy: 3 },
  { id: 4, name: 'VIP Lounge', capacity: 6, status: 'available', bookedBy: null, color: '#1890ff', orderBy: 4 },
  { id: 5, name: 'Corner Table', capacity: 2, status: 'available', bookedBy: null, color: '#eb2f96', orderBy: 5 },
  { id: 6, name: 'Main Hall', capacity: 8, status: 'available', bookedBy: null, color: '#722ed1', orderBy: 6 },
  { id: 7, name: 'Window Side', capacity: 4, status: 'available', bookedBy: null, color: '#faad14', orderBy: 7 },
  { id: 8, name: 'Terrace', capacity: 2, status: 'available', bookedBy: null, color: '#ff4d4f', orderBy: 8 },
  { id: 9, name: 'Family Room', capacity: 4, status: 'available', bookedBy: null, color: '#52c41a', orderBy: 9 },
  { id: 10, name: 'Private Booth', capacity: 6, status: 'available', bookedBy: null, color: '#1890ff', orderBy: 10 },
  { id: 11, name: 'Balcony', capacity: 2, status: 'available', bookedBy: null, color: '#eb2f96', orderBy: 11 },
  { id: 12, name: 'Patio', capacity: 4, status: 'available', bookedBy: null, color: '#722ed1', orderBy: 12 },
  { id: 13, name: 'Lawn', capacity: 2, status: 'available', bookedBy: null, color: '#faad14', orderBy: 13 },
  { id: 14, name: 'Gazebo', capacity: 4, status: 'available', bookedBy: null, color: '#ff4d4f', orderBy: 14 },
  { id: 15, name: 'Pavilion', capacity: 6, status: 'available', bookedBy: null, color: '#52c41a', orderBy: 15 },
  { id: 16, name: 'Riverside', capacity: 8, status: 'available', bookedBy: null, color: '#1890ff', orderBy: 16 },
  { id: 17, name: 'Courtyard', capacity: 6, status: 'available', bookedBy: null, color: '#eb2f96', orderBy: 17 },
  { id: 18, name: 'Veranda', capacity: 2, status: 'available', bookedBy: null, color: '#722ed1', orderBy: 18 },
  { id: 19, name: 'Deck', capacity: 4, status: 'available', bookedBy: null, color: '#faad14', orderBy: 19 },
  { id: 20, name: 'Sunroom', capacity: 2, status: 'available', bookedBy: null, color: '#ff4d4f', orderBy: 20 },
  { id: 21, name: 'Conservatory', capacity: 4, status: 'available', bookedBy: null, color: '#52c41a', orderBy: 21 },
  { id: 22, name: 'Outdoor Plaza', capacity: 6, status: 'available', bookedBy: null, color: '#1890ff', orderBy: 22 },
  { id: 23, name: 'Sky Lounge', capacity: 8, status: 'available', bookedBy: null, color: '#eb2f96', orderBy: 23 },
];

const Sale = ({ selectedTable, onClearTable }) => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cart, setCart] = useState([]);
  const [calculatorDisplay, setCalculatorDisplay] = useState('');
  const [discountFocused, setDiscountFocused] = useState(false);
  const [discount, setDiscount] = useState('0');
  const [customerType, setCustomerType] = useState('walking');
  const [orderCustomerModalVisible, setOrderCustomerModalVisible] = useState(false);
  const [selectedOrderCustomer, setSelectedOrderCustomer] = useState(null);
  const [bookedTables, setBookedTables] = useState(new Set());
  const [internalSelectedTable, setInternalSelectedTable] = useState(null);
  const [tableBookingModalVisible, setTableBookingModalVisible] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [proceedOrderModalVisible, setProceedOrderModalVisible] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [returnOrderModalVisible, setReturnOrderModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [rotiModalVisible, setRotiModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

 
  const currentSelectedTable = selectedTable || internalSelectedTable;

  const filteredProducts = products
    .filter((product) => product.category === selectedCategory)
    .sort((a, b) => a.orderBy - b.orderBy);

  
  const sortedCategories = [...categories].sort((a, b) => a.orderBy - b.orderBy);

  
  const sortedTables = [...initialTables].sort((a, b) => a.orderBy - b.orderBy);

 
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#1890ff';
  };

  // Get product color
  const getProductColor = (product) => {
    return product.color || getCategoryColor(product.category);
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
        const newValue = calculatorDisplay + value;
        const quantity = parseInt(newValue) || 0;
        
        // Check if quantity exceeds 10
        if (quantity > 10) {
          message.warning('10 se zayada product select nahi ho sakta!');
          return;
        }
        
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
  const total = subtotal - discountAmount;

  // Handle Print
  const handlePrint = () => {
    message.info('Printing order...');
    // Add your print logic here
  };

  // Handle Star Toggle
  const handleStarToggle = () => {
    setIsStarred(!isStarred);
    message.success(isStarred ? 'Unmarked as favorite' : 'Marked as favorite');
  };

  // Handle Proceed Order
  const handleProceedOrder = () => {
    if (cart.length === 0) {
      message.warning('Cart is empty!');
      return;
    }
    setProceedOrderModalVisible(true);
  };

  // Handle Return Order
  const handleReturnOrder = () => {
    setReturnOrderModalVisible(true);
  };

  // Handle Save to Database
  const handleSaveOrder = () => {
    if (cart.length === 0) {
      message.warning('Cart is empty!');
      return;
    }

    const orderData = {
      items: cart,
      subtotal,
      discount: discountAmount,
      total,
      customerType,
      tableName: currentSelectedTable ? currentSelectedTable.name : null,
      tableCapacity: currentSelectedTable ? currentSelectedTable.capacity : null,
      orderCustomer: selectedOrderCustomer ? {
        name: selectedOrderCustomer.name,
        phone: selectedOrderCustomer.phone,
        loanAmount: selectedOrderCustomer.loanAmount,
      } : null,
      isStarred,
      timestamp: new Date().toISOString(),
    };

    console.log('Saving order to database:', orderData);
    
    if (customerType === 'order' && selectedOrderCustomer) {
      if (selectedOrderCustomer.loanAmount > 0) {
        message.success(`Order saved for ${selectedOrderCustomer.name}! Added to existing loan of Rs. ${selectedOrderCustomer.loanAmount}`);
      } else {
        message.success(`Order saved for ${selectedOrderCustomer.name}! Payment pending.`);
      }
    } else if (customerType === 'table' && currentSelectedTable) {
      message.success(`Order saved for Table ${currentSelectedTable.name}!`);
    } else {
      message.success('Order saved successfully! Payment completed.');
    }
    
    setCart([]);
    setDiscount('0');
    setCalculatorDisplay('');
    setDiscountFocused(false);
    setIsStarred(false);
  };

  // Handle Table Customer Click
  const handleTableCustomer = () => {    
    setTableBookingModalVisible(true);
  };

  const handleBookedTablesList = () => {
    setTableBookingModalVisible(true);
  };

  // Handle Table Selection from Modal
  const handleTableSelect = (table) => {
    setTableBookingModalVisible(false);
    setSelectedOrderCustomer(null);
    setCustomerType('table');
    setInternalSelectedTable(table);
    setBookedTables(prev => new Set([...prev, table.name]));
    message.success(`Table ${table.name} selected successfully!`);
  };

  // Handle Clear Table
  const handleClearTable = () => {
    if (currentSelectedTable) {
      setBookedTables(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentSelectedTable.name);
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

  // Desktop Cart columns
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
          {`${text} x ${cart.find(item => item.name === text)?.price || 0}`}
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
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      height: isModal ? 'auto' : 195,
    }}
    headStyle={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}
    bodyStyle={{ padding: isModal ? 16 : 8 }}
  >
    <Space direction="vertical" size={6} style={{ width: '100%' }}>
      <Flex justify="flex-end">
        <Text strong style={{ color: '#2e7d32', fontSize: 15 }}>
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
          borderColor: 'rgba(46,125,50,0.3)',
          margin: '2px 0',
        }}
      />

      <Flex justify="flex-end">
        <Text strong style={{ color: '#1b5e20', fontSize: 22 }}>
          Rs. {total.toFixed(2)}
        </Text>
      </Flex>
{/* Star Button and Payment Method in one line */}
      <Flex justify="space-between" align="center">
        <Button
          size="small"
          icon={isStarred ? <StarFilled /> : <StarOutlined />}
          onClick={handleStarToggle}
          title={isStarred ? 'Unfavorite' : 'Mark Favorite'}
          style={{
            height: 24,
            width: 24,
            padding: 0,
            background: isStarred ? '#faad14' : 'white',
            borderColor: isStarred ? '#faad14' : '#d9d9d9',
            color: isStarred ? 'white' : '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />

        <Radio.Group 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)}
          size="small"
          buttonStyle="solid"
        >
          <Radio value="cash" style={{ fontSize: 11 }}>Cash</Radio>
          <Radio value="online" style={{ fontSize: 11 }}>On</Radio>
        </Radio.Group>
      </Flex>

      {/* Print and Save Buttons */}
      <Row gutter={4}>
        <Col span={12}>
          <Button
            type="default"
            block
            size="small"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            disabled={cart.length === 0}
            style={{
              height: 30,
              background: '#1890ff',
              borderColor: '#1890ff',
              color: 'white',
            }}
          >
            Print
          </Button>
        </Col>
        <Col span={12}>
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
        </Col>
      </Row>
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
        {/* Fixed Alert Container with Table Change, Return and Proceed Buttons */}
       <div style={{ 
  minHeight: 40,
  minWidth: '100%',
  marginBottom: 10, 
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}}>
  
  {/* Alerts - Left Side */}
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {currentSelectedTable && (
      <Tag 
        color="success" 
        closable
        onClose={handleClearTable}
        style={{
          fontSize: 14,
          padding: '6px 12px',
          margin: 0,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <TableOutlined style={{ marginRight: 6 }} />
        {currentSelectedTable.name} ({currentSelectedTable.capacity} seats)
      </Tag>
    )}

    {selectedOrderCustomer && (
      <Tag 
        color="warning"
        closable
        onClose={() => {
          setSelectedOrderCustomer(null);
          setCustomerType('walking');
        }}
        style={{
          fontSize: 14,
          padding: '6px 12px',
          margin: 0,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <ShoppingOutlined style={{ marginRight: 6 }} />
        Order for: {selectedOrderCustomer.name}
      </Tag>
    )}
  </div>

  {/* Table Change, Payment, Return and Proceed Buttons - Right Side */}
  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
    {/* Table Change Button - Only show when table is selected */}
    <Button
  type="default"
  icon={<AppstoreOutlined />}
  onClick={() => setRotiModalVisible(true)}
  style={{
    height: 40,
    fontSize: 13,
    fontWeight: 'bold',
    background: '#fa8c16',
    borderColor: '#fa8c16',
    color: 'white',
  }}
>
  Roti
</Button>
    <Button
      type="default"
      icon={<DollarOutlined />}
      onClick={() => setPaymentModalVisible(true)}
      style={{
        height: 40,
        fontSize: 13,
        fontWeight: 'bold',
        background: '#faad14',
        borderColor: '#faad14',
        color: 'white',
      }}
    >
      Quick payment
    </Button>
    
    <Button
  type="default"
  icon={<DollarOutlined />}
  onClick={() => setExpenseModalVisible(true)}
  style={{
    height: 40,
    fontSize: 13,
    fontWeight: 'bold',
    background: '#722ed1',
    borderColor: '#722ed1',
    color: 'white',
  }}
>
  Payment
</Button>

    <Button
      type="default"
      icon={<RollbackOutlined />}
      onClick={handleReturnOrder}
      style={{
        height: 40,
        fontSize: 13,
        fontWeight: 'bold',
        background: '#ff4d4f',
        borderColor: '#ff4d4f',
        color: 'white',
      }}
    >
      Return
    </Button>
    
    <Button
      type="primary"
      icon={<CheckCircleOutlined />}
      onClick={handleProceedOrder}
      disabled={cart.length === 0}
      style={{
        height: 40,
        fontSize: 13,
        fontWeight: 'bold',
        background: '#52c41a',
        borderColor: '#52c41a',
      }}
    >
      Proceed Order
    </Button>
  </div>

</div>


        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <Row gutter={[10, 10]} align="top" style={{ height: '100%' }}>
          {/* Left Column - Products & Categories */}
          <Col xs={24} lg={16} style={{ height: '100%' }}>
            <Space direction="vertical" size={10} style={{ width: '100%', height: '100%' }}>
              {/* Products Section */}
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
                          background: `linear-gradient(135deg, ${getProductColor(product)}15, ${getProductColor(product)}30)`,
                          borderLeft: `4px solid ${getProductColor(product)}`,
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
                          color={getProductColor(product)} 
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
                  {sortedCategories.map((category) => (
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
                          backgroundColor: selectedCategory === category.id ? 'white' : category.color,
                          borderColor: selectedCategory === category.id ? category.color : category.color,
                          color: selectedCategory === category.id ? category.color : 'white',
                        }}
                      >
                        {category.name}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Card>

              {/* Customer Type Buttons */}
       <Row gutter={[8, 8]} wrap>

  {/* Walking Customer */}
  <Col flex="1">
    <Button
      type={customerType === 'walking' ? 'primary' : 'default'}
      block
      size="large"
      icon={<UserOutlined />}
      style={{ 
        height: 42, 
        fontSize: 12, 
        fontWeight: 600,
        whiteSpace: "nowrap"
      }}
      onClick={() => {
        setCustomerType('walking');
        setSelectedOrderCustomer(null);
        handleClearTable();
      }}
    >
      Walking Customer
    </Button>
  </Col>

  {/* Order Customer */}
  <Col flex="1">
    <Button
      type={customerType === 'order' || selectedOrderCustomer ? 'primary' : 'default'}
      block
      size="large"
      icon={<ShoppingOutlined />}
      style={{ 
        height: 42, 
        fontSize: 12, 
        fontWeight: 600,
        whiteSpace: "nowrap"
      }}
      onClick={handleOrderCustomer}
    >
      {selectedOrderCustomer ? selectedOrderCustomer.name : 'Order Customer'}
    </Button>
  </Col>

  {/* All Tables */}
  <Col flex="1">
    <Button
      type={customerType === 'table' || currentSelectedTable ? 'primary' : 'default'}
      block
      icon={<TableOutlined />}
      style={{
        height: 42,
        fontSize: 12,
        fontWeight: 600,
        background:
          customerType === 'table' || currentSelectedTable
            ? '#52c41a'
            : undefined,
        borderColor:
          customerType === 'table' || currentSelectedTable
            ? '#52c41a'
            : undefined,
        whiteSpace: "nowrap"
      }}
      onClick={() => {
        handleTableCustomer();
        setIsBooked(false);
      }}
    >
      {currentSelectedTable ? currentSelectedTable.name : 'All Tables'}
    </Button>
  </Col>

  {/* Booked Tables */}
  <Col flex="1">
    <Badge count={bookedTables.size}>
      <Button
        block
        icon={<UnorderedListOutlined />}
        disabled={bookedTables.size === 0}
        style={{
          height: 42,
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap"
        }}
        onClick={() => {
          handleBookedTablesList();
          setIsBooked(true);
        }}
      >
        Booked Tables
      </Button>
    </Badge>
  </Col>

  {/* Change Table */}
  <Col flex="1">
    <Button
      block
      icon={<TableOutlined />}
      disabled={!currentSelectedTable}
      style={{
        height: 42,
        fontSize: 12,
        fontWeight: 600,
        background: currentSelectedTable ? '#1890ff' : undefined,
        borderColor: currentSelectedTable ? '#1890ff' : undefined,
        color: currentSelectedTable ? '#fff' : undefined,
        whiteSpace: "nowrap"
      }}
      onClick={() => {
        setTableBookingModalVisible(true);
        setIsBooked(false);
      }}
    >
      Change Table
    </Button>
  </Col>

</Row>



            </Space>
          </Col>

          {/* Right Column - Cart & Calculator */}
          <Col xs={0} lg={8} style={{ height: '100%' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              height: '100%'
            }}>

              {/* Cart Section */}
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
                <div style={{ height: '100%' }}>
                  <Table
                    dataSource={cart}
                    columns={desktopColumns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    scroll={{ y: 400 }}
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

      {/* Order Customer Modal */}
      <OrderCustomerModal
        visible={orderCustomerModalVisible}
        onClose={() => setOrderCustomerModalVisible(false)}
        onSelectCustomer={handleOrderCustomerSelect}
      />

      {/* Table Booking Modal */}
      <Modal
        title={null}
        open={tableBookingModalVisible}
        onCancel={() => setTableBookingModalVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ 
          padding: 0,
          height: '50vh', 
          overflow: 'hidden'
        }}
        maskClosable={true}
      >
        <TableBooking
          initialTables={sortedTables}
          onTableSelect={handleTableSelect}
          onBack={() => setTableBookingModalVisible(false)}
          bookedTables={bookedTables}
          isbooked={isBooked}
        />
      </Modal>

      {/* Proceed Order Modal */}
      <ProceedOrderModal
        visible={proceedOrderModalVisible}
        onClose={() => setProceedOrderModalVisible(false)}
        cart={cart}
        subtotal={subtotal}
        discount={discountAmount}
        total={total}
        currentSelectedTable={currentSelectedTable}
        selectedOrderCustomer={selectedOrderCustomer}
        onConfirm={() => {
          handleSaveOrder();
          setProceedOrderModalVisible(false);
        }}
      />

      {/* Return Order Modal */}
      <ReturnOrderModal
        visible={returnOrderModalVisible}
        onClose={() => setReturnOrderModalVisible(false)}
      />

      {/* Payment Modal */}
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSave={(paymentData) => {
          console.log('Payment saved:', paymentData);
          // Add your payment save logic here
        }}
      />
      {/* Expense Modal */}
<ExpenseModal
  visible={expenseModalVisible}
  onClose={() => setExpenseModalVisible(false)}
/>
{/* Roti Modal */}
<RotiModal
  visible={rotiModalVisible}
  onClose={() => setRotiModalVisible(false)}
/>
    </>
  );
};

export default Sale;