import React, { useState } from 'react';
import {
  Card,
  Typography,
  Tag,
  message,
  
} from 'antd';

const { Text } = Typography;
 
const TableBooking = ({ initialTables, onTableSelect, onBack, bookedTables = new Set(), isbooked }) => {
  // Generate tables with proper booking status from parent
  const generateTables = () => {
    return initialTables.map(table => ({
      ...table,
      status: bookedTables.has(table.name) ? 'booked' : 'available',
      bookedBy: bookedTables.has(table.name) ? 'Customer' : null,
    }));
  };

  const [tables, setTables] = useState(generateTables());

  const getTableBackgroundColor = (table, isBooked) => {
    if (isBooked) {
      // showing booked tables - use table's own color if booked, grey if not
      return table.status === 'booked'
        ? `${table.color || '#ff4d4f'}30` // 30 = 18% opacity
        : '#f0f0f0'; // light grey
    }

    // showing available tables - use table's own color if available, grey if not
    return table.status === 'available'
      ? `${table.color || '#52c41a'}30` // 30 = 18% opacity
      : '#f0f0f0'; // light grey
  };

  const getTableBorderColor = (table, isBooked) => {
    if (isBooked) {
      return table.status === 'booked'
        ? table.color || '#ff4d4f'
        : '#d9d9d9';
    }

    return table.status === 'available'
      ? table.color || '#52c41a'
      : '#d9d9d9';
  };

  // Update tables when bookedTables changes
  React.useEffect(() => {
    setTables(generateTables());
    message.info(isbooked ? 'Showing Booked Tables' : 'Showing Available Tables');
    console.log("bookedTables changed:", isbooked);
  }, [bookedTables]);

  // Handle table click
  const handleTableClick = (table, isbooked) => {
    if (isbooked) {
      if (table.status === 'booked') {
        console.log('Table selected:', table);
        
        if (onTableSelect) {
          onTableSelect(table);
        }
      } else {
        message.warning({
          content: `Table ${table.name} is Empty!`,
          duration: 2,
        });
      }
    } else {
      if (table.status === 'available') {
        console.log('Table selected:', table);
        
        if (onTableSelect) {
          onTableSelect(table);
        }
      } else {
        message.warning({
          content: `Table ${table.name} is already booked!`,
          duration: 2,
        });
      }
    }
  };

  return (
    <div 
      style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#f0f2f5',
      }}
    >
      {/* Tables Grid - 10 per row */}
      <div
        style={{
          flex: 1,
          padding: 20,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 85px)',
            gridTemplateRows: 'repeat(2, 70px)',
            gap: 8,
          }}
        >
          {tables.map((table, index) => (
            <Card
              key={table.id}
              hoverable
              onClick={() => handleTableClick(table, isbooked)}
              style={{
                borderColor: getTableBorderColor(table, isbooked),
                borderWidth: 2,
                background: getTableBackgroundColor(table, isbooked),
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                width: '85px',
                height: '70px',
              }}
              bodyStyle={{
                padding: 4,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Text
                strong
                style={{
                  fontSize: 11,
                  color: getTableBorderColor(table, isbooked),
                  wordBreak: 'break-word',
                }}
              >
                {table.name}
              </Text>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableBooking;