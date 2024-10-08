const utils =require('../../../middleware/utils')
const {runQuery,fetch, updateQuery}=require('../../../middleware/db')
const { FETCH_CONSUMER, FETCH_DELIVERY_BOY, FETCH_ENTERPRISE, FETCH_DELIVERY_BOY_ID, FETCH_ENTERPRISE_ID, transformKeysToLowercase, UPDATE_DELIVERY_BOY_STATUS, UPDATE_ENTERPRISE_STATUS } = require('../../../db/database.query')
const DELIVERY_BOY='DELIVERY_BOY'
const CONSUMER='CONSUMER'
const ENTERPRISE='ENTERPRISE'

/**
 * Get rolebase function called by route
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getJoinRequest=async (req,res)=>{
    try{
        const {role,status}=req.body
        let filterValue=0;
        if(role==DELIVERY_BOY){
            queryReq=FETCH_DELIVERY_BOY
        }else if(role==ENTERPRISE){
            queryReq=FETCH_ENTERPRISE
        }else{
            return res.status(400).json(utils.buildErrorObject(400,'Role does not matched.',1001));
        }
        if(status=='ACCEPTED'){
            filterValue=1
        }else if(status=='REJECTED'){
            filterValue=2
        }else{
            filterValue=0
        }
        const data = await fetch(queryReq,[filterValue]);
        console.log(data);
        var filterdata;
        var message;
        if(data){
            filterdata = await transformKeysToLowercase(data)
            message="Items retrieved successfully";
            if(data.length <=0){
                message="No items found"
                return res.status(400).json(utils.buildErrorObject(400,message,1001));
            }
        }
        return res.status(200).json(utils.buildCreateMessage(200,message,filterdata))

    }catch (error) {
        console.log(error);
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
}

/**
 * Get userById and rolebase function called by route
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.viewJoinRequest=async (req,res)=>{
    try{
        const {role,ext_id}=req.body
        if(role==DELIVERY_BOY){
            queryReq=FETCH_DELIVERY_BOY_ID
        }else if(role==ENTERPRISE){
            queryReq=FETCH_ENTERPRISE_ID
        }
        const data=await fetch(queryReq,[ext_id])
        let message="Users retrieved successfully";
        if(data.length <=0){
            message="No items found"
            return res.status(400).json(utils.buildErrorObject(400,message,1001));
        }
        return res.status(200).json(utils.buildCreateMessage(200,message,data))
    }catch (error) {
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
}

/**
 * update joinRequest by status 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.acceptOrRejectJoinRequest=async (req,res)=>{
    try{
        const {status,role,reason, ext_id}=req.body
        let filterValue='';
        let queryReq='';
        let columnName='';
        let tableName='';
        if(role==DELIVERY_BOY){
            queryReq=UPDATE_DELIVERY_BOY_STATUS
            columnName='ext_id'
            tableName='rmt_delivery_boy'
        }else if(role==ENTERPRISE){
            queryReq=UPDATE_ENTERPRISE_STATUS
            columnName='ext_id'
            tableName='rmt_enterprise'
        }else{
            return res.status(400).json(utils.buildErrorObject(400,'Role does not matched.',1001));
        }
        if(status=='ACCEPTED'){
            filterValue=1
        }else if(status=='REJECTED'){
            filterValue=2
        }else{
            filterValue=0
        }
        const getId = await utils.isIDGood(ext_id,columnName,tableName)
        if(getId){
            const updatedItem = await updateQuery(queryReq,[filterValue,reason,ext_id]);
            if (updatedItem.affectedRows >0) {
                return res.status(200).json(utils.buildUpdatemessage(200,'Record Updated Successfully'));
            } else {
              return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
            }
        }

        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }catch (error) {
        console.log(error);
        return res.status(500).json(utils.buildErrorObject(500,'Something went wrong',1001));
    }
}



