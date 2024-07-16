const utils = require('../middleware/utils')
const { runQuery } = require('../middleware/db')
const auth = require('../middleware/auth')

/********************
 * Public functions *
 ********************/
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const getUserQuerye = 'select * from rmt_job'
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
      message="No items found"
      return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const getUserQuerye = "select * from rmt_job where ID='"+id+"'"
    const data = await runQuery(getUserQuerye)
    let message="Items retrieved successfully";
    if(data.length <=0){
        message="No items found"
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildcreatemessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req,imageone,imagetwo,imagethree) => {
    
    const registerQuery = `UPDATE rmt_job SET ORDER_ID='${req.order_id}',USER_ID='${req.user_id}',PICKUP_TYPE='${req.pickup_type}',CONTACT_PERSON='${req.contact_person}',CONTACT_NUMBER='${req.contact_number}',EMAIL='${req.email}',NOTES='${req.notes}',PICKUP_LOCATION_ID='${req.pickup_location_id}',DROPOFF_LOCATION_ID='${req.dropoff_location_id}',DELIVERY_BOY_ID='${req.delivery_boy_id}',PACKAGE_IMG1='${imageone}',PACKAGE_IMG2='${imagetwo}' ,PACKAGE_IMG3='${imagethree}',DELIVERY_STATUS='${req.delivery_status}',DELIVERY_NOTES='${req.delivery_notes}',ESTIMATE_PRICE='${req.estimate_price}',COUPON_CODE='${req.coupon_code}',DISCOUNT_AMOUNT='${req.discount_amount}',AMOUNT='${req.amount}',PAYMENT_REF_ID='${req.payment_ref_id}',DELIVERY_DATE='${req.delivery_date}',IS_DEL='${req.is_del}'  WHERE ID='${id}'`;
    const registerRes = await runQuery(registerQuery);
    
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'ID','rmt_job')
    if(getId){
     const {package_image_one,package_image_two,package_image_three}=req.body
      let imageone='';
      let imagetwo='';
      let imagethree='';
      let filename='';
      // console.log(req.body)
      if(package_image_one != '') {
        filename ='package_one_'+Date.now()+'.jpg';
        imageone = await utils.uploadFileToS3bucket(req,filename);
        imageone =imageone.data.Location
      }
      if(package_image_two != '') {
        filename ='package_two_'+Date.now()+'.jpg';
        imagetwo = await utils.uploadFileToS3bucket(req,filename);
        imagethree =imagetwo.data.Location
      }
      if(package_image_three != '') {
        filename ='package_three_'+Date.now()+'.jpg';
        imagethree = await utils.uploadFileToS3bucket(req,filename);
        imagethree =imagethree.data.Location
      } 
      const updatedItem = await updateItem(id,req.body,imageone,imagetwo,imagethree);
      if(updatedItem) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
    
}
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req,imageone,imagetwo,imagethree) => {
    const registerQuery = `INSERT INTO rmt_job(ORDER_ID,USER_ID,PICKUP_TYPE,CONTACT_PERSON,CONTACT_NUMBER,EMAIL,NOTES,PICKUP_LOCATION_ID,DROPOFF_LOCATION_ID,DELIVERY_BOY_ID,PACKAGE_IMG1,PACKAGE_IMG2,PACKAGE_IMG3,DELIVERY_STATUS,DELIVERY_NOTES,ESTIMATE_PRICE,COUPON_CODE,DISCOUNT_AMOUNT,AMOUNT,PAYMENT_REF_ID,DELIVERY_DATE,IS_DEL) VALUES('${req.order_id}','${req.user_id}','${req.pickup_type}','${req.contact_person}','${req.contact_number}','${req.email}','${req.notes}','${req.pickup_location_id}','${req.dropoff_location_id}','${req.delivery_boy_id}','${imageone}','${imagetwo}','${imagethree}','${req.delivery_status}','${req.delivery_notes}','${req.estimate_price}','${req.coupon_code}','${req.discount_amount}','${req.amount}','${req.payment_ref_id}','${req.delivery_date}','${req.is_del}')`;
    const registerRes = await runQuery(registerQuery);
    console.log(registerQuery)
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.order_id,'rmt_job','ORDER_ID')
    if (!doesNameExists) {
        const {package_image_one,package_image_two,package_image_three}=req.body
        let imageone='';
        let imagetwo='';
        let imagethree='';
        let filename='';
        // console.log(req.body)
    //     if(package_image_one != '') {
    //       filename ='package_one_'+Date.now()+'.jpg';
    //       imageone = await utils.uploadFileToS3bucket(req,filename);
    //       imageone =imageone.data.Location
    //     }
    //     if(package_image_two != '') {
    //       filename ='package_two_'+Date.now()+'.jpg';
    //       imagetwo = await utils.uploadFileToS3bucket(req,filename);
    //       imagethree =imagetwo.data.Location
    //     }
    //     if(package_image_three != '') {
    //       filename ='package_three_'+Date.now()+'.jpg';
    //       imagethree = await utils.uploadFileToS3bucket(req,filename);
    //       imagethree =imagethree.data.Location
    //     }
      const item = await createItem(req.body,imageone,imagetwo,imagethree)
      if(item.insertId){
        return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Order job already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_job WHERE ID='${id}'`;
  const deleteRes = await runQuery(deleteQuery);
  return deleteRes;
};
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const {id} =req.params
    const getId = await utils.isIDGood(id,'ID','rmt_job')
    if(getId){
      const deletedItem = await deleteItem(getId);
      if(deletedItem.affectedRows > 0) {
        return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
      }
    }
    return res.status(400).json(utils.buildErrorObject(400,'Data not found.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}