import React, { useState } from 'react';
import {
  Modal,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Divider,
  Checkbox,
  InputNumber,
  Input,
} from 'antd';
import {
  RollbackOutlined,
  CheckCircleOutlined,
  PartitionOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;

// Sample orders data - Replace with actual data from your backend/state
const sampleOrders = [
  {
    id: 1,
    customerName: 'Walking Customer',
    customerType: 'walking',
    tableName: null,
    items: [
      { id: 1, name: 'Chicken Biryani', price: 350, quantity: 2 },
      { id: 2, name: 'Coca Cola', price: 80, quantity: 1 },
    ],
    subtotal: 780,
    discount: 0,
    total: 780,
    status: 'completed',
  },
  {
    id: 2,
    customerName: 'Ali Khan',
    customerType: 'order',
    tableName: null,
    items: [
      { id: 3, name: 'Zinger Burger', price: 250, quantity: 3 },
      { id: 4, name: 'Fresh Juice', price: 150, quantity: 2 },
    ],
    subtotal: 1050,
    discount: 50,
    total: 1000,
    status: 'completed',
  },
  {
    id: 3,
    customerName: 'Table Customer',
    customerType: 'table',
    tableName: 'Garden',
    items: [
      { id: 5, name: 'BBQ Chicken', price: 400, quantity: 1 },
      { id: 6, name: 'Seekh Kabab', price: 350, quantity: 2 },
    ],
    subtotal: 1100,
    discount: 100,
    total: 1000,
    status: 'completed',
  },
  {
    id: 4,
    customerName: 'Ahmed Hassan',
    customerType: 'order',
    tableName: null,
    items: [
      { id: 7, name: 'Mutton Biryani', price: 450, quantity: 1 },
      { id: 8, name: 'Pepsi', price: 80, quantity: 2 },
    ],
    subtotal: 610,
    discount: 10,
    total: 600,
    status: 'completed',
  },
  {
    id: 5,
    customerName: 'Table Customer',
    customerType: 'table',
    tableName: 'Rooftop',
    items: [
      { id: 9, name: 'Chicken Chow Mein', price: 300, quantity: 2 },
      { id: 10, name: 'Spring Rolls', price: 150, quantity: 3 },
    ],
    subtotal: 1050,
    discount: 0,
    total: 1050,

    status: 'completed',
  },
  {
    id: 6,
    customerName: 'Sara Malik',
    customerType: 'order',
    tableName: null,
    items: [
      { id: 11, name: 'Beef Burger', price: 280, quantity: 2 },
      { id: 12, name: 'Fresh Juice', price: 150, quantity: 1 },
    ],
    subtotal: 710,
    discount: 60,
    total: 650,
      status: 'completed',
  },
  {
    id: 7,
    customerName: 'Walking Customer',
    customerType: 'walking',
    tableName: null,
    items: [
      { id: 13, name: 'Chocolate Cake', price: 200, quantity: 1 },
      { id: 14, name: 'Ice Cream', price: 120, quantity: 2 },
    ],
    subtotal: 440,
    discount: 0,
    total: 440,
     status: 'completed',
  },
  {
    id: 8,
    customerName: 'Table Customer',
    customerType: 'table',
    tableName: 'VIP Lounge',
    items: [
      { id: 15, name: 'BBQ Chicken', price: 400, quantity: 2 },
      { id: 16, name: 'Seekh Kabab', price: 350, quantity: 1 },
      { id: 17, name: 'Coca Cola', price: 80, quantity: 3 },
    ],
    subtotal: 1390,
    discount: 90,
    total: 1300,
      status: 'completed',
  },
  {
    id: 9,
    customerName: 'Usman Ali',
    customerType: 'order',
    tableName: null,
    items: [
      { id: 18, name: 'Fried Rice', price: 250, quantity: 2 },
      { id: 19, name: 'Chicken Burger', price: 200, quantity: 1 },
    ],
    subtotal: 700,
    discount: 0,
    total: 700,
       status: 'completed',
  },
  {
    id: 10,
    customerName: 'Walking Customer',
    customerType: 'walking',
    tableName: null,
    items: [
      { id: 20, name: 'Zinger Burger', price: 250, quantity: 1 },
      { id: 21, name: 'Pepsi', price: 80, quantity: 1 },
    ],
    subtotal: 330,
    discount: 30,
    total: 300,
    status: 'completed',
  },
  {
    id: 11,
    customerName: 'Fatima Sheikh',
    customerType: 'order',
    tableName: null,
    items: [
      { id: 22, name: 'Chicken Biryani', price: 350, quantity: 1 },
      { id: 23, name: 'Fresh Juice', price: 150, quantity: 1 },
    ],
    subtotal: 500,
    discount: 0,
    total: 500,
        status: 'completed',
  },
  {
    id: 12,
    customerName: 'Table Customer',
    customerType: 'table',
    tableName: 'Corner Table',
    items: [
      { id: 24, name: 'BBQ Chicken', price: 400, quantity: 1 },
      { id: 25, name: 'Fried Rice', price: 250, quantity: 1 },
      { id: 26, name: 'Pepsi', price: 80, quantity: 2 },
    ],
    subtotal: 810,
    discount: 10,
    total: 800,
      status: 'completed',
  },
];

const ReturnOrderConfirmationModal = ({ visible, onClose, order, returnType, onConfirm }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnQuantities, setReturnQuantities] = useState({});

  // Reset state when modal opens/closes or order changes
  React.useEffect(() => {
    if (visible && order) {
      if (returnType === 'complete') {
        // For complete return, select all items with full quantities
        setSelectedItems(order.items.map(item => item.id));
        const quantities = {};
        order.items.forEach(item => {
          quantities[item.id] = item.quantity;
        });
        setReturnQuantities(quantities);
      } else {
        // For partial return, reset selections
        setSelectedItems([]);
        setReturnQuantities({});
      }
    }
  }, [visible, order, returnType]);

  const handleItemSelect = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
      // Set default quantity to 1 when item is selected
      const item = order.items.find(i => i.id === itemId);
      setReturnQuantities({ ...returnQuantities, [itemId]: 1 });
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
      const newQuantities = { ...returnQuantities };
      delete newQuantities[itemId];
      setReturnQuantities(newQuantities);
    }
  };

  const handleQuantityChange = (itemId, value) => {
    setReturnQuantities({ ...returnQuantities, [itemId]: value || 0 });
  };

  const calculateReturnTotal = () => {
    let total = 0;
    selectedItems.forEach(itemId => {
      const item = order.items.find(i => i.id === itemId);
      const quantity = returnQuantities[itemId] || 0;
      if (item) {
        total += item.price * quantity;
      }
    });
    return total;
  };

  const handleConfirmReturn = () => {
    const returnData = {
      order,
      returnType,
      returnedItems: selectedItems.map(itemId => {
        const item = order.items.find(i => i.id === itemId);
        return {
          ...item,
          returnQuantity: returnQuantities[itemId],
        };
      }),
      returnTotal: returnType === 'complete' ? order.total : calculateReturnTotal(),
    };

    // Show Yes/No confirmation alert
    confirm({
      title: 'Confirm Return',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <Text>Are you sure you want to process this return?</Text>
          <div style={{ marginTop: 12, padding: 12, background: '#fff1f0', borderRadius: 4 }}>
            <Text strong style={{ color: '#ff4d4f' }}>
              Return Amount: Rs. {returnData.returnTotal}
            </Text>
          </div>
        </div>
      ),
      okText: 'Yes, Confirm',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk() {
        onConfirm(returnData);
        onClose();
      },
      onCancel() {
        // Do nothing - keep the modal open
      },
    });
  };

  // Items table columns for Complete Return
  const completeReturnColumns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '20%',
      align: 'right',
      render: (price) => <Text>Rs. {price}</Text>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '20%',
      align: 'center',
    },
    {
      title: 'Total',
      key: 'total',
      width: '20%',
      align: 'right',
      render: (_, record) => (
        <Text strong>Rs. {record.price * record.quantity}</Text>
      ),
    },
  ];

  // Items table columns for Partial Return
  const partialReturnColumns = [
    {
      title: 'Select',
      key: 'select',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={selectedItems.includes(record.id)}
          onChange={(e) => handleItemSelect(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      align: 'right',
      render: (price) => <Text>Rs. {price}</Text>,
    },
    {
      title: 'Ordered',
      dataIndex: 'quantity',
      key: 'ordered',
      width: '12%',
      align: 'center',
    },
    {
      title: 'Return Qty',
      key: 'returnQty',
      width: '18%',
      align: 'center',
      render: (_, record) => (
        <InputNumber
          min={0}
          max={record.quantity}
          value={returnQuantities[record.id] || 0}
          onChange={(value) => handleQuantityChange(record.id, value)}
          disabled={!selectedItems.includes(record.id)}
          size="small"
          style={{ width: 70 }}
        />
      ),
    },
    {
      title: 'Return Total',
      key: 'returnTotal',
      width: '15%',
      align: 'right',
      render: (_, record) => {
        const returnQty = returnQuantities[record.id] || 0;
        return (
          <Text strong style={{ color: selectedItems.includes(record.id) ? '#ff4d4f' : '#999' }}>
            Rs. {record.price * returnQty}
          </Text>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <RollbackOutlined style={{ color: '#ff4d4f' }} />
          <Text strong>
            {returnType === 'complete' ? 'Complete Order Return' : 'Partial Order Return'}
          </Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          icon={<RollbackOutlined />}
          onClick={handleConfirmReturn}
          disabled={returnType === 'partial' && selectedItems.length === 0}
        >
          Confirm Return
        </Button>,
      ]}
      width={700}
    >
      {order && (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Text strong>Customer: </Text>
            <Text>{order.customerName}</Text>
            {order.tableName && <Tag color="green" style={{ marginLeft: 8 }}>{order.tableName}</Tag>}
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <div>
            <Text strong style={{ display: 'block', marginBottom: 12 }}>Order Items:</Text>
            <Table
              dataSource={order.items}
              columns={returnType === 'complete' ? completeReturnColumns : partialReturnColumns}
              rowKey="id"
              pagination={false}
              size="small"
              bordered
            />
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Order Subtotal:</Text>
              <Text strong>Rs. {order.subtotal}</Text>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Order Discount:</Text>
                <Text strong>- Rs. {order.discount}</Text>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Order Total:</Text>
              <Text strong>Rs. {order.total}</Text>
            </div>

            {returnType === 'partial' && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>Return Amount:</Text>
                  <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>Rs. {calculateReturnTotal()}</Text>
                </div>
              </>
            )}
          </Space>
        </Space>
      )}
    </Modal>
  );
};

const ReturnOrderModal = ({ visible, onClose }) => {
  const [orders] = useState(sampleOrders);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnType, setReturnType] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleReturnClick = (order, type) => {
    setSelectedOrder(order);
    setReturnType(type);
    setConfirmModalVisible(true);
  };

  const handleConfirmReturn = (returnData) => {
    console.log('Return confirmed:', returnData);
    
    if (returnData.returnType === 'complete') {
      message.success(`Complete order returned successfully! Amount: Rs. ${returnData.order.total}`);
    } else {
      message.success(`Partial return processed successfully! Amount: Rs. ${returnData.returnTotal}`);
    }
    
    // Add your return logic here (API call, state update, etc.)
  };

  // Filter orders based on search text
  const filteredOrders = orders.filter(order => {
    const searchLower = searchText.toLowerCase();
    
    // Search by customer name
    const matchesCustomer = order.customerName.toLowerCase().includes(searchLower);
    
    // Search by table name
    const matchesTable = order.tableName?.toLowerCase().includes(searchLower);
    
    // Search by item names
    const matchesItems = order.items.some(item => 
      item.name.toLowerCase().includes(searchLower)
    );
    
    // Search by total amount
    const matchesTotal = order.total.toString().includes(searchText);
    
    return matchesCustomer || matchesTable || matchesItems || matchesTotal;
  });

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.customerName}</Text>
          {record.tableName && (
            <Tag color="green" style={{ marginTop: 4 }}>
              {record.tableName}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 220,
      render: (items) => (
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ fontSize: 12 }}>
              {item.quantity} x {item.name}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: (total, record) => (
        <Space direction="vertical" size={0}>
          {record.discount > 0 && (
            <Text delete type="secondary" style={{ fontSize: 11 }}>
              Rs. {record.subtotal}
            </Text>
          )}
          <Text strong style={{ fontSize: 14 }}>
            Rs. {total}
          </Text>
        </Space>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      width: 170,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleReturnClick(record, 'complete')}
            style={{
              background: '#ff4d4f',
              borderColor: '#ff4d4f',
              fontSize: 11,
            }}
          >
            Complete
          </Button>
          <Button
            type="default"
            size="small"
            icon={<PartitionOutlined />}
            onClick={() => handleReturnClick(record, 'partial')}
            style={{
              fontSize: 11,
            }}
          >
            Partial
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <Space>
            <RollbackOutlined style={{ color: '#ff4d4f' }} />
            <Text strong>Return Orders</Text>
          </Space>
        }
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
        ]}
        width={850}
        style={{ top: 20 }}
        bodyStyle={{
          padding: 0,
        }}
      >
        {/* Search Field - Smaller */}
        <div style={{ padding: '12px 16px 0 16px' }}>
          <Input
            placeholder="Search by customer, table, items, or amount..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="middle"
            style={{ marginBottom: 12 }}
          />
        </div>

        {/* Orders Table with Scroll */}
        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey="id"
            pagination={false}
            scroll={{ x: 750 }}
            size="small"
            locale={{
              emptyText: searchText ? 'No orders found matching your search' : 'No orders available'
            }}
          />
        </div>

        {/* Results Counter */}
        {searchText && (
          <div style={{ 
            padding: '8px 16px', 
            borderTop: '1px solid #f0f0f0',
            background: '#fafafa',
            textAlign: 'center'
          }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Showing {filteredOrders.length} of {orders.length} orders
            </Text>
          </div>
        )}
      </Modal>

      <ReturnOrderConfirmationModal
        visible={confirmModalVisible}
        onClose={() => {
          setConfirmModalVisible(false);
          setSelectedOrder(null);
          setReturnType(null);
        }}
        order={selectedOrder}
        returnType={returnType}
        onConfirm={handleConfirmReturn}
      />
    </>
  );
};

export default ReturnOrderModal;