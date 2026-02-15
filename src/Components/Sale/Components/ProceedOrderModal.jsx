import React, { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Space,
  Typography,
  Button,
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
  onOrderCompleted, // Add callback to refresh parent state
}) => {
  const [allCustomerOrders, setAllCustomerOrders] = useState([]);
  const [itemStatuses, setItemStatuses] = useState({});
  const [loading, setLoading] = useState(false);

  // Load ALL customer orders when modal opens (not filtered by customer)
  useEffect(() => {
    if (visible) {
      loadAllCustomerOrders();
    }
  }, [visible]);

  const loadAllCustomerOrders = async () => {
    try {
      setLoading(true);
      const pendingOrders = await dbHelper.getPendingCustomerOrders();
      
      // Don't filter - show ALL pending orders
      setAllCustomerOrders(pendingOrders);
      
      // Initialize all items as pending
      const initialStatuses = {};
      pendingOrders.forEach(order => {
        order.items.forEach(item => {
          initialStatuses[`${order.id}-${item.id}`] = item.status || 'pending';
        });
      });
      setItemStatuses(initialStatuses);
      
    } catch (error) {
      console.error('❌ Error loading customer orders:', error);
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Toggle status for an item
  const toggleStatus = async (orderId, item) => {
    const key = `${orderId}-${item.id}`;
    const newStatus = itemStatuses[key] === 'proceed' ? 'pending' : 'proceed';
    
    setItemStatuses(prev => ({
      ...prev,
      [key]: newStatus
    }));

    try {
      await dbHelper.updateCustomerOrderItemStatus(orderId, item.id, newStatus);
      // ❌ REMOVED: message.success
    } catch (error) {
      console.error('❌ Error updating item status:', error);
      message.error('Failed to update status');
    }
  };

  // Handle completing the order
  const handleCompleteOrder = async () => {
    if (allCustomerOrders.length === 0) {
      message.warning('No orders to complete');
      return;
    }

    const loadingMsg = message.loading('Processing orders...', 0);

    try {
      // Process each order
      for (const order of allCustomerOrders) {
        const result = await dbHelper.processProceededItems(order.id);
        
        if (result.success && result.proceededItems.length > 0) {
          // Save the proceeded order to final orders table first (IndexedDB)
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
              phone: order.customerPhone
            },
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            synced: false,
          };

          // ✅ STEP 1: Save to IndexedDB first
          if (!dbHelper.db) {
            await dbHelper.initDB();
          }

          const transaction = dbHelper.db.transaction(['orders'], 'readwrite');
          const store = transaction.objectStore('orders');
          
          await new Promise((resolve, reject) => {
            const addRequest = store.add(finalOrder);
            
            addRequest.onsuccess = async () => {
              const localId = addRequest.result;
              console.log('✅ Order saved to IndexedDB:', localId);
              
              // ✅ STEP 2: Try to sync to backend
              try {
                const apiResult = await dbHelper.sendOrderToBackend({
                  ...finalOrder,
                  localId,
                });
                
                if (apiResult.success) {
                  // Mark as synced in IndexedDB
                  const getRequest = store.get(localId);
                  
                  getRequest.onsuccess = () => {
                    const savedOrder = getRequest.result;
                    savedOrder.synced = true;
                    savedOrder.syncedAt = new Date().toISOString();
                    savedOrder.backendId = apiResult.data?.id || null;
                    store.put(savedOrder);
                    
                    console.log('✅ Order synced to backend:', apiResult.data?.id);
                  };
                }
              } catch (apiError) {
                console.warn('⚠️ Backend sync failed, order saved locally:', apiError);
              }
              
              resolve(localId);
            };
            
            addRequest.onerror = () => reject(addRequest.error);
          });

          // Delete the customer order after processing
          await dbHelper.deleteCustomerOrder(order.id);
        }
      }

      loadingMsg();
      
      notification.success({
        message: '✅ Orders Completed!',
        description: 'All proceeded items have been saved to database.',
        duration: 3,
      });

      // Reload orders after completion
      if (onOrderCompleted) {
        onOrderCompleted();
      }

      onClose();
      
    } catch (error) {
      loadingMsg();
      console.error('❌ Error completing orders:', error);
      notification.error({
        message: 'Order Failed',
        description: 'Could not complete the orders. Please try again.',
        duration: 3,
      });
    }
  };

  // Prepare data for table
  const tableData = [];
  allCustomerOrders.forEach(order => {
    order.items.forEach(item => {
      const key = `${order.id}-${item.id}`;
      tableData.push({
        ...item,
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        key,
        status: itemStatuses[key] || item.status || 'pending',
      });
    });
  });

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
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Phone',
      dataIndex: 'customerPhone',
      key: 'phone',
      width: 130,
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
        const status = record.status;
        return (
          <Button
            size="small"
            icon={status === 'proceed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            type={status === 'proceed' ? 'primary' : 'default'}
            onClick={async () => {
              // Toggle status
              await toggleStatus(record.orderId, record);
              
              // If changed to proceed, auto-complete the order
              if (status === 'pending') {
                // Wait a bit for state to update
                setTimeout(async () => {
                  await handleCompleteOrder();
                }, 300);
              }
            }}
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

  return (
    <Modal
      title={
        <Text strong style={{ fontSize: 18 }}>
          Customer Orders - All Pending Orders
        </Text>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
      bodyStyle={{ 
        padding: 16,
        height: '70vh',
        overflowY: 'auto'
      }}
      maskClosable={true}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {tableData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">
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
      </Space>
    </Modal>
  );
};

export default ProceedOrderModal;