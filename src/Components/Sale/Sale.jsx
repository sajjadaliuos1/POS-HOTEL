import React, { useState, useEffect, useMemo } from 'react';
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
  notification,
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
  DatabaseOutlined,
  ClearOutlined,
} from '@ant-design/icons';

import TableBooking from './Components/TablebookingModal.jsx';
import ProceedOrderModal from './Components/ProceedOrderModal';
import ReturnOrderModal from './Components/Returnordermodal.jsx';
import PaymentModal from './Components/PaymentModal.jsx';
import RotiModal from './Components/RotiModal';
import OrderCustomerModal from './Components/Ordercustomermodal.jsx';
import ExpenseModal from '../Expenses/ExpenseModal.jsx';
import dbHelper from '../Helpers/indexedDBHelper.js';

const { Text } = Typography;

const initialCategories = [
  { id: 1, name: 'Fast Food', color: '#ff4d4f', orderBy: 1 },
  { id: 2, name: 'Biryani', color: '#52c41a', orderBy: 2 },
  { id: 3, name: 'Chinese', color: '#1890ff', orderBy: 3 },
  { id: 4, name: 'Beverages', color: '#faad14', orderBy: 4 },
  { id: 5, name: 'Desserts', color: '#eb2f96', orderBy: 5 },
  { id: 6, name: 'BBQ', color: '#722ed1', orderBy: 6 },
];

const initialProducts = [
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
];

const initialTables = [
  { id: 1, name: 'Baramdaa', capacity: 2, status: 'available', bookedBy: null, color: '#faad14', orderBy: 1 },
  { id: 2, name: 'Garden', capacity: 4, status: 'available', bookedBy: null, color: '#ff4d4f', orderBy: 2 },
  { id: 3, name: 'Rooftop', capacity: 4, status: 'available', bookedBy: null, color: '#52c41a', orderBy: 3 },
  { id: 4, name: 'VIP Lounge', capacity: 6, status: 'available', bookedBy: null, color: '#1890ff', orderBy: 4 },
  { id: 5, name: 'Corner Table', capacity: 2, status: 'available', bookedBy: null, color: '#eb2f96', orderBy: 5 },
  { id: 6, name: 'Main Hall', capacity: 8, status: 'available', bookedBy: null, color: '#722ed1', orderBy: 6 },
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
  const [activeTableOrders, setActiveTableOrders] = useState(new Map());
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [hasPendingCustomerOrders, setHasPendingCustomerOrders] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const currentSelectedTable = selectedTable || internalSelectedTable;
  
  // ✅ FIX: Calculate booked tables count using useMemo to ensure it updates properly
  const bookedTablesCount = useMemo(() => bookedTables.size, [bookedTables]);

  // ✅ Auto-save and clear when clicking outside product area
  const handleAutoSaveAndClear = async () => {
    if (currentSelectedTable && cart.length > 0) {
      // Already saved via handleProductClick, just clear UI
      setCart([]);
      setDiscount('0');
      setCalculatorDisplay('');
      setInternalSelectedTable(null);
    } else if (selectedOrderCustomer && cart.length > 0) {
      // Save customer order and clear
      try {
        await dbHelper.addToCustomerOrder(selectedOrderCustomer, cart);
        setCart([]);
        setDiscount('0');
        setCalculatorDisplay('');
      } catch (error) {
        console.error('Error saving customer order:', error);
      }
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🔄 Initializing app...');
        
        // Initialize database
        await dbHelper.initDB();
        console.log('✅ Database initialized');

        // Load or initialize tables
        let cachedTables = await dbHelper.getTables();
        console.log('📊 Tables loaded:', cachedTables.length);
        
        if (cachedTables.length === 0) {
          console.log('💾 Saving initial tables...');
          await dbHelper.saveTables(initialTables);
          cachedTables = initialTables;
        }
        setTables(cachedTables);

        // Load or initialize categories
        let cachedCategories = await dbHelper.getCategories();
        console.log('📂 Categories loaded:', cachedCategories.length);
        
        if (cachedCategories.length === 0) {
          console.log('💾 Saving initial categories...');
          await dbHelper.saveCategories(initialCategories);
          cachedCategories = initialCategories;
        }
        setCategories(cachedCategories);

        // Load or initialize products
        let cachedProducts = await dbHelper.getProducts();
        console.log('🍔 Products loaded:', cachedProducts.length);
        
        if (cachedProducts.length === 0) {
          console.log('💾 Saving initial products...');
          await dbHelper.saveProducts(initialProducts);
          cachedProducts = initialProducts;
        }
        setProducts(cachedProducts);

        // Load table orders
        const tableOrders = await dbHelper.getAllTableOrders();
        console.log('📋 Table orders loaded:', tableOrders.length);
        
        const ordersMap = new Map();
        tableOrders.forEach(order => {
          ordersMap.set(order.tableId, order);
        });
        setActiveTableOrders(ordersMap);

        // Load booked tables
        const savedBookedTables = await dbHelper.getBookedTables();
        const bookedFromOrders = tableOrders.map(order => order.tableName);
        const allBookedTables = [...new Set([...savedBookedTables, ...bookedFromOrders])];
        
        console.log('🔒 Booked tables:', allBookedTables.length);
        setBookedTables(new Set(allBookedTables));
        await dbHelper.saveBookedTables(allBookedTables);
        
        // Update unsynced count
        await updateUnsyncedCount();

        console.log('✅ App initialization complete');

      } catch (error) {
        console.error('❌ Error initializing app:', error);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        notification.error({
          message: 'Initialization Error',
          description: `Failed to load data: ${error.message}. Please refresh the page.`,
          duration: 0, // Don't auto-close
        });
        
        // Try to recover by using initial data
        console.log('⚠️ Attempting recovery with initial data...');
        setTables(initialTables);
        setCategories(initialCategories);
        setProducts(initialProducts);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const saveBookedTablesState = async () => {
      try {
        const bookedTablesArray = Array.from(bookedTables);
        await dbHelper.saveBookedTables(bookedTablesArray);
      } catch (error) {
        console.error('❌ Error saving booked tables:', error);
      }
    };

    saveBookedTablesState();
  }, [bookedTables]);

  const loadActiveTableOrders = async () => {
    try {
      const tableOrders = await dbHelper.getAllTableOrders();
      const ordersMap = new Map();
      
      tableOrders.forEach(order => {
        ordersMap.set(order.tableId, order);
      });
      
      setActiveTableOrders(ordersMap);

      if (tableOrders.length > 0) {
        setBookedTables(prevBooked => {
          const bookedFromOrders = tableOrders.map(order => order.tableName);
          const merged = new Set([...prevBooked, ...bookedFromOrders]);
          return merged;
        });
      }
    } catch (error) {
      console.error('❌ Error loading table orders:', error);
    }
  };

  const updateUnsyncedCount = async () => {
    try {
      const unsyncedOrders = await dbHelper.getUnsyncedOrders();
      setUnsyncedCount(unsyncedOrders.length);
    } catch (error) {
      console.error('❌ Error getting unsynced count:', error);
    }
  };

  useEffect(() => {
    if (currentSelectedTable?.id) {
      loadTableOrder(currentSelectedTable.id);
    } else if (selectedOrderCustomer?.id) {
      loadCustomerOrder(selectedOrderCustomer.id);
      checkPendingCustomerOrders(selectedOrderCustomer.id);
    } else {
      setCart([]);
      setDiscount('0');
      setHasPendingCustomerOrders(false);
    }
  }, [currentSelectedTable?.id, selectedOrderCustomer?.id]);

  const checkPendingCustomerOrders = async (customerId) => {
    try {
      const pendingOrders = await dbHelper.getPendingCustomerOrders();
      const customerOrders = pendingOrders.filter(
        order => order.customerId === customerId && order.items.length > 0
      );
      setHasPendingCustomerOrders(customerOrders.length > 0);
    } catch (error) {
      console.error('Error checking pending orders:', error);
      setHasPendingCustomerOrders(false);
    }
  };

  const loadTableOrder = async (tableId) => {
    try {
      const tableOrder = await dbHelper.getTableOrder(tableId);
      
      if (tableOrder) {
        setCart(tableOrder.items || []);
        setDiscount(tableOrder.discount?.toString() || '0');
        // ❌ REMOVED: message.info
      } else {
        setCart([]);
        setDiscount('0');
      }
    } catch (error) {
      console.error('❌ Error loading table order:', error);
      setCart([]);
      setDiscount('0');
    }
  };

  const loadCustomerOrder = async (customerId) => {
    try {
      const customerOrders = await dbHelper.getCustomerOrders('pending');
      const customerOrder = customerOrders.find(order => order.customerId === customerId);
      
      if (customerOrder) {
        setCart(customerOrder.items || []);
        setDiscount(customerOrder.discount?.toString() || '0');
        // ❌ REMOVED: message.info
      } else {
        setCart([]);
        setDiscount('0');
      }
    } catch (error) {
      console.error('❌ Error loading customer order:', error);
      setCart([]);
      setDiscount('0');
    }
  };

  const filteredProducts = products
    .filter((product) => product.category === selectedCategory)
    .sort((a, b) => a.orderBy - b.orderBy);

  const sortedCategories = [...categories].sort((a, b) => a.orderBy - b.orderBy);
  const sortedTables = [...tables].sort((a, b) => a.orderBy - b.orderBy);

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#1890ff';
  };

  const getProductColor = (product) => {
    return product.color || getCategoryColor(product.category);
  };

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
        
        if (quantity > 10) {
          message.warning('10 se zayada product select nahi ho sakta!');
          return;
        }
        
        setCalculatorDisplay(calculatorDisplay + value);
      }
    }
  };

  const handleProductClick = async (product) => {
    const quantity = parseInt(calculatorDisplay) || 1;
    
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }
    
    setCart(newCart);
    
    if (currentSelectedTable) {
      try {
        await dbHelper.addToTableOrder(
          currentSelectedTable.id,
          currentSelectedTable.name,
          [{ ...product, quantity }],
          selectedOrderCustomer
        );
        
        if (cart.length === 0) {
          setBookedTables(prev => {
            const newSet = new Set([...prev, currentSelectedTable.name]);
            return newSet;
          });
        }
        
        await loadActiveTableOrders();
        // ❌ REMOVED: message.success
      } catch (error) {
        console.error('❌ Error saving to table order:', error);
        message.error('Failed to save item');
      }
    } else if (selectedOrderCustomer) {
      // ✅ Save to customer order (silently)
      try {
        await dbHelper.addToCustomerOrder(
          selectedOrderCustomer,
          [{ ...product, quantity }]
        );
        // ✅ Refresh pending orders check
        await checkPendingCustomerOrders(selectedOrderCustomer.id);
      } catch (error) {
        console.error('❌ Error saving to customer order:', error);
        message.error('Failed to save item');
      }
    } else {
      // Walking customer - just add to cart (no save yet)
    }
    
    setCalculatorDisplay('');
  };

  const removeFromCart = async (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    
    if (currentSelectedTable) {
      try {
        await dbHelper.removeItemFromTable(currentSelectedTable.id, id);
        await loadActiveTableOrders();
        message.info('Item removed', 1);
      } catch (error) {
        console.error('❌ Error removing item:', error);
        message.error('Failed to remove item');
      }
    } else {
      message.info('Item removed', 1);
    }
  };

  useEffect(() => {
    const updateDiscount = async () => {
      if (currentSelectedTable && !discountFocused && discount) {
        try {
          const discountValue = parseFloat(discount) || 0;
          await dbHelper.updateTableDiscount(currentSelectedTable.id, discountValue);
        } catch (error) {
          console.error('❌ Error updating discount:', error);
        }
      }
    };
    
    const timeoutId = setTimeout(updateDiscount, 500);
    return () => clearTimeout(timeoutId);
    
  }, [discount, currentSelectedTable?.id, discountFocused]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = parseFloat(discount) || 0;
  const total = subtotal - discountAmount;

  const handlePrint = () => {
    message.info('Printing order...');
  };

  const handleStarToggle = () => {
    setIsStarred(!isStarred);
    message.success(isStarred ? 'Unmarked' : 'Marked as favorite', 1);
  };

  const handleProceedOrder = async () => {
    // ✅ Always open modal - let user check if orders exist
    setProceedOrderModalVisible(true);
  };

  const handleReturnOrder = () => {
    setReturnOrderModalVisible(true);
  };

  const handleSaveOrder = async () => {
    if (cart.length === 0) {
      message.warning('Cart is empty!');
      return;
    }

    const loadingMsg = message.loading('Saving order...', 0);

    try {
      if (currentSelectedTable) {
        const result = await dbHelper.saveFinalOrder(
          currentSelectedTable.id,
          paymentMethod,
          {
            customerType,
            isStarred,
            orderCustomer: selectedOrderCustomer,
          }
        );

        loadingMsg();

        if (result.synced) {
          notification.success({
            message: '✅ Order Saved!',
            description: `Table ${currentSelectedTable.name} order saved to database.`,
            duration: 3,
          });
        } else {
          notification.warning({
            message: '⚠️ Saved Locally',
            description: 'Order saved. Will sync to database when online.',
            duration: 3,
          });
        }

        setCart([]);
        setDiscount('0');
        setCalculatorDisplay('');
        setIsStarred(false);
        handleClearTable();
        
        await loadActiveTableOrders();
        await updateUnsyncedCount();

      } else {
        const orderData = {
          tableId: 'WALKING-' + Date.now(),
          tableName: 'Walking Customer',
          items: cart,
          subtotal,
          discount: discountAmount,
          total,
          customerType: 'walking',
          paymentMethod,
          isStarred,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };

        if (!dbHelper.db) {
          await dbHelper.initDB();
        }

        const transaction = dbHelper.db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');
        const addRequest = store.add({ ...orderData, synced: false });

        addRequest.onsuccess = async () => {
          const localId = addRequest.result;
          const apiResult = await dbHelper.sendOrderToBackend(orderData);
          
          loadingMsg();

          if (apiResult.success) {
            notification.success({
              message: '✅ Order Saved!',
              description: 'Walking customer order saved.',
              duration: 2,
            });
          } else {
            notification.warning({
              message: '⚠️ Saved Locally',
              description: 'Will sync when connection restored.',
              duration: 2,
            });
          }

          setCart([]);
          setDiscount('0');
          setCalculatorDisplay('');
          setIsStarred(false);
          await updateUnsyncedCount();
        };

        addRequest.onerror = () => {
          loadingMsg();
          throw new Error('Failed to save to IndexedDB');
        };
      }

    } catch (error) {
      loadingMsg();
      console.error('❌ Error saving order:', error);
      notification.error({
        message: 'Save Failed',
        description: 'Could not save order. Please try again.',
        duration: 3,
      });
    }
  };

  const handleRetrySync = async () => {
    const loadingMsg = message.loading('Syncing...', 0);
    
    try {
      const result = await dbHelper.retryUnsyncedOrders();
      loadingMsg();
      
      if (result.syncedCount > 0) {
        message.success(`✅ ${result.syncedCount} orders synced!`, 2);
      } else if (result.totalUnsynced > 0) {
        message.warning('Some orders failed to sync', 2);
      } else {
        message.info('No orders to sync', 1.5);
      }
      
      await updateUnsyncedCount();
    } catch (error) {
      loadingMsg();
      message.error('Sync failed');
    }
  };

  const handleClearDatabase = async () => {
    Modal.confirm({
      title: '⚠️ Clear All Data?',
      content: 'This will permanently delete all orders, table bookings, and cached data from local storage. This action cannot be undone.',
      okText: 'Yes, Clear All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        const loadingMsg = message.loading('Clearing database...', 0);
        
        try {
          await dbHelper.clearDatabase();
          
          setCart([]);
          setDiscount('0');
          setCalculatorDisplay('');
          setBookedTables(new Set());
          setActiveTableOrders(new Map());
          setUnsyncedCount(0);
          setInternalSelectedTable(null);
          
          loadingMsg();
          
          notification.success({
            message: '✅ Database Cleared',
            description: 'All local data has been deleted successfully.',
            duration: 3,
          });
          
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          
        } catch (error) {
          loadingMsg();
          console.error('❌ Error clearing database:', error);
          notification.error({
            message: 'Clear Failed',
            description: 'Could not clear database. Please try again.',
            duration: 3,
          });
        }
      },
    });
  };

  const handleTableCustomer = () => {    
    handleAutoSaveAndClear();
    setTableBookingModalVisible(true);
  };

  const handleBookedTablesList = () => {
    handleAutoSaveAndClear();
    setTableBookingModalVisible(true);
  };

  const handleTableSelect = async (table) => {
    setTableBookingModalVisible(false);
    
    // ✅ Clear customer selection when switching to table (silently)
    if (selectedOrderCustomer && cart.length > 0) {
      // Save current customer cart first (silently)
      try {
        await dbHelper.addToCustomerOrder(selectedOrderCustomer, cart);
      } catch (error) {
        console.error('Error saving customer order:', error);
      }
    }
    
    setSelectedOrderCustomer(null);
    setCustomerType('table');
    
    if (currentSelectedTable && cart.length > 0 && currentSelectedTable.id !== table.id) {
      // Transferring from one table to another
      try {
        await dbHelper.clearTableOrder(currentSelectedTable.id);
        
        await dbHelper.addToTableOrder(
          table.id,
          table.name,
          cart.map(item => ({ ...item })),
          null
        );
        
        if (parseFloat(discount) > 0) {
          await dbHelper.updateTableDiscount(table.id, parseFloat(discount));
        }
        
        setBookedTables(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentSelectedTable.name);
          newSet.add(table.name);
          return newSet;
        });
        
        await loadActiveTableOrders();
        // ❌ REMOVED: message.success (order transferred)
        
      } catch (error) {
        console.error('❌ Error transferring order:', error);
        message.error('Failed to transfer order');
      }
    }
    // ❌ REMOVED: else message.success (table selected)
    
    setInternalSelectedTable(table);
  };

  const handleClearTable = async () => {
    if (currentSelectedTable) {
      setBookedTables(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentSelectedTable.name);
        
        const bookedArray = Array.from(newSet);
        dbHelper.saveBookedTables(bookedArray).catch(err => {
          console.error('Error saving booked tables:', err);
        });
        
        return newSet;
      });
    }
    
    setInternalSelectedTable(null);
    
    if (onClearTable) {
      onClearTable();
    }
    setCustomerType('walking');
  };

  const handleOrderCustomer = async () => {
    // ✅ Auto-save and clear before switching
    await handleAutoSaveAndClear();
    setCustomerType('order');
    setOrderCustomerModalVisible(true);
  };

  const handleOrderCustomerSelect = async (customer) => {
    // ✅ When customer is selected, clear current table UI but keep table booked
    // Silently handle - no messages
    
    setSelectedOrderCustomer(customer);
    setInternalSelectedTable(null); // Clear table UI
    setCart([]); // Clear cart for customer
    setDiscount('0');
    setCustomerType('order');
  };

  const desktopColumns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text, record) => (
        <Text 
          strong 
          style={{ 
            fontSize: 11,
            display: 'block',
          }}
        >
          {`${text} x ${record.price}`}
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
        <div style={{ 
          minHeight: 40,
          minWidth: '100%',
          marginBottom: 10, 
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          
          {unsyncedCount > 0 && (
            <Badge count={unsyncedCount} showZero={false}>
              <Button
                size="small"
                icon={<DatabaseOutlined />}
                onClick={handleRetrySync}
                danger
                style={{ fontSize: 11 }}
              >
                Retry Sync
              </Button>
            </Badge>
          )}

          <Button
            size="small"
            icon={<ClearOutlined />}
            onClick={handleClearDatabase}
            danger
            style={{ 
              fontSize: 11,
              background: '#ff4d4f',
              borderColor: '#ff4d4f',
              color: 'white',
            }}
          >
            Clear DB
          </Button>

          {activeTableOrders.size > 0 && (
            <Tag color="processing" style={{ fontSize: 12 }}>
              {activeTableOrders.size} Active Orders
            </Tag>
          )}
          
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {/* Show either table OR customer selection, not both */}
            {currentSelectedTable && !selectedOrderCustomer && (
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
                {activeTableOrders.has(currentSelectedTable.id) && ' 📋'}
              </Tag>
            )}

            {selectedOrderCustomer && (
              <Tag 
                color="warning"
                closable
                onClose={() => {
                  setSelectedOrderCustomer(null);
                  setCustomerType('walking');
                  setCart([]);
                  setDiscount('0');
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

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Button
              type="default"
              icon={<AppstoreOutlined />}
              onClick={async () => {
                await handleAutoSaveAndClear();
                setRotiModalVisible(true);
              }}
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
              onClick={async () => {
                await handleAutoSaveAndClear();
                setPaymentModalVisible(true);
              }}
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
              onClick={async () => {
                await handleAutoSaveAndClear();
                setExpenseModalVisible(true);
              }}
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
              onClick={async () => {
                await handleAutoSaveAndClear();
                handleReturnOrder();
              }}
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
              onClick={async () => {
                await handleAutoSaveAndClear();
                handleProceedOrder();
              }}
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
            <Col xs={24} lg={16} style={{ height: '100%' }}>
              <Space direction="vertical" size={10} style={{ width: '100%', height: '100%' }}>
                <Card
                  title={null}
                  bordered={false}
                  style={{ 
                    height: '55vh',
                    overflow: 'hidden',
                  }}
                  bodyStyle={{
                    height: '100%',
                    padding: 8,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ 
                    height: '100%', 
                    overflowY: 'auto',
                    overflowX: 'hidden',
                  }}>
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
                  </div>
                </Card>

                <Card bodyStyle={{ padding: 8 }}>
                  <Row gutter={[6, 6]}>
                    {sortedCategories.map((category) => (
                      <Col xs={8} sm={6} md={4} lg={4} key={category.id}>
                        <Button
                          type={selectedCategory === category.id ? 'primary' : 'default'}
                          block
                          size="large"
                          onClick={async () => {
                            await handleAutoSaveAndClear();
                            setSelectedCategory(category.id);
                          }}
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

                <Row gutter={[8, 8]} wrap>
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
                      onClick={async () => {
                        // ✅ Auto-save and clear before switching
                        await handleAutoSaveAndClear();
                        
                        setCustomerType('walking');
                        setSelectedOrderCustomer(null);
                        setInternalSelectedTable(null);
                        setCart([]);
                        setDiscount('0');
                        setCalculatorDisplay('');
                      }}
                    >
                      Walking Customer
                    </Button>
                  </Col>

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
                      onClick={async () => {
                        await handleAutoSaveAndClear();
                        handleOrderCustomer();
                      }}
                    >
                      {selectedOrderCustomer ? selectedOrderCustomer.name : 'Order Customer'}
                    </Button>
                  </Col>

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
                      onClick={async () => {
                        await handleAutoSaveAndClear();
                        handleTableCustomer();
                        setIsBooked(false);
                      }}
                    >
                      All Tables
                    </Button>
                  </Col>

                  <Col flex="1">
                    {/* ✅ FIX: Use the memoized count value */}
                    <Badge count={bookedTablesCount} showZero={false}>
                      <Button
                        block
                        icon={<UnorderedListOutlined />}
                        disabled={bookedTablesCount === 0}
                        style={{
                          height: 42,
                          fontSize: 12,
                          fontWeight: 600,
                          whiteSpace: "nowrap"
                        }}
                        onClick={async () => {
                          await handleAutoSaveAndClear();
                          handleBookedTablesList();
                          setIsBooked(true);
                        }}
                      >
                        Booked Tables
                      </Button>
                    </Badge>
                  </Col>

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
                      onClick={async () => {
                        await handleAutoSaveAndClear();
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

            <Col xs={0} lg={8} style={{ height: '100%' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                height: '100%'
              }}>
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

      <OrderCustomerModal
        visible={orderCustomerModalVisible}
        onClose={() => setOrderCustomerModalVisible(false)}
        onSelectCustomer={handleOrderCustomerSelect}
      />

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

      <ProceedOrderModal
        visible={proceedOrderModalVisible}
        onClose={() => setProceedOrderModalVisible(false)}
        onConfirm={() => {
          handleSaveOrder();
          setProceedOrderModalVisible(false);
        }}
        onOrderCompleted={async () => {
          // Refresh UI after completing orders
          await loadActiveTableOrders();
        }}
      />

      <ReturnOrderModal
        visible={returnOrderModalVisible}
        onClose={() => setReturnOrderModalVisible(false)}
      />

      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSave={(paymentData) => {
          console.log('Payment saved:', paymentData);
        }}
      />

      <ExpenseModal
        visible={expenseModalVisible}
        onClose={() => setExpenseModalVisible(false)}
      />

      <RotiModal
        visible={rotiModalVisible}
        onClose={() => setRotiModalVisible(false)}
      />
    </>
  );
};

export default Sale;