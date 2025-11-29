const { Delivery } = require('../models');

exports.createDelivery = async (req, res) => {
  try {
    const newDelivery = await Delivery.create(req.body);
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const [updatedRows] = await Delivery.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    const updatedDelivery = await Delivery.findByPk(req.params.id);
    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const deletedRows = await Delivery.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeliveryByOrderId = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      where: { order_id: req.params.order_id },
    });
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found for this order' });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
