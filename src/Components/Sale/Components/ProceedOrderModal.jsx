import React, { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Space,
  Typography,
  Button,
  Tag,
  message,
  notification,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dbHelper from '../../Helpers/indexedDBHelper';

const { Text } = Typography;

const ProceedOrderModal = ({
  visible,
  onClose,
  onOrderCompleted,
}) => {
  const [allCustomerOrders, setAllCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadAllCustomerOrders();
    }
  }, [visible]);

  const loadAllCustomerOrders = async () => {
    try {
      setLoading(true);
      const pendingOrders = await dbHelper.getPendingCustomerOrders();
      setAllCustomerOrders(pendingOrders);
    } catch (error) {
      console.error('❌ Error loading customer orders:', error);
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Complete a single customer's order
  const handleProceedCustomer = async (order) => {
    const loadingMsg = message.loading('Processing...', 0);

    try {
      // Mark all items as proceed
      for (const item of order.items) {
        await dbHelper.updateCustomerOrderItemStatus(order.id, item.id, 'proceed');
      }

      const result = await dbHelper.processProceededItems(order.id);

      if (result.success && result.proceededItems.length > 0) {
        const finalOrder = {
          tableId: `CUSTOMER-${order.customerId}-${Date.now()}`,
          tableName: `Customer: ${order.customerName}`,
          items: result.proceededItems,
          subtotal: result.proceededTotal,
          discount: 0,
          total: result.proceededTotal,
          customerType: 'order',
          paymentMethod: 'cash',
          isStarred: false,
          customerInfo: {
            id: order.customerId,
            name: order.customerName,
            phone: order.customerPhone,
          },
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          synced: false,
        };

        if (!dbHelper.db) await dbHelper.initDB();

        const transaction = dbHelper.db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');

        await new Promise((resolve, reject) => {
          const addRequest = store.add(finalOrder);
          addRequest.onsuccess = async () => {
            const localId = addRequest.result;
            try {
              const apiResult = await dbHelper.sendOrderToBackend({ ...finalOrder, localId });
              if (apiResult.success) {
                const getRequest = store.get(localId);
                getRequest.onsuccess = () => {
                  const saved = getRequest.result;
                  saved.synced = true;
                  saved.syncedAt = new Date().toISOString();
                  saved.backendId = apiResult.data?.id || null;
                  store.put(saved);
                };
              }
            } catch (e) {
              console.warn('⚠️ Backend sync failed:', e);
            }
            resolve(localId);
          };
          addRequest.onerror = () => reject(addRequest.error);
        });

        await dbHelper.deleteCustomerOrder(order.id);
      }

      loadingMsg();

      notification.success({
        message: '✅ Order Proceeded!',
        description: `${order.customerName} ka order complete ho gaya.`,
        duration: 2,
      });

      // Reload orders list
      await loadAllCustomerOrders();

      if (onOrderCompleted) onOrderCompleted();

      // Close modal if no more orders
      if (allCustomerOrders.length <= 1) onClose();

    } catch (error) {
      loadingMsg();
      console.error('❌ Error:', error);
      notification.error({
        message: 'Failed',
        description: 'Order proceed nahi hua. Please retry.',
        duration: 3,
      });
    }
  };

  // Group orders by customer — one row per customer
  const tableData = allCustomerOrders.map((order) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      key: order.id,
      orderId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      items: order.items,
      itemsTotal,
      order, // full order object for proceed handler
    };
  });

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 45,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customer',
      width: 140,
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Phone',
      dataIndex: 'customerPhone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record) => (
        <Space direction="vertical" size={3}>
          {record.items.map((item, idx) => (
            <Text key={idx} style={{ fontSize: 12 }}>
              • {item.name} × {item.quantity}{' '}
              <Text type="secondary" style={{ fontSize: 11 }}>
                (Rs. {item.price * item.quantity})
              </Text>
            </Text>
          ))}
        </Space>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: 110,
      align: 'right',
      render: (_, record) => (
        <Text strong style={{ color: '#52c41a', fontSize: 14 }}>
          Rs. {record.itemsTotal}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button
          size="middle"
          icon={<CheckCircleOutlined />}
          onClick={() => handleProceedCustomer(record.order)}
          style={{
            background: '#52c41a',
            borderColor: '#52c41a',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Proceed
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Text strong style={{ fontSize: 18 }}>
          Customer Orders — Pending
        </Text>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
      bodyStyle={{
        padding: 16,
        height: '70vh',
        overflowY: 'auto',
      }}
      maskClosable={true}
    >
      {tableData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Text type="secondary" style={{ fontSize: 15 }}>
            No pending customer orders found
          </Text>
        </div>
      ) : (
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={false}
          size="small"
          bordered
          loading={loading}
          scroll={{ y: 'calc(70vh - 120px)' }}
        />
      )}
    </Modal>
  );
};

export default ProceedOrderModal;