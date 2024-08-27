import { App } from "../mongoose/schemas/apps.mjs";
import { Router } from "express"
import multer from "multer";
import AWS from "aws-sdk"
import multerS3 from "multer-s3";
import 'dotenv/config';
import dotenv from 'dotenv';
import { S3Client } from '@aws-sdk/client-s3';
import passport from "passport";
import { join } from "../handlers/join.mjs"; 

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


  const checkExistingApplication = async (req, res, next) => {
    try {
      const existingApp = await App.findOne({ userID: req.user.id });
  
      if (existingApp) {
        return res.status(400).json({ error: 'You have already submitted an application.' });
      }
  
      // No existing application found, proceed to the next middleware
      next();
    } catch (error) {
      res.status(500).json({ error: 'Error checking existing applications', details: error });
    }
  };
  
  router.post('/api/join', 
    passport.authenticate('jwt', { session: false }), checkExistingApplication, 
    upload.fields([
      { name: 'resume', maxCount: 1 },
      { name: 'id', maxCount: 1 },
      { name: 'equipment', maxCount: 1 }
    ]), 
    join
  );
  

  export default router