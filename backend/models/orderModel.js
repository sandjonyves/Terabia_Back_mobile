const { DataTypes } = require('sequelize');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../constants/enums');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    order_number: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    delivery_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(Object.values(ORDER_STATUS)),
      defaultValue: ORDER_STATUS.PENDING,
    },
    payment_status: {
      type: DataTypes.ENUM(Object.values(PAYMENT_STATUS)),
      defaultValue: PAYMENT_STATUS.PENDING,
    },
    delivery_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    delivery_city: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    delivery_coords: {
      type: DataTypes.JSONB,
    },
    delivery_agency_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    buyer_notes: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: async (order, options) => {
        if (!order.order_number) {
          const [result] = await sequelize.query(`SELECT 'TRB' || STRFTIME('%Y%m%d', 'now') || LPAD((SELECT IFNULL(MAX(id), 0) + 1 FROM orders), 6, '0') AS order_number;`);
          order.order_number = result[0].order_number;
        }
      },
    },
  });

  return Order;
};
