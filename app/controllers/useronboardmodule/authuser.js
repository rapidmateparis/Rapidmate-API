const bcrypt = require('bcrypt');
const { runQuery , fetch, updateQuery} = require("../../middleware/db");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const utils=require("../../middleware/utils");
var AWS = require("aws-sdk");
const { table } = require('console');
const { randomUUID } = require('crypto');
var cognito_poolId = process.env.COGNITO_POOLID;
var cognito_region = process.env.COGNITO_REGION;
var cognito_accessKeyId = process.env.COGNITO_ACCESS_KEY_ID;
var cognito_secretAccessKey = process.env.COGNITO_SECRET_ACCESS_KEY;
const userPoolId = process.env.USER_POOLID;
const ClientId = process.env.CLIENT_ID;
const ADMIN_ROLE = "ADMIN";
const DELEIVERY_BOY_ROLE = "DELIVERY_BOY";
const ENTERPRISE_ROLE = "ENTERPRISE";
const CONSUMER_ROLE = "CONSUMER";
const logger = require('log4js').getLogger(require('path').basename(__filename));
var poolData =
{
    UserPoolId : userPoolId, // Your user pool id here
    ClientId :  ClientId// sempercon2 client id here
};


const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: userPoolId,
    tokenUse: "access",
    clientId: ClientId,
    Scope: "read",
    includeRawJwtInErrors: true
});


function createUser(userInfo) {
  return new Promise(resolve => {

        logger.info("createUser called");

        var UserAttributes = [
            {
                Name: 'name', Value: userInfo["userName"]
            },
            {
                Name: 'email', Value: userInfo["userName"]
            },
            {
                Name: 'phone_number', Value: userInfo["phoneNumber"]
            },
            {
                Name: 'custom:userrole', Value: userInfo["userrole"]
            },
            { Name: 'custom:first_name', Value: userInfo["firstName"] },
            { Name: 'custom:last_name', Value: userInfo["lastName"] },
            { Name: 'custom:company_name', Value: userInfo["companyName"] },
            { Name: 'custom:industry', Value: userInfo["industry"] },
            { Name: 'custom:delivery_per_hour', Value: userInfo["deliveryPerHour"] },
            { Name: 'custom:description', Value: userInfo["description"] },
            { Name: 'custom:term_cond2', Value: userInfo["termCondtwo"] },
            { Name: 'custom:account_type', Value: userInfo["accountType"] },
            { Name: 'custom:term_cond1', Value: userInfo["termCondone"] },
            { Name: 'custom:city', Value: userInfo["city"] },
            { Name: 'custom:state', Value: userInfo["state"] },
            { Name: 'custom:country', Value: userInfo["country"] },
            { Name: 'custom:siret_no', Value: userInfo["siretNo"] }
        ]


        var params =
        {
            UserPoolId: userPoolId, // Your user pool id here
            Username: userInfo["userName"],
            DesiredDeliveryMediums:
            [ "EMAIL"],
            //TemporaryPassword: 'Password_1',
            UserAttributes: UserAttributes
        };

        var cognitoidentityserviceprovider  = new AWS.CognitoIdentityServiceProvider({region:cognito_region,
          accessKeyId: cognito_accessKeyId,
          secretAccessKey: cognito_secretAccessKey,
          poolId: cognito_poolId});

        cognitoidentityserviceprovider.adminCreateUser(params,function(err, data)
        {
            if (err) {
                logger.error('createUser error')
                logger.error(err);
                resolve(err);
            }
            else {
                logger.info(data);
                logger.info("createUser completion");
                delete params["UserAttributes"];
                delete params["DesiredDeliveryMediums"];
                resolve(updateandSendUserInfo(cognitoidentityserviceprovider, params));
            }
        });
  });
}

async function signup(userInfo) {
    console.log(process.env.PROD_FLAG);
    if(process.env.PROD_FLAG == "true"){
        try {
            logger.info("selfSignUp called");
        
            const UserAttributes = [
              { Name: 'name', Value: userInfo["userName"] },
              { Name: 'email', Value: userInfo["email"] },
              { Name: 'phone_number', Value: userInfo["phoneNumber"] }
              // Add other attributes as needed
            ];
        
            const params = {
              ClientId: ClientId, // Your app client id here
              Username: userInfo["userName"],
              Password: userInfo["password"], // Collect user password for self-signup
              UserAttributes: UserAttributes
            };
        
            const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
              region: cognito_region,
              accessKeyId: cognito_accessKeyId,
              secretAccessKey: cognito_secretAccessKey
            });
        
            // Wrap the signUp method in a promise
            const signUpPromise = () => {
              return new Promise((resolve, reject) => {
                cognitoidentityserviceprovider.signUp(params, (err, data) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(data);
                  }
                });
              });
            };
        
            const data = await signUpPromise();
        
            logger.info(data);
            logger.info("selfSignUp completion");
        
            let externalId = new Date().getTime();
            if (userInfo['userrole'] === CONSUMER_ROLE) {
              makeRoleExtId = "C" + externalId;
              const item = await createItem(userInfo, "rmt_consumer",makeRoleExtId);
            } else if (userInfo['userrole'] === DELEIVERY_BOY_ROLE) {
              makeRoleExtId = "D"+  externalId;
              const item = await createItem(userInfo, "rmt_delivery_boy",makeRoleExtId);
            } else if (userInfo['userrole'] === ENTERPRISE_ROLE) {
              makeRoleExtId = "E" + externalId;
              const item = await createItem(userInfo, "rmt_enterprise",makeRoleExtId);
            } else if (userInfo['userrole'] === ADMIN_ROLE) {
              makeRoleExtId = "A" + externalId;
              const item = await createItem(userInfo, "rmt_admin_user",makeRoleExtId);
            } 
        
            return {  user_profile : await getUserProfile(userInfo["userName"]), extId: makeRoleExtId,role:userInfo['userrole'], ...data };
        
          } catch (err) {
            logger.error('selfSignUp error');
            logger.error(err);
            throw err;
          }
    }else{
        const userData = await getUserProfile(userInfo["userName"]);
        if(userData && userData.length>0){
           return null;
        }else{
            let externalId = new Date().getTime();
            if (userInfo['userrole'] === CONSUMER_ROLE) {
              makeRoleExtId = "C" + externalId;
              const item = await createItem(userInfo, "rmt_consumer",makeRoleExtId);
            } else if (userInfo['userrole'] === DELEIVERY_BOY_ROLE) {
              makeRoleExtId = "D"+  externalId;
              const item = await createItem(userInfo, "rmt_delivery_boy",makeRoleExtId);
            } else if (userInfo['userrole'] === ENTERPRISE_ROLE) {
              makeRoleExtId = "E" + externalId;
              const item = await createItem(userInfo, "rmt_enterprise",makeRoleExtId);
            } else if (userInfo['userrole'] === ADMIN_ROLE) {
              makeRoleExtId = "A" + externalId;
              const item = await createItem(userInfo, "rmt_admin_user",makeRoleExtId);
            } 
            return {  user_profile : await getUserProfile(userInfo["userName"]), extId: makeRoleExtId,role:userInfo['userrole'], 
                UserConfirmed: false,
                CodeDeliveryDetails: {
                    Destination: "y***@a***",
                    DeliveryMedium: "EMAIL",
                    AttributeName: "email"
                },
                UserSub: "504c293c-6071-7038-79ab-1a533d329eff"
            };
        }
            
    }
    
  }
  
async function createItem(userinfo,tablename,extIds){
    var registerQuery=""
    const password= await bcrypt.hash(userinfo['password'], 10);
    // password = userinfo['password'];
    if(tablename=='rmt_consumer'){
      registerQuery = `INSERT INTO rmt_consumer(EXT_ID,USERNAME,PHONE,EMAIL,EMAIL_VERIFICATION,PASSWORD,COUNTRY_ID,TERM_COND1,FIRST_NAME,LAST_NAME,token,verification_code) VALUES('${extIds}','${userinfo['userName']}','${userinfo['phoneNumber']}','${userinfo['email']}','0','${password}','${userinfo['country']}','1','${userinfo['firstName']}','${userinfo['lastName']}','${userinfo['token']}',123456)`;
    }
    if(tablename=='rmt_delivery_boy'){
        registerQuery = `INSERT INTO rmt_delivery_boy(EXT_ID,USERNAME,FIRST_NAME,LAST_NAME,EMAIL,EMAIL_VERIFICATION,PHONE,PASSWORD,CITY_ID,STATE_ID,COUNTRY_ID,SIRET_NO,TERM_COND1,token,verification_code) VALUES('${extIds}','${userinfo['userName']}','${userinfo['firstName']}','${userinfo['lastName']}','${userinfo['email']}','0','${userinfo['phoneNumber']}','${password}','${userinfo['city']}','${userinfo['state']}','${userinfo['country']}','${userinfo['siretNo']}','${userinfo['termone']}','${userinfo['token']}',123456)`;
    }
    if(tablename=='rmt_enterprise'){
        registerQuery = `INSERT INTO rmt_enterprise(EXT_ID,USERNAME,FIRST_NAME,LAST_NAME,EMAIL,is_email_verified,PHONE,PASSWORD,CITY_ID,STATE_ID,COUNTRY_ID,SIRET_NO,TERM_COND1,TERM_COND2,DESCRIPTION,company_name,industry_type_id,token,verification_code) VALUES('${extIds}','${userinfo['userName']}','${userinfo['firstName']}','${userinfo['lastName']}','${userinfo['email']}','0','${userinfo['phoneNumber']}','${password}','${userinfo['city']}','${userinfo['state']}','${userinfo['country']}','${userinfo['siretNo']}','${userinfo['termone']}','${userinfo['termtwo']}','${userinfo['description']}','${userinfo['companyName']}','${userinfo['industryId']}','${userinfo['token']}',123456)`;
    }
    if(tablename=='rmt_admin_user'){
        registerQuery = `INSERT INTO rmt_admin_user(EXT_ID,USERNAME,FIRST_NAME,LAST_NAME,EMAIL,PHONE,PASSWORD,token,verification_code) VALUES('${extIds}','${userinfo['userName']}','${userinfo['firstName']}','${userinfo['lastName']}','${userinfo['email']}','${userinfo['phoneNumber']}','${password}','${userinfo['token']}',123456)`; //(LPAD(FLOOR(RAND() * 999999.99),6,  '0')
    }
    // console.log("queery "+registerQuery)
    const registerRes = runQuery(registerQuery);
    return registerRes;
}
async function signupVerify(userInfo) {
    if(process.env.PROD_FLAG == "true"){
        return new Promise((resolve, reject) => {
            logger.info("selfSignUp called");
            const params = {
              ClientId: ClientId, // Your app client id here
              Username: userInfo["userName"],
              ConfirmationCode: userInfo["code"], // Collect user password for self-signup
            };
        
            const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
              region: cognito_region,
              accessKeyId: cognito_accessKeyId,
              secretAccessKey: cognito_secretAccessKey
            });
        
            cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
              if (err) {
                logger.error('selfSignUp error');
                logger.error(err);
                reject(err);
              } else {
                logger.info(data);
                logger.info("selfSignUp completion");
                resolve(data);
              }
            });
          });
    }else{
        logger.info("Internal Verify");
        var userName = userInfo["userName"];
        var code = userInfo["code"];
        const userData = await fetch("select * from vw_rmt_user where username = ? and verification_code = ?", [userName, code]);
        if(userData && userData.length > 0 ){
            var role = userData[0].role;
            var tableName = "";
            if(role=='DELIVERY_BOY'){
                tableName = "rmt_delivery_boy";
            }else  if(role=='CONSUMER'){
                tableName = "rmt_consumer";
            }else  if(role=='ENTERPRISE'){
                tableName = "rmt_enterprise";
            }else  if(role=='ADMIN'){
                tableName = "rmt_admin_user";
            }
            const updateTokenToProfile = await updateQuery("update " + tableName + " set is_email_verified = 1 where username = ?", [userName]);
            return {};
        }else{
            return null;
        }
    }
}


async function login(userInfo) {
    if(process.env.PROD_FLAG == "true"){
        return new Promise((resolve , reject) => {
                var authenticationData =
                {
                    Username : userInfo["userName"],
                    Password : userInfo["password"],
                };
                var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
                var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

                var userData =
                {
                    Username : userInfo["userName"],
                    Pool : userPool
                };
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                console.log("=> "+cognitoUser)
                cognitoUser.authenticateUser(authenticationDetails,
                {
                    newPasswordRequired: function (userAttributes, requiredAttributes)
                    {
                        var newPassword = userInfo["newPassword"];
                        if(newPassword) {

                        /*delete userAttributes['email_verified'];
                        delete userAttributes['phone_number'];
                        delete userAttributes['email'];*/

                        var nUserAttributes = {};
                        nUserAttributes["name"] = userAttributes["name"];
                        var successDelegate = this;

                        cognitoUser.completeNewPasswordChallenge(newPassword, nUserAttributes,
                        {
                            onSuccess: function (result)
                            {
                                logger.info("onSuccess");
                                logger.info(result);
                                //resolve(setandSendUserInfo(cognitoUser, result));
                                resolve(updateEmailVerification(cognitoUser, result, userInfo["userName"]));
                            },
                            onFailure: function(cognitoErr)
                            {
                                logger.error("completeNewPasswordChallenge onFailure");
                                logger.error(cognitoErr);
                                resolve(cognitoErr);
                            },
                        });

                        } else {
                        var body = {};
                        body["error"] = {"message" : "newPasswordRequired"};
                        body["userAttributes"] = userAttributes;
                        body["requiredAttributes"] = requiredAttributes;
                        resolve(body);
                        }
                    },
                    onSuccess: function (result)
                    {
                        logger.info("onSuccess");
                        logger.info(result);
                        username = userInfo["userName"];
                        console.log(username);
                        loginResponseData(resolve, reject, result, userInfo);
                        // resolve(result);
                    },
                    onFailure: function(cognitoErr)
                    {
                        logger.error("onFailure");
                        logger.error(cognitoErr);
                        resolve(cognitoErr);
                    },
                });
        });
    }else{
        return new Promise((resolve , reject) => {
            loginResponseDataWithoutAWS(resolve , reject, userInfo);
        });
     }
}
async function logout(userInfo) {
    if (process.env.PROD_FLAG == "true") {
        return new Promise((resolve, reject) => {
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            var userData = {
                Username: userInfo["userName"],
                Pool: userPool
            };
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

            if (cognitoUser != null) {
                cognitoUser.signOut();
                logger.info("User logged out successfully");
                resolve({ message: "User logged out successfully" });
            } else {
                logger.error("No user to log out");
                resolve({ error: "No user to log out" });
            }
        });
    } else {
        return new Promise((resolve, reject) => {
            logger.info("Logout without AWS");
            resolve({ message: "Logged out without AWS" });
        });
    }
}

async function changePassword(userInfo) {
    return new Promise((resolve, reject) => {
        var authenticationData = {
            Username: userInfo["userName"],
            Password: userInfo["oldPassword"],
        };
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userData = {
            Username: userInfo["userName"],
            Pool: userPool,
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.changePassword(userInfo["oldPassword"], userInfo["newPassword"], function (err, result) {
                    if (err) {
                        logger.error("changePassword onFailure");
                        logger.error(err);
                        resolve(err);
                    } else {
                        logger.info("Password change successful");
                        logger.info(result);
                        resolve(result);
                    }
                });
            },
            onFailure: function (cognitoErr) {
                logger.error("onFailure");
                logger.error(cognitoErr);
                resolve(cognitoErr);
            },
        });
    });
}


async function loginResponseData(resolve, reject, result, userInfo) {
    var username = userInfo["userName"];
    var token = userInfo["token"];
    const profileData = await getUserProfile(username);
    if(profileData && profileData.length > 0){
        var role = profileData[0].role;
        var tableName = "";
        if(role=='DELIVERY_BOY'){
            tableName = "rmt_delivery_boy";
        }else  if(role=='CONSUMER'){
            tableName = "rmt_consumer";
        }else  if(role=='ENTERPRISE'){
            tableName = "rmt_enterprise";
        }else  if(role=='ADMIN'){
            tableName = "rmt_admin_user";
        }
        const updateTokenToProfile = await updateQuery("update " + tableName + " set token = ? where username = ?", [token, username]);
        profileData[0].token = token;
        resolve({
            token:result.accessToken.jwtToken,
            refreshtoken:result.refreshToken.token,
            user: result,
            user_profile : profileData
        })
    }else{
        var body = {};
        body["error"] = {"message" : "Invalid credentials"};
        reject(body);
    }
   
}

async function loginResponseDataWithoutAWS(resolve , reject, userInfo) {
    var username = userInfo["userName"];
    var password  = userInfo["password"];
    var token = userInfo["token"];
    const userData = await getUserDataWithPassword(username);
    if(userData && userData.length > 0){
        return await bcrypt.compare(password, userData[0].password, async function(err, res) {
            if (err){
                reject(null);
            }
            if (res) {
                    const profileData = await getUserProfile(username);
                    var role = profileData[0].role;
                    var tableName = "";
                    if(role=='DELIVERY_BOY'){
                        tableName = "rmt_delivery_boy";
                    }else  if(role=='CONSUMER'){
                        tableName = "rmt_consumer";
                    }else  if(role=='ENTERPRISE'){
                        tableName = "rmt_enterprise";
                    }else  if(role=='ADMIN'){
                        tableName = "rmt_admin_user";
                    }
                    const updateTokenToProfile = await updateQuery("update " + tableName + " set token = ? where username = ?", [token, username]);
                    profileData[0].token = token;
                    resolve({
                        token: "eyJraWQiOiJ3SWFxU0lUWlpcL3k3cEZcLzJcL3hNdDhxXC9He",
                        refreshtoken:"eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWw",
                        user: {
                            idToken: {
                                jwtToken: "eyJraWQiOiJaeDNPbFR1TTZUKytSd",
                                payload: {
                                    sub: "504c293c-6071-7038-79ab-1a533d329eff",
                                    email_verified: true,
                                    iss: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_gBX9Ut8P1",
                                    phone_number_verified: false,
                                    "cognito:username": "yimib57145@amxyy.com",
                                    origin_jti: "e4121e78-a3d5-4a3d-a4ee-9b02b888f787",
                                    aud: "3r6ca5csqeiaci805pkt9eu809",
                                    event_id: "a97b28c1-7697-415e-ad88-cb614b3bec4e",
                                    token_use: "id",
                                    auth_time: 1724560375,
                                    name: "yimib57145@amxyy.com",
                                    phone_number: "+916374746320",
                                    exp: 1724563975,
                                    iat: 1724560375,
                                    jti: "cb0de80c-719f-444a-8257-b3fe167ec6e5",
                                    email: "yimib57145@amxyy.com"
                                }
                            },
                            refreshToken: {
                                token: "eyJjdHkiOiJKV1QiLCJlbmMiOi"
                            },
                            accessToken: {
                                jwtToken: "eyJraWQiOiJ3SWFxU0lUWlpcL3k3",
                                payload: {
                                    sub: "504c293c-6071-7038-79ab-1a533d329eff",
                                    iss: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_gBX9Ut8P1",
                                    client_id: "3r6ca5csqeiaci805pkt9eu809",
                                    origin_jti: "e4121e78-a3d5-4a3d-a4ee-9b02b888f787",
                                    event_id: "a97b28c1-7697-415e-ad88-cb614b3bec4e",
                                    token_use: "access",
                                    scope: "aws.cognito.signin.user.admin",
                                    auth_time: 1724560375,
                                    exp: 1724563975,
                                    iat: 1724560375,
                                    jti: "914cd42e-c15a-4b35-8df5-ce46c0d249a8",
                                    username: "yimib57145@amxyy.com"
                                }
                            },
                            clockDrift: 0
                        },
                        user_profile : profileData
                    });
            } else {
                reject(null);
            }
        });
    }else{
        reject(null);
    }
}

async function getUserProfile(username){
    const dbUserProfile = fetch("select * from vw_rmt_user where username = ?", [username]);
    return dbUserProfile;
}

async function getUserDataWithPassword(username){
    const dbUserProfile = fetch("select * from vw_rmt_user_pwd where username = ?", [username]);
    return dbUserProfile;
}


function setandSendUserInfo(cognitoUser, sessionInfo) {

    return new Promise(resolve => {

        cognitoUser.getUserAttributes( function(err, userAttributes)
        {
            if (err) {
                logger.error("setandSendUserInfo");
                resolve(err);
            }
            else {
              logger.info("userAttributes ********");
              logger.info(userAttributes);
              linkCognitoUserWithLocalDatabase(userAttributes, true).then(userLocalInfo => {
                 logger.info(userLocalInfo);

                 var responseDict = {};
                 responseDict["userInfo"] = userLocalInfo;
                 responseDict["sessionInfo"] = sessionInfo;
                 resolve(responseDict);
              });
            }
        });

    });

}

function updateEmailVerification(cognitoUser, sessionInfo, loginUserName) {
    return new Promise((resolve, reject) => {

        logger.info("update email verification");
        logger.info("loginUserName:" + loginUserName);
        var UserAttributes = [];

        UserAttributes[UserAttributes.length] = { Name: 'email_verified', Value: "true" };
        logger.info(UserAttributes);

        var params = {
            UserPoolId: userPoolId, // Your user pool id here
            Username: loginUserName,
            UserAttributes: UserAttributes
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: cognito_region,
            accessKeyId: cognito_accessKeyId,
            secretAccessKey: cognito_secretAccessKey,
            poolId: cognito_poolId
        });

        cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function (err, data) {
            if (err) {
                logger.error("updateEmailVerification");
                logger.error(err);
                resolve(err);
            }
            else {
                logger.info(data);
                delete params["UserAttributes"];
                resolve(setandSendUserInfo(cognitoUser, sessionInfo));
            }
        });
    });
}

function updateAttributes(userInfo) {
  return new Promise((resolve , reject) => {

          var UserAttributes = [];
          var username = userInfo["userName"];


          if(userInfo["phoneNumber"]) {
              UserAttributes[UserAttributes.length] = { Name: 'phone_number', Value: userInfo["phoneNumber"] };
          }

          if(userInfo["userrole"]) {
              UserAttributes[UserAttributes.length] = { Name: 'custom:userrole', Value: userInfo["userrole"] };
          }

          logger.info("userInfo");
          logger.info(UserAttributes);

          var params =  {
                        UserPoolId: userPoolId, // Your user pool id here
                        Username: userInfo["userName"],
                        UserAttributes: UserAttributes
                    };

         var cognitoidentityserviceprovider  = new AWS.CognitoIdentityServiceProvider({region:cognito_region,
                      accessKeyId: cognito_accessKeyId,
                      secretAccessKey: cognito_secretAccessKey,
                      poolId: cognito_poolId});

          cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function(err, data)
          {
              if (err)
              {
                  logger.error("userInfo error");
                  logger.error(err);
                  resolve(err);
              }
              else
              {
                  logger.info(data);
                  delete params["UserAttributes"];
                  resolve(updateandSendUserInfo(cognitoidentityserviceprovider, params));
              }
          });

  });
}

function updateandSendUserInfo(cognitoidentityserviceprovider, params) {

    return new Promise(resolve => {
        cognitoidentityserviceprovider.adminGetUser(params, function(err, userAttributes)
        {
            if (err) {
                logger.error("userInfo error");
                logger.error(err);
                resolve(err);
            }
            else {

              logger.info("userAttributes ********");
              logger.info(userAttributes);
              linkCognitoUserWithLocalDatabase(userAttributes["UserAttributes"], false).then(userLocalInfo => {
                 logger.info(userLocalInfo);
                 var responseDict = {};
                 responseDict["userInfo"] = userLocalInfo;
                 resolve(responseDict);
              });
            }
        });

    });

}

function linkCognitoUserWithLocalDatabase(userInfo, isLoginSuccess) {

    return new Promise(resolve => {

        logger.info("userInfo");
        logger.info(userInfo);
        var userInfoDict = {};

        for (i = 0; i < userInfo.length; i++) {
            attrName = userInfo[i].Name;
            attrValue = userInfo[i].Value;
            logger.info('attribute ' + attrName + ' has value ' + attrValue);

            if (attrName == 'sub') {
                userInfoDict["congito_user_sub"] = attrValue;
                logger.info('congito_user_sub ' + attrValue);
            }
            if (attrName == 'phone_number') {
                userInfoDict["phone_number"] = attrValue;
                logger.info('phone_number ' + attrValue);
            }
            if (attrName == 'custom:last_name') {
                userInfoDict["last_name"] = attrValue;
                logger.info('last_name ' + attrValue);
            }
            if (attrName == 'custom:first_name') {
                userInfoDict["first_name"] = attrValue;
                logger.info('first_name ' + attrValue);
            }
            if (attrName == 'name') {
                userInfoDict["email"] = attrValue;
                userInfoDict["user_name"] = attrValue;
                logger.info('name ' + attrValue);
            }
            if (attrName == 'custom:userrole') {
                userInfoDict["role"] = attrValue;
                logger.info('userrole ' + attrValue);
            }
        }

        userInfoDict["login_time"] = db.fn.now(); // For update login time
        var tablename = "consumer";
        var user_id = "dashboard_user_id";

        logger.info("userrole " + userInfoDict["role"]);
        var userRole = userInfoDict["role"];

    });

}


function forgotPassword(userInfo) {

    return new Promise(resolve => {

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var userData =
        {
            Username : userInfo["userName"],
            Pool : userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.forgotPassword (
        {
            onSuccess: function (result)
            {
                logger.info('result: ');
                logger.info(result);
                resolve(result);
            },
            onFailure: function(err)
            {
                logger.error('err: ');
                logger.error(err);
                resolve(err);
            },
            inputVerificationCode : function()
            {
                var body = {};
                body["response"] = {"message": "An OTP has been sent to your registered email address. Please check your email to proceed with resetting your password."};

                resolve(body);
            }
        });
    });
}

function resetPassword(userInfo) {
  return new Promise(resolve => {

            var verificationCode =  userInfo["verificationCode"];
            var newPassword =  userInfo["newPassword"];
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            var userData =
            {
                Username : userInfo["userName"],
                Pool : userPool
            };
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            cognitoUser.confirmPassword(verificationCode, newPassword,   {
                  onSuccess: function (result)
                  {
                      logger.info('result: ');
                      logger.info(result);
                      resolve(result);
                  },
                  onFailure: function(err)
                  {
                      logger.error('err: ');
                      logger.error(err);
                      resolve(err);
                  }
            });

      });
}

function deleteCognitoUser(userInfo) {

    return new Promise(resolve => {
        logger.info("userInfo");
        logger.info(userInfo);

        var params = {
            UserPoolId: userPoolId,
            Username: userInfo["userName"]
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: cognito_region,
            accessKeyId: cognito_accessKeyId,
            secretAccessKey: cognito_secretAccessKey,
            poolId: cognito_poolId
        });

        cognitoidentityserviceprovider.adminDeleteUser(params, function (err, data) {
            var body = {};

            if (err) {
                logger.error(err.message);
                body["error"] = { "message": err.message };
                resolve(body)
            } else {
                logger.info(data);
                resolve(deleteUserDataInDB(userInfo["userName"], userInfo["role"]));
            }
        });
    });
}

function deleteUserDataInDB(email, userRole){
    return new Promise(resolve => {
        var body = {};
        var tablename = "dashboard_users";

        logger.info("userrole " + userRole);

    });
}

function disableCognitoUser(userInfo) {
    return new Promise(resolve => {
        logger.info("userInfo");
        logger.info(userInfo);

        var params = {
            UserPoolId: userPoolId,
            Username: userInfo["userName"]
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: cognito_region,
            accessKeyId: cognito_accessKeyId,
            secretAccessKey: cognito_secretAccessKey,
            poolId: cognito_poolId
        });

        cognitoidentityserviceprovider.adminDisableUser(params, function (err, data) {
            var body = {};
            var userInfoDict = {};
            var tablename = "dashboard_users";
            var userRole = userInfo["role"];
            if (userRole == DELEIVERY_BOY_ROLE) {
                tablename = "delivery_boy";
            }

            if (err) {
                logger.error(err.message);
                body["error"] = { "message": err.message };
                resolve(body)
            } else {
                logger.info(data);
                body["success"] = true;
                //resolve(body);
                userInfoDict["user_status"] = 2; // Disable user

            }
        });
    });
}

function enableCognitoUser(userInfo) {
    return new Promise(resolve => {
        logger.info("userInfo");
        logger.info(userInfo);

        var params = {
            UserPoolId: userPoolId,
            Username: userInfo["userName"]
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: cognito_region,
            accessKeyId: cognito_accessKeyId,
            secretAccessKey: cognito_secretAccessKey,
            poolId: cognito_poolId
        });

        cognitoidentityserviceprovider.adminEnableUser(params, function (err, data) {
            var body = {};
            var userInfoDict = {};
            var tablename = "dashboard_users";
            var userRole = userInfo["role"];
            if (userRole == DELEIVERY_BOY_ROLE) {
                tablename = "delivery_boy";
            }

            if (err) {
                logger.error(err.message);
                body["error"] = { "message": err.message };
                resolve(body)
            } else {
                logger.info(data);
                body["success"] = true;
                //resolve(body);
                userInfoDict["user_status"] = 3; // Enable user
                db(tablename)
                    .where('user_name', userInfo["userName"])
                    .update(userInfoDict)
                    .then(() => {
                        logger.info("user updated");
                        resolve(body);
                    });
            }
        });
    });
}

function getAccessToken(userInfo) {
    return new Promise(resolve => {
        logger.info("userInfo");
        logger.info(userInfo);

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var CognitoRefreshToken = AmazonCognitoIdentity.CognitoRefreshToken;
        var userData =
        {
            Username: userInfo["userName"],
            Pool: userPool
        };

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        var token = new CognitoRefreshToken({ RefreshToken: userInfo["refreshtoken"] })
        cognitoUser.refreshSession(token, (err, session) => {

            var body = {};

            if (err) {
                logger.error(err.message);
                body["error"] = { "message": err.message };
                resolve(body)
            } else {
                logger.info(session);
                resolve({
                    token:result.accessToken.jwtToken,
                    refreshtoken:result.refreshToken.token,
                    user: result
                })
            }
        });
    });
}

function resendTemporaryPassword(userInfo) {
    return new Promise(resolve => {
        logger.info("resendTemporaryPassword called");
        var body = {};
        var UserAttributes = [
            {
                Name: 'email', Value: userInfo["userName"]
            }
        ]

        var params =
        {
            UserPoolId: userPoolId, // Your user pool id here
            Username: userInfo["userName"],
            DesiredDeliveryMediums:
                ["EMAIL", "SMS"],
            MessageAction: 'RESEND',
            UserAttributes: UserAttributes
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: cognito_region,
            accessKeyId: cognito_accessKeyId,
            secretAccessKey: cognito_secretAccessKey,
            poolId: cognito_poolId
        });

        cognitoidentityserviceprovider.adminCreateUser(params, function (err, data) {

            if (err) {
                body = err;
                logger.error("resendTemporaryPassword error");
                logger.error(err);
            }
            else {
                body["statusCode"] = 200;
            }
            logger.info("resendTemporaryPassword completion");

            body["success"] = true;
            //resolve(err, data);
            resolve(body);
        });
    });
}

async function isAuthorized(accessToken) {
    try {
        //logger.info(accessToken);
        await jwtVerifier.verify(accessToken);
    } catch (error) {
        logger.error(error);
        return {
            error: error,
            status: "403",
            message: "Unauthorized",
        };
    }
    return {
        status: "200",
        message: "Authorized",
    }; // allow request to proceed
}



module.exports = {
    createUser,
    signup,
    signupVerify,
    login,
    forgotPassword,
    resetPassword,
    updateAttributes,
    deleteCognitoUser,
    disableCognitoUser,
    enableCognitoUser,
    getAccessToken,
    resendTemporaryPassword,
    isAuthorized,
    changePassword,
    logout
};
