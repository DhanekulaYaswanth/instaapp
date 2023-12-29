require("dotenv").config();

const express = require('express')
const app = express()
const port = 3030;
const cors = require('cors')
const multer = require('multer')

const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const uploadImages = require("./ImageUpload");
const corsOptions = {
    origin: 'http://localhost:3000',
};
  
  
app.use(cors(corsOptions));
app.use(express.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, ''); // Adjust the path accordingly
    },
    filename: function (req, file, cb) {
      const originalnameSplit = file.originalname.split('.');
      const fileExtension = originalnameSplit[originalnameSplit.length - 1]; // Get the extension
      cb(null, 'image1.' + fileExtension); // Save as 'image1' with the original extension
    },
  });
  
  const upload = multer({ storage: storage });
  



const validate = async(username,pass)=>{
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    console.log('validating...')
    try{
        await ig.account.login(username,pass);
        t=ig;
    }
    catch(err){
        return false;
    }
    console.log('validated')
    return ig;
}



const posttoinsta = async(igs, textdata, file)=>{
    
    const imageBuffer = await get({
        url: file,
        encoding: null, 
    });

    console.log('posting...')

    await igs.publish.photo({
        file: imageBuffer,
        caption: textdata,
    }).catch((err)=>{
        console.log(err)
    })
    console.log('posted')
}


app.post('/validate',async(req,res)=>{
    const userId = req.body.Name;
    const password = req.body.Pass;
    const result = await validate(userId,password);
    var final,status;
    if(!result){
        final = null;
        status=false;
    }
    else{
        final = {
            token: userId,
            pass: password
        }
        status=true;
    }
    // upload(final)


     res.send({'account':final,'valid':status});
})




app.post('/posttoinsta',upload.single('image'),async(req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      const file = req.file;
      const textdata = req.body.textData;
      const token = JSON.parse(req.body.token);
      console.log('got it!')

      const uri = await uploadImages(file.path)
      
      await posttoinsta(await validate(token.token, token.pass), textdata, uri);     
      res.send() 
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })