import React, { useState } from 'react';
import {
  Modal,
  Table,
  Space,
  Typography,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

const { Text } = Typography;

const ProceedOrderModal = ({
  visible,
  onClose,
  cart,
  subtotal,
  discount,
  total,
  currentSelectedTable,
  selectedOrderCustomer,
  onConfirm,
}) => {
  // State to track status for each item
  const [itemStatuses, setItemStatuses] = useState({});

  // Toggle status for an item
  const toggleStatus = (itemId) => {
    setItemStatuses(prev => ({
      ...prev,
      [itemId]: prev[itemId] === 'proceed' ? 'pending' : 'proceed'
    }));
  };

  // Columns for order items table
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 80,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => `Rs. ${price}`,
    },
    {
      title: 'Total',
      key: 'total',
      width: 100,
      render: (_, record) => `Rs. ${record.price * record.quantity}`,
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const status = itemStatuses[record.id] || 'pending';
        return (
          <Button
            size="small"
            icon={status === 'proceed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            type={status === 'proceed' ? 'primary' : 'default'}
            onClick={() => toggleStatus(record.id)}
            style={{
              background: status === 'proceed' ? '#52c41a' : '#faad14',
              borderColor: status === 'proceed' ? '#52c41a' : '#faad14',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {status === 'proceed' ? 'Proceed' : 'Pending'}
          </Button>
        );
      },
    },
  ];

  // Prepare cart data with customer and table info
  const cartDataWithInfo = cart.map(item => ({
    ...item,
    customer: selectedOrderCustomer?.name || 'N/A',
    phone: selectedOrderCustomer?.phone || 'N/A',
    tableNumber: currentSelectedTable?.number || 'N/A',
    tableCapacity: currentSelectedTable?.capacity || 'N/A',
  }));

  // Add table and customer columns
  const finalColumns = [
    ...columns.slice(0, 1), // #
    ...(currentSelectedTable ? [
      {
        title: 'Table',
        key: 'table',
        width: 120,
        render: (_, record) => `Table ${record.tableNumber} (${record.tableCapacity} seats)`,
      },
    ] : []),
    ...(selectedOrderCustomer ? [
      {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        width: 120,
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: 130,
      },
    ] : []),
    ...columns.slice(1), // Rest of columns
  ];

  return (
    <Modal
      title={
        <Text strong style={{ fontSize: 18 }}>
          Order Details
        </Text>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      style={{ top: 20 }}
      bodyStyle={{ 
        padding: 0,
        height: '50vh', 
        overflowY: 'auto'
      }}
      maskClosable={true}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {/* Order Items Table */}
        <Table
          dataSource={cartDataWithInfo}
          columns={finalColumns}
          pagination={false}
          size="small"
          rowKey="id"
          bordered
        />
      </Space>
    </Modal>
  );
};

export default ProceedOrderModal;