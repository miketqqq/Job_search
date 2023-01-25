const express = require('express')
const router = express.Router()
const ScrapedData = require('../models/scraped_data')
const History = require('../models/history')
const jobScraper = require('../utils/scraper')

// Search page
router.get('/', async (req, res) => {
    let job_list = await ScrapedData.find({}) 
    let histroy = await History.findOne().sort({ query_time: -1 })
    let job_title = histroy.query_title 

    //search bar
    if (req.query.title) {
        console.log(`searching for ${req.query.title}`)
        job_title = req.query.title 
        await History.create({query_title: job_title})

        page = req.query.page || 1
        job_list = await jobScraper(job_title, page)

        if (job_list) {
            // clear the db for every new search, replaced by pre hook of mongoose
            //let deleted = await ScrapedData.deleteMany({})
            //console.log(`deleted ${deleted.deletedCount} of old documents`)
            await ScrapedData.insertMany(job_list)
        }
    }
    
    context = {
        job_list: job_list,
        job_title: job_title
    }
    res.render('index', context)
})

module.exports = router
