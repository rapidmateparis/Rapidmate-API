const pool = require("../../../config/database");
const utils = require("../../middleware/utils");
const notification = require("../common/Notifications/notification");
exports.deliveryBoyAssigner = async (req, res) => {
  const connection = await pool.getConnection();
  const { deliveryBoyId, slots, orderNumber } = req.body;
  if (!deliveryBoyId || !slots || !Array.isArray(slots)) {
    return res.status(400).json(utils.buildErrorObject(400, "Invalid input provide.", 1001));
  }
  try {
    const [deliveryboy] = await connection.query(`SELECT * FROM rmt_delivery_boy WHERE id = ?`,[deliveryBoyId]);
    for (const slot of slots) {
      const { id, slot_date, from_time, to_time } = slot;

      // Validation: Check for conflicts
      const [existing] = await connection.query(
        `SELECT * FROM rmt_enterprise_order_slot WHERE delivery_boy_id = ? AND slot_date = ? AND ((from_time < ? AND to_time > ?) OR (from_time < ? AND to_time > ?))`,
        [deliveryBoyId, slot_date, to_time, from_time, from_time, to_time]
      );

      if (existing.length > 0) {
        throw new Error(
          `Conflict detected for delivery boy ID ${deliveryBoyId} on ${slot_date} between ${from_time} and ${to_time}`
        );
      }

      // Update the slot
      await connection.query(
        `UPDATE rmt_enterprise_order_slot SET order_status ='ASSIGNED', next_action_status='Start', delivery_boy_id = ?, updated_on = NOW() WHERE id = ?`,
        [deliveryBoyId, id]
      );
    }

    // Commit the transaction
    await connection.commit();
    var notifiationRequest = {
      title: "New order received!!!Order# : " + orderNumber,
      body: {},
      payload: {
        message: "You have been received new order successfully",
        orderNumber: orderNumber,
        slotId: "",
        orderStatus: "ASSIGNED",
      },
      extId: orderNumber,
      message: "You have been received new order successfully",
      topic: "",
      token: "",
      senderExtId: "",
      receiverExtId: deliveryboy[0].ext_id,
      statusDescription: "",
      status: "",
      notifyStatus: "",
      tokens: "",
      tokenList: "",
      actionName: "",
      path: "",
      userRole: "DELIVERY_BOY",
      redirect: "ORDER",
    };
    notification.createNotificationRequest(notifiationRequest, true);

    return res.status(200).json(utils.buildUpdatemessage(200, "Slots assigned successfully"));
  } catch (error) {
    await connection.rollback();
    return res
      .status(400)
      .json(utils.buildErrorObject(400, error.message, 1001));
  }
};
