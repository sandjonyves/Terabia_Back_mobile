const { User, Product, Order, sequelize } = require('../models'); // Import Product and Order models, and sequelize instance

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const [updatedRows] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updatedUser = await User.findByPk(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedRows = await User.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Total Products
    const totalProducts = await Product.count({
      where: { seller_id: sellerId },
    });

    // Active Products
    const activeProducts = await Product.count({
      where: { seller_id: sellerId, is_active: true },
    });

    // Total Orders and Revenue (more complex due to items being JSONB)
    // This will require a raw query or more complex Sequelize logic to sum across JSONB items
    const ordersStats = await sequelize.query(`
      SELECT
        COUNT(DISTINCT o.id) AS "totalOrders",
        SUM(CAST(item->>'price' AS REAL) * CAST(item->>'quantity' AS INTEGER)) AS "totalRevenue"
      FROM orders AS o,
      json_each(o.items) AS item
      JOIN products AS p ON CAST(item->>'productId' AS INTEGER) = p.id
      WHERE p.seller_id = :sellerId
    `, {
      replacements: { sellerId },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      totalProducts,
      activeProducts,
      totalOrders: ordersStats[0].totalOrders || 0,
      totalRevenue: ordersStats[0].totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
