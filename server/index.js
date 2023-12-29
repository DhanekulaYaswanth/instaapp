require("dotenv").config();

const express = require('express')
const app = express()
const port = 3030;
const cors = require('cors')

const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const corsOptions = {
    origin: 'https://dhanekulayaswanth.github.io',
};
  
  
app.use(cors(corsOptions));
app.use(express.json());


  



const validate = async(username,pass)=>{
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    console.log('validating...')
    console.log(username,pass)
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




app.post('/posttoinsta',async(req,res)=>{
      const file = req.body.image;
      const textdata = req.body.textData;
      const token = JSON.parse(req.body.token);
      console.log('got it!')
      console.log(file)

      
    //    await posttoinsta(await validate(token.token, token.pass), textdata, file);     
    //   res.send() 
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })