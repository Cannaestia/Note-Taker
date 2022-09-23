const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const getData = (filepath) => {
  const data = fs.readFileSync(filepath, 'utf-8');
  if (!data) throw Error('no data');
  return JSON.parse(data);
};

app.get('/api/notes', (req, res) => {
  const result = getData('./db/db.json');
  if (result) {
    res.json(result)
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

const readFromFile = util.promisify(fs.readFile);

app.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err 
    ? console.error(err) 
    : console.info(`\nData written to ${destination}`)
  );

  const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

  app.post('/api/notes', (req, res) => {

    const {title, text} = req.body;

    if (title && text) {
      const newNote = {
        id: uniqid (),
        title,
        text,
      };
      readAndAppend(newNote, './db/db.json');
      res.json('note added!');
    }
  })
  
  app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
  );
  
 
 
  // Different codes I've tried messing around with to get the app to work.
  
  // app.post('/api/notes', (req, res) => {
    
    //   const {title, text} = req.body;
    
    //   if (title && text) {
      //     const newNote = [{
        //       title,
        //       text,
        //     }];
        
        //     fs.readFile('./db/db.json', 'utf8', (err, data) => {
          //       if (err) {
            //         console.log(err);
            //       } else {
              //         const stringNotes = JSON.stringify(newNote);
              
              
              
              //         fs.writeFile('./db/db.json', stringNotes, (err) =>
              //           err
              //           ? console.error(err)
              //           : console.log('New Note Posted!')
              //           );
              
              //           const response = {
                //             status: 'sucess',
                //             body: newNote,
                //           };
                
                //           console.log(response);
                //           res.status(201).json('review not posted');
                //       }
                //     })
                
                
                //   }
                // } );
                