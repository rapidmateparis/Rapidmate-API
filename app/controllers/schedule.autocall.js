const utils = require('../middleware/utils')
const cron = require('node-cron');
exports.schedule=async(req,res)=>{
    const { orderId, schedule_date_time } = req.body;
    try {
        const scheduleTime = new Date(schedule_date_time);
        const searchTime = new Date(scheduleTime);
        searchTime.setMinutes(scheduleTime.getMinutes() - 30); // set time before 30 minute search
        const cronExpression = `${searchTime.getMinutes()} ${searchTime.getHours()} ${searchTime.getDate()} ${searchTime.getMonth() + 1} *`;
        cron.schedule(cronExpression, async () => {
            try {
                //here  write after payment code.

            } catch (error) {
                return res.status(500).json(utils.buildErrorObject(500,'Unable to create schedule. Please try again later.',1001)); 
            }
        });
    } catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create schedule. Please try again later.',1001)); 
    }
}