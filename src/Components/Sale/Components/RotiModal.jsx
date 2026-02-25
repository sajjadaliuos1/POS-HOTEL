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

  const quantityOptions1 = [1, 2, 3, 4, 5];
  const quantityOptions2 = [10, 15, 20, 25];

  useEffect(() => {
    if (visible) {
      fetchLastTenOrders();
    }
  }, [visible]);

  const fetchLastTenOrders = async () => {
    try {
      const response = await fetch('/api/roti-orders?limit=10&sort=desc');
      if (response.ok) {
        const orders = await response.json();
        setRotiOrders(orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleQuantityClick = async (quantity) => {
    setSelectedQuantity(quantity);

    const newOrder = {
      id: orderIdCounter,
      quantity: quantity,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/roti-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, timestamp: newOrder.timestamp }),
      });

      if (response.ok) {
        await fetchLastTenOrders();
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      // Silently add to local state
      setRotiOrders(prev => [newOrder, ...prev].slice(0, 10));
      setOrderIdCounter(prev => prev + 1);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/roti-orders/${id}`, { method: 'DELETE' });

      if (response.ok) {
        await fetchLastTenOrders();
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting from database:', error);
      // Silently remove from local state
      setRotiOrders(prev => prev.filter(order => order.id !== id));
    }
  };

  const handlePrintOrder = (record) => {
    const printContent = `
      =============================
      ROTI ORDER RECEIPT
      =============================
      Order ID: ${record.id}
      Quantity: ${record.quantity} Roti
      Time: ${new Date(record.timestamp).toLocaleString()}
      =============================
    `;
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write('<html><head><title>Print Order</title>');
    printWindow.document.write('<style>body { font-family: monospace; padding: 20px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<pre>' + printContent + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintTotal = () => {
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
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Total Roti Summary</title>');
    printWindow.document.write('<style>body { font-family: monospace; padding: 20px; white-space: pre-wrap; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const totalRotis = rotiOrders.reduce((sum, order) => sum + order.quantity, 0);

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
        <Text strong style={{ fontSize: 14 }}>{qty} Roti</Text>
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
            style={{ background: '#1890ff', borderColor: '#1890ff' }}
          >
            Print
          </Button>
          <Popconfirm
            title="Delete this order?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="text" size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
        <Col span={10}>
          <Card
            title={<Text strong style={{ fontSize: 13 }}>Select Quantity</Text>}
            bordered={false}
            bodyStyle={{ padding: 12 }}
            headStyle={{ minHeight: 38, padding: '8px 12px' }}
            style={{ background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)', height: '100%' }}
          >
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {quantityOptions1.map((qty) => (
                  <Button
                    key={qty}
                    size="middle"
                    onClick={() => handleQuantityClick(qty)}
                    style={{
                      flex: 1, height: 45, fontSize: 16, fontWeight: 'bold',
                      background: selectedQuantity === qty ? '#1890ff' : '#fff',
                      borderColor: '#1890ff',
                      color: selectedQuantity === qty ? '#fff' : '#1890ff',
                    }}
                  >
                    {qty}
                  </Button>
                ))}
              </div>

              <Row gutter={[6, 6]}>
                {quantityOptions2.map((qty) => (
                  <Col span={6} key={qty}>
                    <Button
                      block
                      size="middle"
                      onClick={() => handleQuantityClick(qty)}
                      style={{
                        height: 45, fontSize: 16, fontWeight: 'bold',
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

              <Button
                type="primary"
                block
                size="large"
                onClick={handlePrintTotal}
                style={{
                  height: 60, marginTop: 8,
                  background: 'linear-gradient(135deg, #1890ff 0%, #1890ff 100%)',
                  borderColor: '#1890ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 20px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'normal' }}>Total Rotis</Text>
                  <Text strong style={{ color: 'white', fontSize: 24 }}>{totalRotis}</Text>
                </div>
                <PrinterOutlined style={{ fontSize: 24, color: 'white' }} />
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={14}>
          <Card
            title={<Text strong style={{ fontSize: 13 }}>Last 10 Orders</Text>}
            bordered={false}
            bodyStyle={{ padding: 0 }}
            headStyle={{ minHeight: 38, padding: '8px 12px' }}
            style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}
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