const express = require('express');
const router = express.Router();

// Repond with 200 and a message just a test
router.get('./checkBotkitUp',(req,res,next) =>{
    res.status(200).json(
        {
            "message":"BotKit is up"
        }
    );
});

module.exports = router;