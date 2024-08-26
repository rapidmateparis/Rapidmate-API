const { INSERT_LANG, UPDATE_LANG, FETCH_ALL_LANG, FETCH_LANG_BYID, DELETE_LANG, INSERT_USER_LANG, FETCH_USER_LANGBYID, FETCH_LANG_BYCONSUMEREXT, FETCH_LANG_BYDELIVERBOYEXT, FETCH_LANG_BYENTERPRISEEXT, UPDATE_USER_LANG, DELETE_USER_LANG } = require('../../../db/database.query');
const { insertQuery, updateQuery, runQuery, fetch } = require('../../../middleware/db');
const utils= require('../../../middleware/utils')

/********************
 * Private functions *
 ********************/

/**
 * Create languages function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req) => {
    const registerRes = await insertQuery(INSERT_LANG,[req.name,req.code]);
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    const doesNameExists =await utils.nameExists(req.body.code,'rmt_languages','code')
    if (!doesNameExists) {
      const item = await createItem(req.body)
      if(item.insertId){
        const currentdata=await fetch(FETCH_LANG_BYID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
      }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create language. Please try again later.',1001));
      }
    }else{
      return res.status(400).json(utils.buildErrorObject(400,'Language  already exists',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create language. Please try again later.',1001));
  }
}

/**
 * Update language function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (id,req) => {
    const registerRes = await updateQuery(UPDATE_LANG,[req.name,req.code,id]);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_languages')
    if(getId){
      const updatedItem = await updateItem(id, req.body);
      if (updatedItem.affectedRows > 0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update state. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Languages not found. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update state. Please try again later.',1001));
  }  
}

/**
 * Get languages function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
    try {
      const data = await runQuery(FETCH_ALL_LANG)
      let message="Languages retrieved successfully";
      if(data.length <=0){
          message="No languages found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unble to fetch languages. Please try again later.',1001));
    }
}

/**
 * Get language function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await fetch(FETCH_LANG_BYID,[id])
      let message="Language retrieved successfully";
      if(data.length <=0){
          message="No language found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch language. please try again later.',1001));
    }
}

const deleteItem = async (id) => {
    const deleteRes = await updateQuery(DELETE_LANG,[id]);
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
      const getId = await utils.isIDGood(id,'id','rmt_languages')
      if(getId){
        const deletedItem = await deleteItem(getId);
        if (deletedItem.affectedRows > 0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
        } else {
          return res.status(500).json(utils.buildErrorObject(500,'Unable to delete language. Please try again later.',1001));
        }
      }
      return res.status(400).json(utils.buildErrorObject(400,'Language not found. Please provide detail and try again later.',1001));
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unable to delete language. Please try again later.',1001));
    }
}


/********************
 * Public functions *
 ********************/

/**
 * Create user languages function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createUserLang = async (req) => {
    let consumer_id=null;
    let delivery_boy_id=null;
    let enterprise_id=null;
    if(req.role=='CONSUMER'){
        consumer_id=req.ext_id
    }else if(req.role=='DELIVERY_BOY'){
        delivery_boy_id=req.ext_id
    }else if(req.role=='ENTERPRISE'){
        enterprise_id=req.ext_id
    }
    const registerRes = await insertQuery(INSERT_USER_LANG,[consumer_id,delivery_boy_id,enterprise_id,req.lang_id]);
    return registerRes;
}
exports.createUserLang = async (req, res) => {
  try {
    const item = await createUserLang(req.body)
    if(item.insertId){
        const currentdata=await fetch(FETCH_USER_LANGBYID,[item.insertId])
        return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully',currentdata))
    }else{
        return res.status(500).json(utils.buildErrorObject(500,'Unable to create language. Please try again later.',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create language. Please try again later.',1001));
  }
}

/**
 * Update user language function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateUserLang = async (id,req) => {
    let consumer_id=null;
    let delivery_boy_id=null;
    let enterprise_id=null;
    if(req.role=='CONSUMER'){
        consumer_id=req.ext_id
    }else if(req.role=='DELIVERY_BOY'){
        delivery_boy_id=req.ext_id
    }else if(req.role=='ENTERPRISE'){
        enterprise_id=req.ext_id
    }
    const registerRes = await updateQuery(UPDATE_USER_LANG,[consumer_id,delivery_boy_id,enterprise_id,req.lang_id,id]);
    return registerRes;
}

exports.updateUserLang = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'id','rmt_user_languages')
    if(getId){
      const updatedItem = await updateUserLang(id, req.body);
      if (updatedItem.affectedRows > 0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
      } else {
        return res.status(500).json(utils.buildErrorObject(500,'Unable to update language. Please try again later.',1001));
      }
    }
    return res.status(500).json(utils.buildErrorObject(500,'Languages not found. Please provide detail and try again later.',1001));
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to update language. Please try again later.',1001));
  }  
}

/**
 * Get user languages by consumer function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getByconsumerExt = async (req, res) => {
    try {
       const {id}=req.params
      const data = await fetch(FETCH_LANG_BYCONSUMEREXT,[id])
      let message="Languages retrieved successfully";
      if(data.length <=0){
          message="No languages found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unble to fetch languages. Please try again later.',1001));
    }
}

/**
 * Get user languages by delivery boy function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getBydeliveryboyExt = async (req, res) => {
    try {
       const {id}=req.params
      const data = await fetch(FETCH_LANG_BYDELIVERBOYEXT,[id])
      let message="Languages retrieved successfully";
      if(data.length <=0){
          message="No languages found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unble to fetch languages. Please try again later.',1001));
    }
}

/**
 * Get user languages by enterprise function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getByenterpriseExt = async (req, res) => {
    try {
       const {id}=req.params
      const data = await fetch(FETCH_LANG_BYENTERPRISEEXT,[id])
      console.log(data)
      let message="Languages retrieved successfully";
      if(data.length <=0){
          message="No languages found"
          return res.status(400).json(utils.buildErrorObject(400,message,1001));
      }
      return res.status(200).json(utils.buildCreateMessage(200,message,data))
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unble to fetch languages. Please try again later.',1001));
    }
}

const deleteuserItem = async (id) => {
    const deleteRes = await updateQuery(DELETE_USER_LANG,[id]);
    return deleteRes;
};
  /**
   * Delete item function called by route
   * @param {Object} req - request object
   * @param {Object} res - response object
   */
exports.deleteuserItem = async (req, res) => {
    try {
      const {id} =req.params
      const getId = await utils.isIDGood(id,'id','rmt_user_languages')
      if(getId){
        const deletedItem = await deleteuserItem(getId);
        if (deletedItem.affectedRows > 0) {
          return res.status(200).json(utils.buildUpdatemessage(200,'Record Deleted Successfully'));
        } else {
          return res.status(500).json(utils.buildErrorObject(500,'Unable to delete language. Please try again later.',1001));
        }
      }
      return res.status(400).json(utils.buildErrorObject(400,'Language not found. Please provide detail and try again later.',1001));
    } catch (error) {
      return res.status(500).json(utils.buildErrorObject(500,'Unable to delete language. Please try again later.',1001));
    }
}
