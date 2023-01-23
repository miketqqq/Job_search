const axios = require('axios')
const cheerio = require('cheerio')

async function jobsdb_scraper(position, page){
    let query_string = {
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
    return await base_scraper(query_string)
}

async function ct_scraper(position, page){
    let query_string = {
        source: 'https://www.ctgoodjobs.hk',
        url: `https://www.ctgoodjobs.hk/ctjob/listing/joblist.asp?keywordForQuickSearch=${position}&page=${page}`,
        articles: '.jl-row',
        title: '.jl-title a',
        link: '.jl-title a',
        company_name: 'jl-comp a',
        description: '.job-highlight',
        post_time: '.post-date',
        shift: 100,
    }
    return await base_scraper(query_string)
}


async function base_scraper(query_string){
    const source = query_string.source
    const url = query_string.url

    const response = await axios.get(url)
        .then(res => res.data)
        .catch(err => null);

    if (response == null) return []

    let $ = cheerio.load(response)
    let articles = $(query_string.articles)
    let job_list = []

    articles.each((index, article) => {
        const title = $(article).find(query_string.title).text()
        const link = $(article).find(query_string.link).attr('href')
        const company_name = $(article).find(query_string.company_name).text()

        const description_items = $(article).find(query_string.description).text()
        const description = description_items.split('\n').join(', ')

        const post_time = $(article).find(query_string.post_time).text()

        let job = {
            index: index + 1 + query_string.shift,
            source: source.split('.')[1],
            title: title,
            link: source + link,
            company_name: company_name,
            description: description,
            post_time: post_time,
        }
        job_list.push(job)
    })
    return job_list
}


async function scraper(position, page=1){
    let jobsdb = await jobsdb_scraper(position, page)
    let ct = await ct_scraper(position, page)
    //let indeed = await indeed_scraper(position)
    console.log(`jobsdb returns ${jobsdb.length} results`)
    console.log(`ct returns ${ct.length} results`)

    return [...jobsdb, ...ct]
}


module.exports = scraper

/* async function indeed_scraper(position){
    let query_string = {
        source: 'https://hk.indeed.com',
        url: `https://hk.indeed.com/jobs?q=${position}&sort=date`,
        articles: '.slider_item',
        title: '.jobTitle span',
        link: '.jobTitle a',
        company_name: '.companyName',
        description: '.job-snippet li',
        post_time: '.date',
    }
    return await base_scraper(query_string)
} */