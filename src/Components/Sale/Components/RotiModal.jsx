import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Row,
  Col,
  Card,
  Table,
  Typography,
  Space,
  message,
  Popconfirm,
} from 'antd';
import {
  DeleteOutlined,
  PrinterOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const RotiModal = ({ visible, onClose }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [rotiOrders, setRotiOrders] = useState([]);
  const [orderIdCounter, setOrderIdCounter] = useState(1);

  // Quantity options
  const quantityOptions1 = [1, 2, 3, 4, 5];
  const quantityOptions2 = [10, 15, 20, 25];

  // Fetch last 10 records from database on modal open
  useEffect(() => {
    if (visible) {
      fetchLastTenOrders();
    }
  }, [visible]);

  // Fetch last 10 orders from database
  const fetchLastTenOrders = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/roti-orders?limit=10&sort=desc');
      
      if (response.ok) {
        const orders = await response.json();
        setRotiOrders(orders);
        console.log('Fetched last 10 orders from database:', orders);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.warning('Failed to load orders from database');
    }
  };

  // Handle quantity button click and save to database
  const handleQuantityClick = async (quantity) => {
    setSelectedQuantity(quantity);
    
    // Create new order
    const newOrder = {
      id: orderIdCounter,
      quantity: quantity,
      timestamp: new Date().toISOString(),
    };
    
    try {
      // Save to database - Replace with your actual API endpoint
      const response = await fetch('/api/roti-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: quantity,
          timestamp: newOrder.timestamp,
        }),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        
        // Refresh list to show updated last 10 records
        await fetchLastTenOrders();
        
        message.success(`${quantity} Roti added and saved to database`);
        console.log('Order saved to database:', savedOrder);
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      
      // Fallback: Add to local state even if database save fails
      setRotiOrders([newOrder, ...rotiOrders].slice(0, 10));
      setOrderIdCounter(orderIdCounter + 1);
      
      message.warning(`${quantity} Roti added locally (database save failed)`);
    }
  };

  // Handle delete order and remove from database
  const handleDelete = async (id) => {
    try {
      // Delete from database - Replace with your actual API endpoint
      const response = await fetch(`/api/roti-orders/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh list to show updated last 10 records
        await fetchLastTenOrders();
        
        message.success('Order deleted from database');
        console.log('Order deleted from database:', id);
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting from database:', error);
      
      // Fallback: Remove from local state even if database delete fails
      setRotiOrders(rotiOrders.filter(order => order.id !== id));
      message.warning('Order deleted locally (database delete failed)');
    }
  };

  // Handle print single order
  const handlePrintOrder = (record) => {
    console.log('Printing order:', record);
    
    // Create print content
    const printContent = `
      =============================
      ROTI ORDER RECEIPT
      =============================
      Order ID: ${record.id}
      Quantity: ${record.quantity} Roti
      Time: ${new Date(record.timestamp).toLocaleString()}
      =============================
    `;
    
    // Print logic - You can customize this
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write('<html><head><title>Print Order</title>');
    printWindow.document.write('<style>body { font-family: monospace; padding: 20px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<pre>' + printContent + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    
    message.success('Order sent to printer');
  };

  // Handle print total rotis
  const handlePrintTotal = () => {
    console.log('Printing total rotis:', totalRotis);
    
    // Create print content for total
    const printContent = `
      =============================
      TOTAL ROTI SUMMARY
      =============================
      Total Orders: ${rotiOrders.length}
      Total Rotis: ${totalRotis}
      Date: ${new Date().toLocaleString()}
      =============================
      
      ORDER DETAILS:
      ${rotiOrders.map((order, index) => `
      ${index + 1}. Order #${order.id} - ${order.quantity} Roti
         Time: ${new Date(order.timestamp).toLocaleString()}
      `).join('\n')}
      =============================
    `;
    
    // Print logic
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Total Roti Summary</title>');
    printWindow.document.write('<style>body { font-family: monospace; padding: 20px; white-space: pre-wrap; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    
    message.success('Total summary sent to printer');
  };

  // Calculate total rotis
  const totalRotis = rotiOrders.reduce((sum, order) => sum + order.quantity, 0);

  // Table columns
  const columns = [
    {
      title: '#',
      key: 'index',
      width: '15%',
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '45%',
      align: 'center',
      render: (qty) => (
        <Text strong style={{ fontSize: 14 }}>
          {qty} Roti
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '40%',
      align: 'center',
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="primary"
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => handlePrintOrder(record)}
            style={{
              background: '#1890ff',
              borderColor: '#1890ff',
            }}
          >
            Print
          </Button>
          
          <Popconfirm
            title="Delete this order?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              type="text"
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle modal close
  const handleClose = () => {
    setSelectedQuantity(null);
    onClose();
  };

  return (
    <Modal
      title="Roti Orders"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      centered
      maskClosable={true}
      bodyStyle={{ padding: '16px' }}
    >
      <Row gutter={16}>
        {/* Left Section - Quantity Buttons */}
        <Col span={10}>
          <Card
            title={<Text strong style={{ fontSize: 13 }}>Select Quantity</Text>}
            bordered={false}
            bodyStyle={{ padding: 12 }}
            headStyle={{ minHeight: 38, padding: '8px 12px' }}
            style={{
             background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
              height: '100%',
            }}
          >
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              {/* First Row - 1,2,3,4,5 in ONE LINE */}
              <div style={{ display: 'flex', gap: 6 }}>
                {quantityOptions1.map((qty) => (
                  <Button
                    key={qty}
                    size="middle"
                    onClick={() => handleQuantityClick(qty)}
                    style={{
                      flex: 1,
                      height: 45,
                      fontSize: 16,
                      fontWeight: 'bold',
                      background: selectedQuantity === qty ? '#1890ff' : '#fff',
                      borderColor: '#1890ff',
                      color: selectedQuantity === qty ? '#fff' : '#1890ff',
                    }}
                  >
                    {qty}
                  </Button>
                ))}
              </div>

              {/* Second Row - 10,15,20,25 */}
              <Row gutter={[6, 6]}>
                {quantityOptions2.map((qty) => (
                  <Col span={6} key={qty}>
                    <Button
                      block
                      size="middle"
                      onClick={() => handleQuantityClick(qty)}
                      style={{
                        height: 45,
                        fontSize: 16,
                        fontWeight: 'bold',
                        background: selectedQuantity === qty ? '#52c41a' : '#fff',
                        borderColor: '#52c41a',
                        color: selectedQuantity === qty ? '#fff' : '#52c41a',
                      }}
                    >
                      {qty}
                    </Button>
                  </Col>
                ))}
              </Row>

             
          {/* Total Rotis Button - Print icon on right */}
<Button
  type="primary"
  block
  size="large"
  onClick={handlePrintTotal}
  style={{
    height: 60,
    marginTop: 8,
    background: 'linear-gradient(135deg, #1890ff 0%, #1890ff 100%)',
    borderColor:'#1890ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
  }}
>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'normal' }}>
      Total Rotis
    </Text>
    <Text strong style={{ color: 'white', fontSize: 24 }}>
      {totalRotis}
    </Text>
  </div>
  
  <PrinterOutlined style={{ fontSize: 24, color: 'white' }} />
</Button>
            </Space>
          </Card>
        </Col>

        {/* Right Section - Orders List (Last 10 Records) */}
        <Col span={14}>
          <Card
            title={<Text strong style={{ fontSize: 13 }}>Last 10 Orders</Text>}
            bordered={false}
            bodyStyle={{ padding: 0 }}
            headStyle={{ minHeight: 38, padding: '8px 12px' }}
            style={{
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            }}
          >
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <Table
                dataSource={rotiOrders}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{ emptyText: 'No orders yet' }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default RotiModal;