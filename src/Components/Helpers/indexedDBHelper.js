// Enhanced IndexedDB Helper - Complete State Management
// Tables, Categories, Products caching + State persistence + Customer Orders

const DB_NAME = 'RestaurantPOS_DB';
const DB_VERSION = 5;
const ORDERS_STORE = 'orders';
const TABLE_ORDERS_STORE = 'tableOrders';
const CUSTOMER_ORDERS_STORE = 'customerOrders';
const TABLES_STORE = 'tables';
const CATEGORIES_STORE = 'categories';
const PRODUCTS_STORE = 'products';
const APP_STATE_STORE = 'appState';

class IndexedDBHelper {
  constructor() {
    this.db = null;
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔄 Opening IndexedDB:', DB_NAME, 'Version:', DB_VERSION);
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
          console.error('❌ IndexedDB error:', request.error);
          console.error('Error event:', event);
          reject(request.error);
        };

        request.onsuccess = (event) => {
          this.db = request.result;
          console.log('✅ IndexedDB initialized successfully');
          console.log('Available stores:', Array.from(this.db.objectStoreNames));
          resolve(this.db);
        };

        request.onupgradeneeded = (event) => {
          console.log('🔧 Upgrading database from version', event.oldVersion, 'to', event.newVersion);
          const db = event.target.result;

          // Create ORDERS store
          if (!db.objectStoreNames.contains(ORDERS_STORE)) {
            console.log('Creating store:', ORDERS_STORE);
            const ordersStore = db.createObjectStore(ORDERS_STORE, { 
              keyPath: 'id', 
              autoIncrement: true 
            });
            ordersStore.createIndex('timestamp', 'timestamp', { unique: false });
            ordersStore.createIndex('synced', 'synced', { unique: false });
          }

          // Create TABLE_ORDERS store
          if (!db.objectStoreNames.contains(TABLE_ORDERS_STORE)) {
            console.log('Creating store:', TABLE_ORDERS_STORE);
            const tableOrdersStore = db.createObjectStore(TABLE_ORDERS_STORE, { 
              keyPath: 'tableId'
            });
            tableOrdersStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
          }

          // Create CUSTOMER_ORDERS store
          if (!db.objectStoreNames.contains(CUSTOMER_ORDERS_STORE)) {
            console.log('Creating store:', CUSTOMER_ORDERS_STORE);
            const customerOrdersStore = db.createObjectStore(CUSTOMER_ORDERS_STORE, { 
              keyPath: 'id',
              autoIncrement: true
            });
            customerOrdersStore.createIndex('customerId', 'customerId', { unique: false });
            customerOrdersStore.createIndex('status', 'status', { unique: false });
          }

          // Create TABLES store
          if (!db.objectStoreNames.contains(TABLES_STORE)) {
            console.log('Creating store:', TABLES_STORE);
            const tablesStore = db.createObjectStore(TABLES_STORE, { 
              keyPath: 'id'
            });
            tablesStore.createIndex('orderBy', 'orderBy', { unique: false });
          }

          // Create CATEGORIES store
          if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
            console.log('Creating store:', CATEGORIES_STORE);
            db.createObjectStore(CATEGORIES_STORE, { keyPath: 'id' });
          }

          // Create PRODUCTS store
          if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
            console.log('Creating store:', PRODUCTS_STORE);
            const productsStore = db.createObjectStore(PRODUCTS_STORE, { 
              keyPath: 'id'
            });
            productsStore.createIndex('category', 'category', { unique: false });
          }

          // Create APP_STATE store
          if (!db.objectStoreNames.contains(APP_STATE_STORE)) {
            console.log('Creating store:', APP_STATE_STORE);
            db.createObjectStore(APP_STATE_STORE, { keyPath: 'key' });
          }

          console.log('✅ Database upgrade complete');
        };

        request.onblocked = (event) => {
          console.warn('⚠️ Database upgrade blocked. Please close other tabs.');
          alert('Please close other tabs with this application open to continue.');
        };

      } catch (error) {
        console.error('❌ Error in initDB:', error);
        reject(error);
      }
    });
  }

  // ==========================================
  // CUSTOMER ORDERS MANAGEMENT
  // ==========================================

  async addToCustomerOrder(customer, newItems) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([CUSTOMER_ORDERS_STORE], 'readwrite');
      const store = transaction.objectStore(CUSTOMER_ORDERS_STORE);
      const index = store.index('customerId');
      const request = index.getAll(customer.id);

      request.onsuccess = () => {
        const existingOrders = request.result;
        const pendingOrder = existingOrders.find(order => order.status === 'pending');

        if (pendingOrder) {
          // Add items to existing pending order
          const mergedItems = this.mergeItems(pendingOrder.items, newItems);
          pendingOrder.items = mergedItems;
          pendingOrder.lastUpdated = new Date().toISOString();
          
          this.calculateCustomerOrderTotals(pendingOrder);
          
          const updateRequest = store.put(pendingOrder);
          updateRequest.onsuccess = () => resolve({ success: true, order: pendingOrder, isNew: false });
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          // Create new order
          const newOrder = {
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerAddress: customer.address,
            items: newItems.map(item => ({ ...item, status: 'pending' })),
            status: 'pending',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          };
          
          this.calculateCustomerOrderTotals(newOrder);
          
          const addRequest = store.add(newOrder);
          addRequest.onsuccess = () => {
            const orderId = addRequest.result;
            resolve({ success: true, orderId, order: { ...newOrder, id: orderId }, isNew: true });
          };
          addRequest.onerror = () => reject(addRequest.error);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  calculateCustomerOrderTotals(order) {
    order.subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    order.discount = order.discount || 0;
    order.total = order.subtotal - order.discount;
  }

  async saveCustomerOrder(customer, items, subtotal, discount, total) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([CUSTOMER_ORDERS_STORE], 'readwrite');
      const store = transaction.objectStore(CUSTOMER_ORDERS_STORE);

      const orderData = {
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        items: items.map(item => ({ ...item, status: 'pending' })),
        subtotal,
        discount,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      const request = store.add(orderData);

      request.onsuccess = () => {
        const orderId = request.result;
        resolve({ success: true, orderId, order: { ...orderData, id: orderId } });
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getCustomerOrders(status = null) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([CUSTOMER_ORDERS_STORE], 'readonly');
      const store = transaction.objectStore(CUSTOMER_ORDERS_STORE);

      let request;
      if (status) {
        const index = store.index('status');
        request = index.getAll(status);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingCustomerOrders() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([CUSTOMER_ORDERS_STORE], 'readonly');
      const store = transaction.objectStore(CUSTOMER_ORDERS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const allOrders = request.result;
        const pendingOrders = allOrders.filter(order => 
          order.items.some(item => item.status === 'pending')
        );
        resolve(pendingOrders);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async updateCustomerOrderItemStatus(orderId, itemId, newStatus) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([CUSTOMER_ORDERS_STORE], 'readwrite');
      const store = transaction.objectStore(CUSTOMER_ORDERS_STORE);
      const request = store.get(orderId);

      request.onsuccess = () => {
        const order = request.result;
        
        if (order) {
          order.items = order.items.map(item => 
            item.id === itemId ? { ...item, status: newStatus } : item
          );

          const allProceed = order.items.every(item => item.status === 'proceed');
          const anyProceed = order.items.some(item => item.status === 'proceed');
          
          order.status = allProceed ? 'completed' : anyProceed ? 'partial' : 'pending';
          order.lastUpdated = new Date().toISOString();

          const updateRequest = store.put(order);
          updateRequest.onsuccess = () => resolve({ success: true, order });
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve({ success: false, message: 'Order not found' });
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async processProceededItems(orderId) {
    if (!this.db) await this.initDB();

    return new Promise(async (resolve, reject) => {
      try {
        const transaction = this.db.transaction([CUSTOMER_ORDERS_STORE], 'readwrite');
        const store = transaction.objectStore(CUSTOMER_ORDERS_STORE);
        const request = store.get(orderId);

        request.onsuccess = () => {
          const order = request.result;
          
          if (order) {
            const proceededItems = order.items.filter(item => item.status === 'proceed');
            const proceededTotal = proceededItems.reduce(
              (sum, item) => sum + (item.price * item.quantity), 
              0
            );

            resolve({ 
              success: true, 
              proceededTotal,
              proceededItems,
              customer: {
                id: order.customerId,
                name: order.customerName,
                phone: order.customerPhone
              }
            });
          } else {
            resolve({ success: false, message: 'Order not found' });
          }
        };

        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteCustomerOrder(orderId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([CUSTOMER_ORDERS_STORE], 'readwrite');
      const store = transaction.objectStore(CUSTOMER_ORDERS_STORE);
      const request = store.delete(orderId);

      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
    });
  }

  // ==========================================
  // TABLES MANAGEMENT
  // ==========================================

  async saveTables(tables) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TABLES_STORE], 'readwrite');
      const store = transaction.objectStore(TABLES_STORE);

      store.clear();
      tables.forEach(table => store.put(table));

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getTables() {
    if (!this.db) {
      console.log('Database not initialized, initializing...');
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([TABLES_STORE], 'readonly');
        const store = transaction.objectStore(TABLES_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          const result = request.result || [];
          console.log('✅ Retrieved tables:', result.length);
          resolve(result);
        };
        
        request.onerror = () => {
          console.error('❌ Error getting tables:', request.error);
          reject(request.error);
        };
        
        transaction.onerror = () => {
          console.error('❌ Transaction error:', transaction.error);
          reject(transaction.error);
        };
      } catch (error) {
        console.error('❌ Error in getTables:', error);
        reject(error);
      }
    });
  }

  async updateTable(table) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TABLES_STORE], 'readwrite');
      const store = transaction.objectStore(TABLES_STORE);
      const request = store.put(table);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // ==========================================
  // CATEGORIES MANAGEMENT
  // ==========================================

  async saveCategories(categories) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([CATEGORIES_STORE], 'readwrite');
      const store = transaction.objectStore(CATEGORIES_STORE);

      store.clear();
      categories.forEach(category => store.put(category));

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getCategories() {
    if (!this.db) {
      console.log('Database not initialized, initializing...');
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([CATEGORIES_STORE], 'readonly');
        const store = transaction.objectStore(CATEGORIES_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          const result = request.result || [];
          console.log('✅ Retrieved categories:', result.length);
          resolve(result);
        };
        
        request.onerror = () => {
          console.error('❌ Error getting categories:', request.error);
          reject(request.error);
        };
        
        transaction.onerror = () => {
          console.error('❌ Transaction error:', transaction.error);
          reject(transaction.error);
        };
      } catch (error) {
        console.error('❌ Error in getCategories:', error);
        reject(error);
      }
    });
  }

  // ==========================================
  // PRODUCTS MANAGEMENT
  // ==========================================

  async saveProducts(products) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);

      store.clear();
      products.forEach(product => store.put(product));

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getProducts() {
    if (!this.db) {
      console.log('Database not initialized, initializing...');
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([PRODUCTS_STORE], 'readonly');
        const store = transaction.objectStore(PRODUCTS_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          const result = request.result || [];
          console.log('✅ Retrieved products:', result.length);
          resolve(result);
        };
        
        request.onerror = () => {
          console.error('❌ Error getting products:', request.error);
          reject(request.error);
        };
        
        transaction.onerror = () => {
          console.error('❌ Transaction error:', transaction.error);
          reject(transaction.error);
        };
      } catch (error) {
        console.error('❌ Error in getProducts:', error);
        reject(error);
      }
    });
  }

  // ==========================================
  // APP STATE MANAGEMENT
  // ==========================================

  async saveAppState(key, value) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([APP_STATE_STORE], 'readwrite');
      const store = transaction.objectStore(APP_STATE_STORE);
      
      const request = store.put({
        key,
        value,
        lastUpdated: new Date().toISOString()
      });

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getAppState(key) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([APP_STATE_STORE], 'readonly');
      const store = transaction.objectStore(APP_STATE_STORE);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveBookedTables(bookedTablesArray) {
    return this.saveAppState('bookedTables', bookedTablesArray);
  }

  async getBookedTables() {
    const result = await this.getAppState('bookedTables');
    return result || [];
  }

  // ==========================================
  // TABLE ORDERS
  // ==========================================

  async addToTableOrder(tableId, tableName, newItems, customerInfo = null) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TABLE_ORDERS_STORE], 'readwrite');
      const store = transaction.objectStore(TABLE_ORDERS_STORE);
      
      const getRequest = store.get(tableId);

      getRequest.onsuccess = () => {
        const existingOrder = getRequest.result;

        if (existingOrder) {
          const mergedItems = this.mergeItems(existingOrder.items, newItems);
          
          existingOrder.items = mergedItems;
          existingOrder.lastUpdated = new Date().toISOString();
          existingOrder.orderCount = (existingOrder.orderCount || 1) + 1;
          
          this.calculateTotals(existingOrder);

          const updateRequest = store.put(existingOrder);
          updateRequest.onsuccess = () => resolve({ success: true, order: existingOrder, isNew: false });
          updateRequest.onerror = () => reject(updateRequest.error);

        } else {
          const newOrder = {
            tableId,
            tableName,
            items: newItems,
            discount: 0,
            customerInfo,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            orderCount: 1,
          };

          this.calculateTotals(newOrder);

          const addRequest = store.add(newOrder);
          addRequest.onsuccess = () => resolve({ success: true, order: newOrder, isNew: true });
          addRequest.onerror = () => reject(addRequest.error);
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  mergeItems(existingItems, newItems) {
    const merged = [...existingItems];
    
    newItems.forEach(newItem => {
      const existingIndex = merged.findIndex(item => item.id === newItem.id);
      
      if (existingIndex !== -1) {
        merged[existingIndex].quantity += newItem.quantity;
      } else {
        merged.push(newItem);
      }
    });
    
    return merged;
  }

  calculateTotals(order) {
    order.subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    order.total = order.subtotal - (order.discount || 0);
  }

  async getTableOrder(tableId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TABLE_ORDERS_STORE], 'readonly');
      const store = transaction.objectStore(TABLE_ORDERS_STORE);
      const request = store.get(tableId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTableDiscount(tableId, discount) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TABLE_ORDERS_STORE], 'readwrite');
      const store = transaction.objectStore(TABLE_ORDERS_STORE);
      const request = store.get(tableId);

      request.onsuccess = () => {
        const order = request.result;
        
        if (order) {
          order.discount = discount;
          this.calculateTotals(order);
          order.lastUpdated = new Date().toISOString();
          
          const updateRequest = store.put(order);
          updateRequest.onsuccess = () => resolve({ success: true, order });
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve({ success: true, order: null });
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async removeItemFromTable(tableId, itemId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TABLE_ORDERS_STORE], 'readwrite');
      const store = transaction.objectStore(TABLE_ORDERS_STORE);
      const request = store.get(tableId);

      request.onsuccess = () => {
        const order = request.result;
        
        if (order) {
          order.items = order.items.filter(item => item.id !== itemId);
          this.calculateTotals(order);
          order.lastUpdated = new Date().toISOString();
          
          if (order.items.length === 0) {
            store.delete(tableId);
            resolve({ success: true, order: null, deleted: true });
          } else {
            const updateRequest = store.put(order);
            updateRequest.onsuccess = () => resolve({ success: true, order, deleted: false });
            updateRequest.onerror = () => reject(updateRequest.error);
          }
        } else {
          resolve({ success: true, order: null, deleted: true });
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getAllTableOrders() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TABLE_ORDERS_STORE], 'readonly');
      const store = transaction.objectStore(TABLE_ORDERS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // ==========================================
  // FINAL ORDER SAVE
  // ==========================================

  async saveFinalOrder(tableId, paymentMethod = 'cash', additionalData = {}) {
    if (!this.db) await this.initDB();

    return new Promise(async (resolve, reject) => {
      try {
        const tableOrder = await this.getTableOrder(tableId);
        
        if (!tableOrder) {
          reject(new Error('No order found for this table'));
          return;
        }

        const finalOrder = {
          ...tableOrder,
          ...additionalData,
          paymentMethod,
          finalizedAt: new Date().toISOString(),
          synced: false,
        };

        const transaction = this.db.transaction([ORDERS_STORE, TABLE_ORDERS_STORE], 'readwrite');
        const ordersStore = transaction.objectStore(ORDERS_STORE);
        const tempStore = transaction.objectStore(TABLE_ORDERS_STORE);

        const saveRequest = ordersStore.add(finalOrder);

        saveRequest.onsuccess = async () => {
          const localId = saveRequest.result;
          tempStore.delete(tableId);

          try {
            const apiResult = await this.sendOrderToBackend({
              ...finalOrder,
              localId,
            });

            if (apiResult.success) {
              const getRequest = ordersStore.get(localId);
              
              getRequest.onsuccess = () => {
                const order = getRequest.result;
                order.synced = true;
                order.syncedAt = new Date().toISOString();
                order.backendId = apiResult.data?.id || null;
                ordersStore.put(order);
                
                resolve({
                  success: true,
                  localId,
                  backendId: apiResult.data?.id,
                  synced: true,
                  order: order,
                });
              };
            } else {
              resolve({
                success: true,
                localId,
                synced: false,
                error: apiResult.error,
                order: finalOrder,
              });
            }
          } catch (apiError) {
            resolve({
              success: true,
              localId,
              synced: false,
              error: apiError.message,
              order: finalOrder,
            });
          }
        };

        saveRequest.onerror = () => reject(saveRequest.error);

      } catch (error) {
        reject(error);
      }
    });
  }

  async sendOrderToBackend(orderData) {
    try {
      const API_ENDPOINT = '/api/orders';
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Backend sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  async clearTableOrder(tableId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TABLE_ORDERS_STORE], 'readwrite');
      const store = transaction.objectStore(TABLE_ORDERS_STORE);
      const request = store.delete(tableId);

      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
    });
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  async getAllOrders() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([ORDERS_STORE], 'readonly');
      const store = transaction.objectStore(ORDERS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedOrders() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([ORDERS_STORE], 'readonly');
      const store = transaction.objectStore(ORDERS_STORE);
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async retryUnsyncedOrders() {
    if (!this.db) await this.initDB();

    const unsyncedOrders = await this.getUnsyncedOrders();
    
    if (unsyncedOrders.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    let syncedCount = 0;
    
    for (const order of unsyncedOrders) {
      const result = await this.sendOrderToBackend(order);
      
      if (result.success) {
        const transaction = this.db.transaction([ORDERS_STORE], 'readwrite');
        const store = transaction.objectStore(ORDERS_STORE);
        
        order.synced = true;
        order.syncedAt = new Date().toISOString();
        order.backendId = result.data?.id || null;
        
        store.put(order);
        syncedCount++;
      }
    }

    return { success: true, syncedCount, totalUnsynced: unsyncedOrders.length };
  }

  // ==========================================
  // CLEAR DATABASE
  // ==========================================

  async clearDatabase() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      try {
        const storeNames = [
          ORDERS_STORE,
          TABLE_ORDERS_STORE,
          CUSTOMER_ORDERS_STORE,
          TABLES_STORE,
          CATEGORIES_STORE,
          PRODUCTS_STORE,
          APP_STATE_STORE
        ];

        const transaction = this.db.transaction(storeNames, 'readwrite');
        
        storeNames.forEach(storeName => {
          const store = transaction.objectStore(storeName);
          store.clear();
        });

        transaction.oncomplete = () => {
          console.log('✅ IndexedDB cleared completely');
          resolve({ success: true, message: 'Database cleared successfully' });
        };

        transaction.onerror = () => {
          console.error('❌ Error clearing database');
          reject(transaction.error);
        };

      } catch (error) {
        console.error('❌ Error in clearDatabase:', error);
        reject(error);
      }
    });
  }
}

const dbHelper = new IndexedDBHelper();
export default dbHelper;