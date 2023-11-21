
const admin = require('firebase-admin');
const serviceAccount = require('E:/Melo-Sync/AdminSDK.json');
const fs = require('fs');
// const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://memo-sync.appspot.com', // Replace with your Firebase Storage bucket name
});

const bucket = admin.storage().bucket();

// const uploadSongsInFolder = (folderPath, storagePath) => {
//   const files = fs.readdirSync(folderPath);

//   files.forEach((file) => {
//     const localFilePath = path.join(folderPath, file);
//     const remoteFilePath = path.join(storagePath, file);

//     bucket.upload(localFilePath, {
//       destination: remoteFilePath,
//     })
//       .then(() => {
//         console.log(`Uploaded: ${localFilePath} to ${remoteFilePath}`);
//       })
//       .catch((error) => {
//         console.error(`Error uploading: ${localFilePath}`, error);
//       });
//   });
// };

// // Usage:
// const folderPath = 'E:/Melo-Sync/Tamil_Songs'; // Replace with the path to your local audio files folder
// const storagePath = 'songs/tamil'; // Specify the desired path within Firebase Storage

// uploadSongsInFolder(folderPath, storagePath);
const getFileDownloadURL = async (filePath) => {
    try {
      const [url] = await bucket.file(filePath).getSignedUrl({
        action: 'read',
        expires: '03-01-2500', // Set an expiration date or duration as needed
      });
      return url;
    } catch (error) {
      console.error('Error getting download URL:', error);
      return null;
    }
  };
  
  const fileURLs = {};
  
  // Usage:
  const filePath = 'songs/tamil'; // Replace with the path to your file in Firebase Storage
  getFileDownloadURL(filePath)
    .then((url) => {
      fileURLs[filePath] = url;
      saveURLsToFile(fileURLs);
      console.log('Download URL:', url);
    });
  
  function saveURLsToFile(urls) {
    const jsonURLs = JSON.stringify(urls, null, 2);
    fs.writeFileSync('tamilURLs.json', jsonURLs, 'utf-8');
  }