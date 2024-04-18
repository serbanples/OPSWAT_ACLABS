const express = require('express');
const request = require('request');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/file/:dataId', (req, res) => {
  const dataId = req.params.dataId;

   var options = {
      "method": "GET",
      "url": `https://api.metadefender.com/v4/file/${dataId}`,
      "headers": {
          "apikey": "66b35c67f453d2395d9655512c3646a7",
          "x-file-metadata": 1
      }
  };
       
  request(options, function (error, response, body) {
    if (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    if(response.statusCode != 200) {
      return res.status(response.statusCode).json({ error: 'Failed to fetch data' });
    }

    const data = JSON.parse(body);
      res.json(data);
  });
});

app.post('/file', (req, res) => {
  if (!req.body.filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  const filePath = req.body.filePath;

  var options = {
    method: "POST",
    url: "https://api.metadefender.com/v4/file",
    headers: {
      "apikey": "66b35c67f453d2395d9655512c3646a7",
      "rule": "sanitize, unarchive, dlp"
    },
    formData: {
      file: {
        value: fs.createReadStream(filePath),
        options: {
          filename: "Hello_World.txt",
        }
      }
    }
  };
   
  request(options, function (error, response, body) {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    console.log(body);
    res.status(response.statusCode).send(body);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
