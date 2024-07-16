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
    const getUserQuerye = 'select * from rmt_order_document'
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
    const getUserQuerye = "select * from rmt_order_document where DOCUMENT_ID='"+id+"'"
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
const updateItem = async (id,req,doc_path,doc_name) => {
    const registerQuery = `UPDATE rmt_order_document SET ORDER_ID='${req.order_id}',DOCUMENT_TYPE='${req.document_type}',DOCUMENT_NAME='${doc_name}',DOCUMENT_PATH='${doc_path}' WHERE DOCUMENT_ID='${id}'`;
    const registerRes = await runQuery(registerQuery);
    return registerRes;
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getId = await utils.isIDGood(id,'DOCUMENT_ID','rmt_order_document')
    if(getId){
        let doc_path='';
        const {document_name,order_id,document_file}=req.body;
        if(document_file != '') {
            filename =document_name+'_'+order_id+'_'+Date.now()+'.jpg';
            doc_path = await utils.uploadFileToS3bucket(req,filename);
            doc_path =doc_path.data.Location
        }  
      const updatedItem = await updateItem(id,req.body,doc_path,document_name);
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
const createItem = async (req,doc_path,doc_name) => {
    const registerQuery = `INSERT INTO rmt_order_document(ORDER_ID,DOCUMENT_TYPE,DOCUMENT_NAME,DOCUMENT_PATH) VALUES('${req.order_id}','${req.document_type}','${doc_name}','${doc_path}')`;
    const registerRes = await runQuery(registerQuery);
    console.log(registerQuery)
    return registerRes;
}
exports.createItem = async (req, res) => {
  try {
    let doc_path='';
    const {document_name,order_id,document_file}=req.body;
    if(document_file != '') {
        filename =document_name+'_'+order_id+'_'+Date.now()+'.jpg';
        doc_path = await utils.uploadFileToS3bucket(req,filename);
        doc_path =doc_path.data.Location
    } 
    const item = await createItem(req.body,doc_path,document_name)
    if(item.insertId){
    return res.status(200).json(utils.buildcreatemessage(200,'Record Inserted Successfully',item))
    }else{
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
  }
}

const deleteItem = async (id) => {
  const deleteQuery = `DELETE FROM rmt_order_document WHERE DOCUMENT_ID='${id}'`;
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
    const getId = await utils.isIDGood(id,'DOCUMENT_ID','rmt_order_document')
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