const axios = require('axios')
const cheerio = require('cheerio')

async function jobsdbScraper(position, page){
    let queryString = {
        source: 'https://hk.jobsdb.com',
        url: `https://hk.jobsdb.com/hk/search-jobs/${position}/${page}?sort=createdAt`,
        articles: 'article',
        title: 'h1 span',
        link: 'h1 a',
        company_name: 'span a',
        description: 'ul',
        post_time: 'time span',
        shift: 0,
    }
    return await baseScraper(queryString)
}

async function ctScraper(position, page){
    let queryString = {
        source: 'https://www.ctgoodjobs.hk',
        url: `https://www.ctgoodjobs.hk/ctjob/listing/joblist.asp?keywordForQuickSearch=${position}&page=${page}`,
        articles: '.jl-row',
        title: '.jl-title a',
        link: '.jl-title a',
        company_name: 'jl-comp a',
        description: '.job-highlight',
        post_time: '.post-date',
        shift: 30,
    }
    return await baseScraper(queryString)
}

async function baseScraper(queryString){
    const url = queryString.url
    let response = await scrapeByAxios(url)
    if (response == null) return []
    
    let jobList = parse(response, queryString)
    return jobList
}

async function scrapeByAxios(url){
    let response = await axios.get(url)
        .then(res => res.data)
        .catch(err => null);
    return response
}

async function parse(response, queryString){
    let $ = cheerio.load(response)
    let articles = $(queryString.articles)
    let jobList = []
    
    // An article is a job
    articles.each((index, article) => {
        const title = $(article).find(queryString.title).text()
        const link = $(article).find(queryString.link).attr('href')
        const company_name = $(article).find(queryString.company_name).text()
        
        const description_items = $(article).find(queryString.description).text()
        const description = description_items.split('\n').join(', ')
        
        const post_time = $(article).find(queryString.post_time).text()
        
        let job = {
            index: index + 1 + queryString.shift,
            source: queryString.source.split('.')[1],
            title: title,
            link: queryString.source + link,
            company_name: company_name,
            description: description,
            post_time: post_time,
        }
        jobList.push(job)
    })
    return jobList
}


async function jobScraper(position, page=1){
    let jobsdb = await jobsdbScraper(position, page)
    let ct = await ctScraper(position, page)
    //let indeed = await indeed_scraper(position)
    
    console.log(`jobsdb returns ${jobsdb.length} results`)
    console.log(`ct returns ${ct.length} results`)
    //console.log(`indeed returns ${indeed.length} results`)

    return [...jobsdb, ...ct]
}


module.exports = jobScraper

/* async function indeed_scraper(position){
    let queryString = {
        source: 'https://hk.indeed.com',
        url: `https://hk.indeed.com/jobs?q=${position}&sort=date`,
        articles: '.slider_item',
        title: '.jobTitle span',
        link: '.jobTitle a',
        company_name: '.companyName',
        description: '.job-snippet li',
        post_time: '.date',
    }
    return await base_scraper(queryString)
} */