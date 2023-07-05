const express = require('express');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'harryisgoodb$oy';
var jwt = require('jsonwebtoken');



//ROUTE1 : create a using using POST "/api/auth/createuser". doesnt req auth
router.post('/createuser',[
    body('name','enter a valid name').isLength({ min: 3 }),
    body('email','enter a valid email').isEmail(),
    body('password','password must be atleast 5 characters').isLength({ min: 5 }),
    
],async (req,res)=>{
  let success = false;
    // if there are no errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check whether the email exist
    try {
    let user =await User.findOne({email:req.body.email});
    if (user){
        return res.status(400).json({ success, error:"sorry a user with this email already exist"})

    }
    const salt = await bcrypt.genSalt(10);//generates salt
    const secPass = await  bcrypt.hash(req.body.password, salt); //contains internal mechanism which creates complex hash

    //create a new user
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user:{
            id: user.id
        }
      }

      const authtoken = jwt.sign(data, JWT_SECRET ); //place cursor on sign to about it
    // res.json(user)

    success = true;
    res.json({ success, authtoken})
    //catch errors
    }catch(error){
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})


//ROUTE2 : Authenticate a user using POST "/api/auth/login". No login req
router.post('/login',[
  
  body('email','enter a valid email').isEmail(),
  body('password','password cannot be blank').exists(),
  
  
],async (req,res)=>{
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: "please try to login with correct credentials"});
    }

    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      success = false;
      return res.status(400).json({ success, error: "please try to login with correct credentials"});
    }
    const data = {
      user:{
          id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET ); //place cursor on sign to about it
    success = true;
    res.json({ success, authtoken})
  }catch(error){
    console.error(error.message);
    res.status(500).send("internal server error");
}

})



//ROUTE3 : Get logged in user details using: POST "/api/auth/getuser".  login req
router.post('/getuser', fetchuser, async (req,res)=>{
try {
   userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
  
} catch(error){
  console.error(error.message);
  res.status(500).send("internal server error");
}
})






module.exports = router