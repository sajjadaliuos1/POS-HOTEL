import React, { useState } from 'react';
import {
  Modal,
  Tabs,
} from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import SupplierTab from './Tabs/SupplierTab.jsx';
import OtherTab from './Tabs/OtherTab.jsx';
import BCTab from './Tabs/BcTab.jsx';

const ExpenseModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState('bc');

  const handleClose = () => {
    setActiveTab('bc');
    onClose();
  };

  return (
    <Modal
      title="Payment Management"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      maskClosable={true}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="small"
        items={[
          {
            key: 'bc',
            label: (
              <span style={{ fontSize: 13 }}>
                <DollarOutlined /> BC
              </span>
            ),
            children: <BCTab />,
          },
          {
            key: 'suppliers',
            label: (
              <span style={{ fontSize: 13 }}>
                <ShoppingOutlined /> Suppliers
              </span>
            ),
            children: <SupplierTab />,
          },
          {
            key: 'others',
            label: (
              <span style={{ fontSize: 13 }}>
                <AppstoreOutlined /> Others
              </span>
            ),
            children: <OtherTab />,
          },
        ]}
      />
    </Modal>
  );
};

export default ExpenseModal;