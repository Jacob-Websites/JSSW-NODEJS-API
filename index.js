const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const res = require('express/lib/response');
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
app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));
app.use(express.json());
app.get('/swagger', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.yaml'));
});
app.post('/api/addorganization', (req, res) => {
  const data = req.body;
 pool.query(
  'INSERT INTO Organization (id,name,address,phone_number,email,image,isdeleted) VALUES (uuid(),?, ?, ?, ?, ?, 0)',
  [
    data.name,
    data.address,
    data.phonenumber,
    data.email,
    data.image
  ],
  (error, results, fields) => {
    if (error) {
      console.error('Error inserting new record: ' + error.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  }
);

});

app.get('/api/Organizations',(req,res)=>{
  pool.query(`select * from Organization`,(err,result)=>{
    if(err){
      console.error("Error Fetching Organization")
      res.json({
        status:403,
        error:"Error Fetching Records"
      })
    }else{
      res.json({
        status:200,
        data:result
      })
    }
  })
})
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
  });

