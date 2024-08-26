const utils = require('../../../middleware/utils')
const { insertQuery,fetch} = require('../../../middleware/db')
const { FETCH_DELIVERY_BOY_ADDRESS_BOOK_QUERY, INSERT_DELIVERY_BOY_ADDRESS_BOOK_QUERY, DELETE_DELIVERY_BOY_ADDRESS_BOOK_QUERY, transformKeysToLowercase,} = require('../../../db/database.query')


exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data =await transformKeysToLowercase(await fetch(FETCH_DELIVERY_BOY_ADDRESS_BOOK_QUERY,[id]));
    let message="Addresses retrieved successfully";
    if(data.length <=0){
        message="No addresses found."
        return res.status(400).json(utils.buildErrorObject(400,message,1001));
    }
    return res.status(200).json(utils.buildCreateMessage(200,message,data))
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to fetch addresses. Please try again later.',1001));
  }
}

exports.createAddressBook = async (req, res) => {
  try {
    const executedResult = await createNewAddress(req.body)
    if(executedResult.insertId){
      const response = req.body;
      response.id = executedResult.insertId;
      return res.status(200).json(utils.buildCreateMessage(200,'Record Inserted Successfully', response))
    }else{
      return res.status(500).json(utils.buildErrorObject(500,'Unable to create address. Please try again later.',1001));
    }
  } catch (error) {
    return res.status(500).json(utils.buildErrorObject(500,'Unable to create address. Please try again later.',1001));
  }
}

const createNewAddress = async (req) => {
  const executeCreateNewAddress = await insertQuery(INSERT_DELIVERY_BOY_ADDRESS_BOOK_QUERY,[req.delivery_boy_ext_id, req.first_name, req.last_name, req.address, req.email, req.phone, req.company_name, req.comments]);
  console.log(executeCreateNewAddress);
  return executeCreateNewAddress;
}

