// const app = require('./app')

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const path = require('path');
const app = require('./app'); // Import your Express app logic
const PORT = process.env.PORT || 5000;

// console.log('main 1 ', "../Task-Management/dist/index.html");

// const dirname = path.join(__dirname, '../Task-Management');
// console.log('dir name',dirname)
// console.log('main dir', path.join(__dirname, "../Task-Management/dist/index.html"));

// // Serve the React build from task-management/dist
// app.use(express.static(path.join(__dirname, "../Task-Management/dist")));


// app.use((req, res, next) => {
//   res.sendFile(path.resolve(__dirname, "../Task-Management/dist/index.html"));
// });
                                                              
// app.get('/abc', (req, res) => { 
//   res.send('Hello World');
// });


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



