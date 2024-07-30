const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
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

  } else {
    console.log("DB Connected")
  }
})
app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: "Welcome to JSSW MINISTRIES"
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



app.get('/api/Organization', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT * FROM Organization LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Organization`;

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
      console.error('Error inserting new record: ' + error.stack);
      res.status(500).json({ message: 'Error inserting new record' });
      return;
    }
    console.log('New record inserted with ID:', results.insertId);
    res.status(200).json({ message: 'Registered Successfully' });
  })
});

app.get('/api/about', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT * FROM About LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM About`;

  pool.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error Fetching About Count");
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
  })
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
})

app.get('/api/getContact', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT * FROM Contact LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Contact`;

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
});

app.post('/api/addFounders', (req, res) => {
  const data = req.body;
  pool.query(`insert into Founders (id,name,Designation,Image,OrgId,IsDeleted) values (uuid(), ?, ?, ? , ?,0)`, [
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
});

app.get('/api/getFounders', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT * FROM Founders LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Founders`;

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
});

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

app.get('/api/getMission', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT * FROM Missions LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Missions`;

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

  const query = `SELECT * FROM MissionImages LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM MissionImages`;

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

app.get('/api/getProjects', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT * FROM projects LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM projects`;

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

app.get('/api/getSocialEvents', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT * FROM SocialEvents LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM SocialEvents`;

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
app.get('/api/getUsers', (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const offset = (currentPage - 1) * pageSize;

  const query = `SELECT * FROM Users LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM Users`;

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
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});

