const admin = require('firebase-admin');
const serviceAccount = require('../rapidmate-private-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



module.exports=admin