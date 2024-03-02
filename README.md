To handle file uploads in a Node.js application, you can use the `multer` middleware along with the Express.js framework. Here's a step-by-step guide on how to set up file uploads using `multer`:

1. **Install Required Packages**:
   
   First, you need to install `express` and `multer` packages. You can install them via npm:

   ```
   npm install express multer
   ```

2. **Set Up Express Server**:
   
   Create a new JavaScript file (e.g., `app.js`) and set up your Express server:

   ```javascript
   const express = require('express');
   const multer = require('multer');
   const app = express();
   const PORT = process.env.PORT || 3000;

   // Set up multer for handling multipart/form-data
   const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

   // Serve static files from the 'public' directory
   app.use(express.static('public'));

   // Define route for file upload
   app.post('/upload', upload.single('file'), (req, res) => {
     // req.file contains information about the uploaded file
     console.log(req.file);
     res.send('File uploaded successfully');
   });

   // Start the server
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
   ```

3. **HTML Form for File Upload**:

   Create an HTML file (`index.html`) with a form for uploading files:

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>File Upload</title>
   </head>
   <body>
     <h2>File Upload</h2>
     <form action="/upload" method="post" enctype="multipart/form-data">
       <input type="file" name="file">
       <button type="submit">Upload</button>
     </form>
   </body>
   </html>
   ```

4. **Run the Server**:

   Start your Node.js server by running:

   ```
   node app.js
   ```

5. **Test the File Upload**:

   Open a web browser and navigate to `http://localhost:3000`. You should see the file upload form. Choose a file and click the "Upload" button. The file will be uploaded to the `uploads/` directory on the server, and you should see a message saying "File uploaded successfully" in the browser.

This example demonstrates a basic setup for handling file uploads in a Node.js application using Express.js and `multer`. You can customize the upload settings and file handling logic according to your requirements. Additionally, remember to handle errors and add validation for uploaded files as needed.