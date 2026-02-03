import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Space,
  message,
  Badge,
} from 'antd';
import {
  TableOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

// Initial table data
const initialTables = [
  { id: 1, number: 1, capacity: 2, status: 'available', bookedBy: null },
  { id: 2, number: 2, capacity: 4, status: 'available', bookedBy: null },
  { id: 3, number: 3, capacity: 4, status: 'available', bookedBy: null },
  { id: 4, number: 4, capacity: 6, status: 'available', bookedBy: null },
  { id: 5, number: 5, capacity: 2, status: 'available', bookedBy: null },
  { id: 6, number: 6, capacity: 8, status: 'available', bookedBy: null },
  { id: 7, number: 7, capacity: 4, status: 'available', bookedBy: null },
  { id: 8, number: 8, capacity: 2, status: 'available', bookedBy: null },
  { id: 9, number: 9, capacity: 4, status: 'available', bookedBy: null },
  { id: 10, number: 10, capacity: 6, status: 'available', bookedBy: null },
  { id: 11, number: 11, capacity: 2, status: 'available', bookedBy: null },
  { id: 12, number: 12, capacity: 4, status: 'available', bookedBy: null },
  { id: 13, number: 13, capacity: 2, status: 'available', bookedBy: null },
  { id: 14, number: 14, capacity: 4, status: 'available', bookedBy: null },
  { id: 15, number: 15, capacity: 6, status: 'available', bookedBy: null },
  { id: 16, number: 16, capacity: 8, status: 'available', bookedBy: null },
];

const TableBooking = ({ onTableSelect, onBack, bookedTables = new Set() }) => {
  // Generate tables with proper booking status from parent
  const generateTables = () => {
    return initialTables.map(table => ({
      ...table,
      status: bookedTables.has(table.number) ? 'booked' : 'available',
      bookedBy: bookedTables.has(table.number) ? 'Customer' : null,
    }));
  };

  const [tables, setTables] = useState(generateTables());

  // Update tables when bookedTables changes
  React.useEffect(() => {
    setTables(generateTables());
  }, [bookedTables]);

  // Handle table click
  const handleTableClick = (table) => {
    if (table.status === 'available') {
      console.log('Table selected:', table);
      
      if (onTableSelect) {
        onTableSelect(table);
      }
    } else {
      message.warning({
        content: `Table ${table.number} is already booked!`,
        duration: 2,
      });
    }
  };

  // Get color based on table status
  const getTableColor = (status) => {
    return status === 'booked' ? '#ff4d4f' : '#52c41a';
  };

  // Get available and booked counts
  const availableTables = tables.filter((t) => t.status === 'available').length;
  const bookedTablesCount = tables.filter((t) => t.status === 'booked').length;

  return (
    <div 
      style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#f0f2f5',
      }}
    >
      {/* Table Status Header - Fixed */}
      <div style={{ 
        padding: '16px 16px 12px 16px',
        background: '#f0f2f5',
        borderBottom: '1px solid #d9d9d9',
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: 24
        }}>
          <Badge
            count={availableTables}
            style={{ backgroundColor: '#52c41a' }}
            showZero
          >
            <Tag color="success" style={{ fontSize: 14, padding: '6px 16px', margin: 0 }}>
              Available
            </Tag>
          </Badge>
          <Badge
            count={bookedTablesCount}
            style={{ backgroundColor: '#ff4d4f' }}
            showZero
          >
            <Tag color="error" style={{ fontSize: 14, padding: '6px 16px', margin: 0 }}>
              Booked
            </Tag>
          </Badge>
        </div>
      </div>

      {/* Tables Grid - Scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 16,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 12,
          }}
        >
          {tables.map((table) => (
            <Card
              key={table.id}
              hoverable
              onClick={() => handleTableClick(table)}
              style={{
                borderColor: getTableColor(table.status),
                borderWidth: 2,
                background:
                  table.status === 'booked'
                    ? 'rgba(255, 77, 79, 0.1)'
                    : 'rgba(82, 196, 26, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              bodyStyle={{
                padding: 12,
                textAlign: 'center',
              }}
            >
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <TableOutlined
                  style={{
                    fontSize: 32,
                    color: getTableColor(table.status),
                  }}
                />

                <Text strong style={{ fontSize: 16 }}>
                  {table.number}
                </Text>

                <Tag
                  color={table.status === 'booked' ? 'error' : 'success'}
                  style={{ fontSize: 10, padding: '2px 8px', margin: 0 }}
                >
                  {table.status === 'booked' ? 'BOOKED' : 'AVAILABLE'}
                </Tag>
              </Space>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableBooking;