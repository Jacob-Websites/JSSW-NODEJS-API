const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '800mb' })); // Adjust the limit as needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logFile = fs.createWriteStream('db.log', { flags: 'a' });
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));
// Your routes and other middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '800mb' }));
const cors = require('cors');
app.use(cors());
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecret';
let refreshTokens = [];
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'btzothksikyd0tv6zljh-mysql.services.clever-cloud.com',
  user: 'ub4bzrramjnmzuys',
  password: 'jRKyeDjwQ7E5WNNLWpwU',
  database: 'btzothksikyd0tv6zljh',
  connectTimeout: 10000,
  acquireTimeout: 10000,
});
pool.getConnection((err, connection) => {
  if (err) {
    console.log('Error getting database connection: ', err);

  } else {
    console.log("DB Connected")

  }
})
app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: "Welcome to JSSW MINISTRIES"
  })
  res.send('JSSW Ministiries');


})
app.use(express.json());

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
  logFile.write(`Query: INSERT INTO Organization - Time: ${new Date().toISOString()}\n`);

});
app.get('/api/organizations',(req,res)=>{
  const id=req.query.id;
  pool.query(`select name,address,phone_number,email,image from Organization where id=? `,[id],(err,results)=>{
    if(err){
      console.error(err)
      res.json({
        status:400,
        error:'Id is required'
      })
    }else{
      res.json({
        status:200,
        data:results
      })
    }
  })
  logFile.write(`Query: SELECT * from Organization - Time: ${new Date().toISOString()}\n`);

})
app.put('/api/updateOrganization', (req, res) => {
  const data = req.body;
  pool.query(
    `update Organization set name=?, address=?, phonenumber=?,email=? where id=?`,
    [
      data.name,
      data.address,
      data.phonenumber,
      data.email,
      data.image,
      data.id
    ],
    (error, results, fields) => {
      if (error) {
        console.error('Error inserting new record: ' + error.stack);
        res.status(500).json({ message: 'Error inserting new record' });
        return;
      }
      console.log('New record inserted with ID:', results.insertId);
      res.status(200).json({ message: 'Updated Successfully' });
    }
  );
  logFile.write(`Query: update Organization - Time: ${new Date().toISOString()}\n`);

});

app.delete('/api/deleteOrganization',(req,res)=>{
  const data=req.body.id
  pool.query(`update Organization set isdeleted=1 where id=?`,[data],(err,res)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Organization deleted Successfully'
      })
    }
  })
  logFile.write(`Query: update Organization set isdeleted=1 - Time: ${new Date().toISOString()}\n`);

})




app.get('/api/Organization', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,name,address,phone_number as PhoneNumber,email,image FROM Organization where isdeleted=0 LIMIT ? OFFSET ? `;

  const countQuery = `SELECT COUNT(*) AS total FROM Organization where isdeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching Organization Count");
      return res.json({
        status: 403,
        error: "Error Fetching Records"
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
    logFile.write(`Query: SELECT id,name,address,phone_number as PhoneNumber,email,image FROM Organization - Time: ${new Date().toISOString()}\n`);

  });

});


app.post('/api/addAbout', (req, res) => {
  const data = req.body;
  pool.query(`insert into About (id,title,description,OrgId,IsDeleted) values (uuid(), ?, ? , ?,0)`, [
    data.title,
    data.description,
    data.orgId,
  ], (err, results, fields) => {
    if (err) {
      console.error('Error inserting new record: ' + err.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })
  logFile.write(`Query: insert into About (id,title,description,OrgId,IsDeleted)  - Time: ${new Date().toISOString()}\n`);

});

app.put('/api/updateAbout',(req,res)=>{
  const data=req.body;
  pool.query(`update About set title=?, description=? where id=?`,[data.title, data.description, data.id],(err,res)=>{
    if(err){
      console.error("Error updating data",err)
    }else{
      res.json({
        status:200,
        message:res
      })
    }
  })
  logFile.write(`Query: update About set title=?, description=? where id=?  - Time: ${new Date().toISOString()}\n`);

})

app.delete('/api/deleteAbout',(req,res)=>{
  const data=req.body.id;
  pool.query(`update About set IsDeleted=1 where id=${data}`,(err,res)=>{
    if(err){
      console.error("Error Inserting record",err)
    }else{
      res.json({
        status:200,
        message:'About Data Deleted Successfully'
      })
    }
  })
  logFile.write(`Query: update About set IsDeleted=1 where id=?  - Time: ${new Date().toISOString()}\n`);

})



app.get('/api/GetAbout', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const OrgId = req.query.id;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id, title, description, OrgId as OrganizationId FROM About WHERE IsDeleted = 0 AND OrgId = ? LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM About WHERE IsDeleted = 0 AND OrgId = ?`;

  pool.query(countQuery, [OrgId], (err, countResult) => {
      if (err) {
          console.error("Error Fetching About Count", err);
          return res.json({
              status: 403,
              error: "Error Fetching Records"
          });
      } else {
          const totalRecords = countResult[0].total;
          const totalPages = Math.ceil(totalRecords / pageSize);

          pool.query(query, [OrgId, pageSize, offset], (err, result) => {
              if (err) {
                  console.error("Error Fetching About Records", err);
                  return res.json({
                      status: 403,
                      error: err
                  });
              } else {
                  res.json({
                      status: 200,
                      data: {
                          result,
                          totalRecords,
                          totalPages,
                          currentPage: currentPage,
                          pageSize
                      },
                  });
              }
          });
      }
  });
  logFile.write(`Query: SELECT id, title, description, OrgId as OrganizationId FROM About WHERE IsDeleted = 0  - Time: ${new Date().toISOString()}\n`);

});


app.post('/api/addContact', (req, res) => {
  const data = req.body;
  pool.query(`insert into Contact (id,name,email,message,OrgId,IsDeleted) values (uuid(), ?, ?, ? , ?,0)`, [
    data.name,
    data.email,
    data.message,
    data.orgId
  ], (err, results, fields) => {
    if (err) {
      console.error('Error inserting new record: ' + err.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })
  logFile.write(`Query: insert into Contact (id,name,email,message,OrgId,IsDeleted)   - Time: ${new Date().toISOString()}\n`);

})


app.get('/api/getContact', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,name,email,message,OrgId as OrganizationId FROM Contact where IsDeleted=0 LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Contact where IsDeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching Contact Count");
      return res.json({
        status: 403,
        error: err
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
  })
  logFile.write(`Query: SELECT id,name,email,message,OrgId as OrganizationId FROM Contact where IsDeleted=0    - Time: ${new Date().toISOString()}\n`);

});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.json({
        status:400,
        message: 'Username and password are required' 
      })
  }

  pool.query('SELECT * FROM Users WHERE username = ?', [username], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = results[0];
      if(password === user.password){
 const accessToken = jwt.sign({ username: user.username, id: user.id }, accessTokenSecret, { expiresIn: '20m' });
 const refreshToken = jwt.sign({ username: user.username, id: user.id }, refreshTokenSecret);
refreshTokens.push(refreshToken);
return res.status(200).json({
    message: 'Login successful',
    accessToken,
    refreshToken,
    organizationId:results[0].Orgid
});
      }else{
        return res.status(401).json({ message: 'Invalid username or password' });

      }

     
  });
  logFile.write(`Query: SELECT * FROM Users WHERE username = ?    - Time: ${new Date().toISOString()}\n`);

});

// Refresh token route
app.post('/api/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
      return res.status(403).json({ message: 'Refresh token is required' });
  }

  if (!refreshTokens.includes(token)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const accessToken = jwt.sign({ username: user.username, id: user.id }, accessTokenSecret, { expiresIn: '20m' });

      res.json({
          accessToken
      });
  });
  logFile.write(`Token   - Time: ${new Date().toISOString()}\n`);

});

app.post('/api/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.status(200).json({ message: 'Logout successful' });
});

// Middleware to authenticate access tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.sendStatus(401);
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }

      req.user = user;
      next();
  });

}


app.post('/api/addFounders', (req, res) => {
  const data = req.body;
  pool.query(`insert into Founders (id,name,Designation,Image,OrgId,IsDeleted) values (uuid(), ?, ?, ? , ?,0)`, [
    data.name,
    data.designation,
    data.image,
    data.orgId
  ], (err, results, fields) => {
    if (err) {
      console.error('Error inserting new record: ' + err.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })
  logFile.write(`Query: insert into Founders (id,name,Designation,Image,OrgId,IsDeleted)    - Time: ${new Date().toISOString()}\n`);

});

app.put('/api/updateFounders',(req,res)=>{
  const data=req.body;
  console.log(data)
  pool.query(`update Founders set name=?, Designation=? where id=?`,[data.name, data.designation, data.id],(err,results)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:results
      })
    }
  })
  logFile.write(`Query: update Founders set name=?, Designation=? where id=?    - Time: ${new Date().toISOString()}\n`);

})

app.delete('/api/deleteFounders/:id',(req,res)=>{
  const data = req.params.id;
  console.log(data)
  pool.query(`update Founders set IsDeleted=1 where id=?`,[data],(err,res)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Deleted SuccessFully'
      })
    }
  })
  logFile.write(`Query: update Founders set IsDeleted=1 where id=?    - Time: ${new Date().toISOString()}\n`);

})

app.get('/api/getFounders', (req, res) => {

  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const OrgId = req.query.id; // Get OrgId from the query string

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id, name, Designation, Image, OrgId as OrganizationId FROM Founders WHERE IsDeleted = 0 AND OrgId = ? LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) AS total FROM Founders WHERE IsDeleted = 0 AND OrgId = ?`;

  if (!OrgId) {
    return res.json({
      status: 400,
      error: 'OrgId is required',
    })
  }

  // Correctly pass the OrgId to the countQuery
  pool.query(countQuery, [OrgId], (err, countResult) => {
    if (err) {
      console.error("Error Fetching Founders Count", err);
      return res.json({
        status: 403,
        error: err,
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      // Pass the OrgId, pageSize, and offset correctly to the query
      pool.query(query, [OrgId, pageSize, offset], (err, result) => {
        if (err) {
          console.error("Error Fetching Founders", err);
          return res.json({
            status: 403,
            error: err,
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize,
            },
          });
        }
      });
    }
  });
  logFile.write(`Query: SELECT id, name, Designation, Image, OrgId as OrganizationId FROM Founders WHERE IsDeleted = 0   - Time: ${new Date().toISOString()}\n`);


});


app.get('/api/GetFounders',(req,res)=>{
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,name,Designation,Image,OrgId as OrganizationId FROM Founders where IsDeleted=0 LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Founders where IsDeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching Founders Count");
      return res.json({
        status: 403,
        error: err
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
  })
  logFile.write(`Query: SELECT id,name,Designation,Image,OrgId as OrganizationId FROM Founders   - Time: ${new Date().toISOString()}\n`);

})

app.post('/api/addMission', (req, res) => {
  const data = req.body;
  pool.query(`insert into Missions (id,title,description,OrgId,IsDeleted) values (uuid(), ?, ? , ?,0)`, [
    data.title,
    data.email,
    data.description,
    data.orgId
  ], (err, results, fields) => {
    if (err) {
      console.error('Error inserting new record: ' + err.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })

});

app.put('/api/updateMission',(req,res)=>{
  const data= req.body;
  pool.query(`update Missions set title=?, description=? where id=?`,[data.title, data.description,data.id ],(err,res)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Mission Updated Successfully'
      })
    }
  })
})

app.delete('/api/deleteMission',(req,res)=>{
  const data= req.body.id;
  pool.query(`update Missions set IsDeleted=1 where id=?`,[data],(err,res)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Mission Deleted Successfully'
      })
    }
  })

})

app.get('/api/getMission', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,title,description,OrgId as OrganizationId FROM Missions where IsDeleted=0  LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Missions where IsDeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching Mission Count");
      return res.json({
        status: 403,
        error: err
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
  })

});

app.post('/api/addMissionImages', (req, res) => {
  const data = req.body;
  pool.query(`insert into MissionImages (id,name,images,missionid,OrgId,IsDeleted) values (uuid(), ?, ? ,?, ?,0)`, [
    data.name,
    data.images,
    data.missionid,
    data.orgId
  ], (err, results, fields) => {
    if (err) {
      console.error('Error inserting new record: ' + err.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })

});

app.get('/api/getMissionImages', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,name,images,missionid,OrgId as OrganizationId FROM MissionImages where IsDeleted=0 where LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM MissionImages where IsDeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching MissionImages Count");
      return res.json({
        status: 403,
        error: err
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
  })

});
app.delete('/api/deleteMissionImage',(req,res)=>{
  const data = req.body.id;
  pool.query(`update MissionImages set IsDeleted=1 where id=?`,[data],(err,res)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Images Deleted Successfully'
      })
    }
  })
})
app.post('/api/addProject', (req, res) => {
  const data = req.body;
  pool.query(`insert into projects (id,name,description,bibleverse,OrgId,IsDeleted) values (uuid(), ?, ?,?, ?,0)`, [
    data.title,
    data.email,
    data.description,
    data.bibleverse,
    data.orgId
  ], (err, results, fields) => {
    if (err) {
      console.error('Error inserting new record: ' + err.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })

});

app.put('/api/updateProject',(req,res)=>{
  const data = req.body;
  pool.query(`update projects set name = ?, description=?, bibleverse=? where id=?`,[data.name,
    data.description, data.bibleverse,data.id],(err,res)=>{
      if(err){
        console.error(err)
      }else{
        res.json({
          status:200,
          message:'Project Details Updated Successfully'
        })
      }
    })
  
});

app.delete('/api/deleteProject',(req,res)=>{
  const data = req.body.id;
  pool.query(`delete projects set IsDeleted=1 where id=?`,[data],(err,res)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Project Deleted Successfully'
      })
    }
  })

})

app.get('/api/getProjects', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,name,description,bibleverse,orgId as OrganizationId FROM projects where IsDeleted=0 LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM projects where IsDeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching projects Count");
      return res.json({
        status: 403,
        error: err
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
  })

});
app.post('/api/addSocialEvents', (req, res) => {
  const data = req.body;
  pool.query(`insert into SocialEvents (id,name,description,image,OrgId,IsDeleted) values (uuid(), ?, ?,?, ?,0)`, [
    data.name,
    data.description,
    data.image,
    data.orgId
  ], (err, results, fields) => {
    if (err) {
      console.error('Error inserting new record: ' + err.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })
});
app.delete('/api/deleteSocialEvents',(req,res)=>{
  const data = req.body.id
  pool.query(`update SocialEvents set IsDeleted=1 where id=?`,[data],(err,res)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Social Events Deleted Successfully'
      })
    }
  })

})

app.get('/api/getSocialEvents', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,name,description,image,OrgId as OrganizationId FROM SocialEvents where IsDeleted=0 LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM SocialEvents where IsDeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching SocialEvents Count");
      return res.json({
        status: 403,
        error: err
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
  })

});
app.post('/api/addUsers', (req, res) => {
  const data = req.body;
  pool.query(`insert into Users (id,username,password,OrgId,IsDeleted) values (uuid(), ?,?, ?,0)`, [
    data.username,
    data.password,
    data.orgId
  ], (err, results, fields) => {
    if (err) {
      console.error('Error inserting new record: ' + err.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })

});

app.put('/api/updateusers',(req,res)=>{
  const data = req.body;
  pool.query(`update Users set username = ?, password = ? where id=?`,[data.username, data.password, data.id],(err,results)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Users Updated Successfully'
      })
    }
  })

});

app.delete('/api/deleteUsers',(req,res)=>{
  const data = req.body.id;
  pool.query(`update Users set IsDeleted=1 where id=?`,[data],(err,results)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Users Deleted Successfully'
      })
    }
  })

})
app.get('/api/getUsers', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,username,password,OrgId as OrganizationId FROM Users where IsDeleted=0 LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Users where IsDeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching Users Count");
      return res.json({
        status: 403,
        error: err
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
  })

});

app.post('/api/Addadminusers',(req,res)=>{
  const data=req.body;
  pool.query(`insert into AdministrationUsers (id, name, username, password,IsDeleted) values (uuid(), ?, ?,?,0)`,[data.name,
    data.username, data.password],(err,results)=>{
      if(err){
        res.status(403).json({
          error:err
        })
      }else{
        res.json({
          status:200,
          data:'Admin User Registered Successfully'
        })
      }
    })
  
});

app.get('/api/getAdminUsers',(req,res)=>{
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT id,name,username,password FROM AdministrationUsers where IsDeleted=0 LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM AdministrationUsers where IsDeleted=0`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching Admin Users Count");
      return res.json({
        status: 403,
        error: err
      });
    } else {
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / pageSize);

      pool.query(query, [pageSize, offset], (err, result) => {
        if (err) {
          return res.json({
            status: 403,
            error: err
          });
        } else {
          res.json({
            status: 200,
            data: {
              result,
              totalRecords,
              totalPages,
              currentPage: currentPage,
              pageSize
            },

          });
        }
      });
    }
  })

});

app.post('/api/addRoutes',(req,res)=>{
  const data=req.body;
  pool.query(`insert into Routes (id,name,link,OrganizationId	,Component,displayOrder,IsDeleted) values (uuid(),?,?,?,?,?,0)`,[data.name,data.link,data.orgId,data.component,data.displayorder],(err,results)=>{
    if(err){
      console.log(err)
      res.status(500).json({
        message:err
      })
    }else{
      res.status(200).json({
        data:"Route added Successfully"
      })
    }
  })

});

app.get('/api/GetRoutes',(req,res)=>{
  const id=req.query.id
  pool.query(`SELECT id,name,link,OrganizationId	,Component,displayOrder FROM Routes where IsDeleted=0 AND OrganizationId=?`,[id],(err,results)=>{
    if(err){
      res.json({
        status:400,
        error:'Org Id Is Required '
      })
    }else{
      res.json({
        status:200,
        data:results
      })
    }
  })

  });

app.delete('/api/deleteRoute',(req,res)=>{
  const data = req.body.id;
  pool.query(`update Routes set isdeleted=1 where id=?`,[data],(err,results)=>{
    if(err){
      console.error(err)
    }else{
      res.json({
        status:200,
        message:'Routes deleted Successfully'
      })
    }
  });

});

app.post('/api/addSites',(req,res)=>{
  const data=req.body;
  pool.query(`insert into sites (id,name,link,Orgid,IsDeleted) values (uuid(),?,?,?,0)`,[data.name,data.link,data.orgId],(err,results)=>{
    if(err){
      console.log(err)
      res.status(500).json({
        message:err
      })
    }else{
      res.status(200).json({
        data:"Sites added Successfully"
      })
    }
  })
})

app.get('/api/getSites',(req,res)=>{
  pool.query(`select id,name,link,OrgId as OrganizationId from sites where IsDeleted=0`,(err,results)=>{
    if(err){
      res.json({
        status:500,
        error:err
      })
    }else{
      res.json({
        status:200,
        data:results
      })
    }
  })
})




const port = 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});

