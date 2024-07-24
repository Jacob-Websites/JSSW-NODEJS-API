const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bzgbc53adkctrr2boqnh-mysql.services.clever-cloud.com',
    user: 'ub4bzrramjnmzuys',
    password: 'jRKyeDjwQ7E5WNNLWpwU',
    database: 'bzgbc53adkctrr2boqnh',
    connectTimeout: 10000,
    acquireTimeout: 10000,
  });
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting database connection: ', err);
      
    }else{
        console.log("DB Connected")
    }
})  
app.get('/',(req,res)=>{
    res.json({
        status:200,
        message:"Welcome to JSSW MINISTRIES"
    })

})
const port = 8080;
app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
  });

