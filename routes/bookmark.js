const express = require('express')
const router = express.Router()
const Bookmark = require('../models/bookmark')

// get all bookmarked jobs
router.get('/', async (req, res) => {
    let bookmarks = await Bookmark.find().sort({bookmark_time:'desc'}).exec()

    context = {
        bookmarks: bookmarks
    }
    res.render('bookmark', context)
})


// add a new job to bookmark
router.post('/', async (req, res) => {
    const bookmark = new Bookmark({
        // read data from form tag
        title: req.body.title,
        link: req.body.link,
        company_name: req.body.company_name,
        description: req.body.description,
        post_time: req.body.post_time,
    })
    
    await bookmark.save((err, newBookmark) => {
        if (err) {
            console.error(err)
        } else {
            console.log(newBookmark, 'a job is bookmarked')
        }
    })
    res.redirect('/bookmark')
})


// edit job's remarks
router.get('/edit/:_id', async (req, res) => {
    let bookmark
    try{
        bookmark = await Bookmark.findById(req.params._id)
    } catch {
       res.redirect('/bookmark')
    }

    res.render('edit', {bookmark: bookmark})
})

router.put('/edit/:_id', async (req, res) => {
    let bookmark = await Bookmark.findById(req.params._id)
    
    bookmark.remark = req.body.remark
    await bookmark.save((err, newBookmark) => {
        if (err) {
            console.error(err)
        } else {
            console.log('a bookmark is updated')
        }
    })
    res.redirect('/bookmark')
})


//delete
router.delete('/:_id', async (req, res) => {
    await Bookmark.findOneAndDelete({_id: req.params._id})

    res.redirect('/bookmark')
})

module.exports = router