import { App } from "../mongoose/schemas/apps.mjs";
import { Router } from "express"
import multer from "multer";
import AWS from "aws-sdk"
import multerS3 from "multer-s3";
import 'dotenv/config';
import dotenv from 'dotenv';
import { S3Client } from '@aws-sdk/client-s3';
import passport from "passport";


const router = Router()
dotenv.config({ path: '../.env' });
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });
  
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "cuickcutapply2005",
      
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `uploads/${Date.now().toString()}_${file.originalname}`);
      }
    })
  });

router.post('/api/join', passport.authenticate("jwt", { session: false }), upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'id', maxCount: 1 },
    { name: 'equipment', maxCount: 1 }
  ]), async (req, res) => {
    const user = await App.findOne({ userID: req.user.id });
    if (!user) {
        return res.sendStatus(403)
    }
    try {
      // req.files contains information about the uploaded files
      console.log(process.env.AWS_ACCESS_KEY_ID); // Check if this outputs the correct key
console.log(process.env.AWS_SECRET_ACCESS_KEY); // Check if this outputs the correct secret
console.log(process.env.AWS_REGION); // Check if this outputs the correct region

      console.log(req.body)
      
      const resumeUrl = req.files['resume'][0].location;
      const idUrl = req.files['id'][0].location;
      const equipmentUrl = req.files['equipment'][0].location;
      console.log(resumeUrl)
      // Save URLs to MongoDB
      const newApp = new App({
        userID: req.user.id,
        fullName: req.body.fullName,
        address: req.body.address,
        number: req.body.mobileNumber,
        cardNumber: req.body.cardNumber,
        expiry: req.body.expirationDate,
        id: idUrl,
        resume: resumeUrl,
        equipment: equipmentUrl,
      });
      
      await newApp.save();
      res.status(200).json({ message: 'Files uploaded and data saved', resumeUrl, idUrl, equipmentUrl });
    } catch (error) {
      res.status(400).json({ error: 'Error uploading files', details: error });
    }
  });

  export default router