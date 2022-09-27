const express = require ('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')

//Add Story
router.get ('/stories/add', ensureAuth, (req,res) => {
    res.render('stories/add')
}) 

//Post Story
router.post('/stories', ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
}) 

//Get all Stories
router.get ('/stories', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({ status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')        
    }
})



module.exports = router