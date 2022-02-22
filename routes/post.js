const router = require("express").Router();
const { response } = require("express");
const Post = require("../models/Post")

//create psot
router.post("/", async (req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)

    }catch(err){
        res.status(500).json(err)
    }
})
//update post

router.put("/:id",async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body})
            res.status(200).json("Updated")
        }else{
            res.status(500).res("you can only update your own posts")
        }

    }catch(err){
        res.status(500).res(err)
    }
} )
//delete a post
//like a posts
//get a post 
// get all posts
//GET TIMELINE PSOTS
router.get('/',(req,res) =>{
    console.log('Post page')
})

module.exports = router;