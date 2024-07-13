const express = require("express");
const fs = require("fs");
const app = express();
const axios = require("axios")
const cheerio = require("cheerio")
const xlsx = require("xlsx")

const pageUrl = "https://www.foundit.in/search/software-testing-jobs?searchId=2ecdd520-671d-42f0-8ff3-76d581308432"
const getData = async () => {
    try {
        const response = await axios.get(pageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const data  =  response.data;
        // console.log(data); // Log the response data
        fs.writeFileSync("data.txt", response.data);
    } catch (e) {
        console.error("Error: ", e.message);
    }
}

getData()

const pageData = fs.readFileSync("data.txt",)

    const $ = cheerio.load(pageData.toString());

   const titles  =  $(".jobTitle");

   const titlesArray = []

//    console.log(titles.text());

   titles.each((i,element)=>{
        const title = $(element).text().replace(/\s/g, "");
        const titleJson = JSON.stringify(title);
        titlesArray.push(titleJson)
        // console.log(titleJson.length);
   })

   const companyname  =  $(".companyName");
   const cnArray = [];

   companyname.each((i,element)=>{
    const company = $(element).text().replace(/\s/g, "");
    cnArray.push(company);
   })

   const locations = $(".details");

   const locationArray = [];

   locations.each((i,element)=>{
    const location = $(element).text().replace(/\s/g, "");
    locationArray.push(location);
   })

   const jobtypes = $(".addEllipsis");;

   const jobtypesArray = [];

   jobtypes.each((i,element)=>{
    const jobtype = $(element).text().replace(/\s/g, "");
    jobtypesArray.push(jobtype);
   })


   const days = $(".timeText");;

   const daysArray = [];

   days.each((i,element)=>{
    const day = $(element).text().replace(/\s/g, "");
    daysArray.push(day);
   })


   
   const skills = $(".skillDetails");;

   const skillDetailsArray = [];

   skills.each((i,element)=>{
    const skill = $(element).text().replace(/\s/g, "");
    skillDetailsArray.push(skill);
   })


   const productjson = titlesArray.map((title,index)=>{
    return{
        title,
        companyname:cnArray[index],
        location:locationArray[index],
        Jobtype:jobtypesArray[index],
        day:daysArray[index],
        skills:skillDetailsArray[index]

    }
})
   
fs.writeFileSync("products.json",JSON.stringify(productjson));


const workbook = xlsx.utils.book_new();

const sheet = xlsx.utils.json_to_sheet(productjson);

xlsx.utils.book_append_sheet(workbook,sheet,"Products_Sheet")

xlsx.writeFile(workbook,"products.xlsx")


app.listen(1001,()=>{
    console.log("server is up at port number 1001");
})