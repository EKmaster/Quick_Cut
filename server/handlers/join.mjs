import { App } from "../mongoose/schemas/apps.mjs";


  


export const join = async (req, res) => {
    try {
      // Now handle the file URLs and save to the database
      const newApp = new App({
        userID: req.user.id,  // Assuming req.user.id is the authenticated user's ID
        fullName: req.body.fullName,
        address: req.body.address,
        number: req.body.mobileNumber,
        cardNumber: req.body.cardNumber,
        expiry: req.body.expirationDate,
        id: req.files['id'][0].location,
        resume: req.files['resume'][0].location,
        equipment: req.files['equipment'][0].location,
      });
      
      await newApp.save();
      res.status(200).json({ 
          message: 'Files uploaded and data saved', 
          resumeUrl: req.files['resume'][0].location, 
          idUrl: req.files['id'][0].location, 
          equipmentUrl: req.files['equipment'][0].location 
      });
    } catch (error) {
      res.status(500).json({ error: 'Error uploading files or saving data', details: error });
    }
  }