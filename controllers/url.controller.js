const { urlSchema } = require("../models/index"); 
const shortId = require("short-id");
const validUrl = require("valid-url");
const axios = require("axios");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number") return false;
  return true;
};

// Function to create a shortened URL
const createUrl = async function (req, res) {
    try {
      // validate request body
      if (!req.body.longUrl) {
        return res
          .status(400)
          .send({ status: false, message: "Request body must contain 'longUrl'" });
      }
  
      // fetch longUrl
      let longUrl = req.body.longUrl.trim(); // Trim whitespace from the URL
      let baseUrl = "http://localhost:8550/";
  
      // validating url
      if (!isValid(longUrl)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide a valid long URL" });
      }
  
      if (!validUrl.isUri(longUrl)) {
        return res.status(400).send({ status: false, message: "Invalid URL" });
      }
  
      // check if URL already exists in the database
      let existingUrl = await urlSchema.findOne({ where: { longUrl: longUrl } });
  
      if (existingUrl) {
        return res.status(400).send({
          status: false,
          message: `The provided URL already exists in the database`,
          data: existingUrl,
        });
      }
  
      // axios call to check if the link is working or not
      try {
        // Additional error handling for axios
        const response = await axios.get(longUrl);
        if (response.status !== 200) {
          return res.status(400).send({ status: false, message: "Invalid URL" });
        }
      } catch (error) {
        console.error("Error fetching URL:", error);
        return res.status(400).send({ status: false, message: "Invalid URL" });
      }
  
      // creating shortUrl
      let id = shortId.generate(longUrl);
      let shortUrl = baseUrl + id;
  
      // creating url record
      let url = await urlSchema.create({
        longUrl: longUrl,
        shortUrl: shortUrl,
        URLCode: id,
      });
  
      return res.status(201).send({
        status: true,
        message: "URL shortened successfully",
        data: url,
      });
    } catch (error) {
      console.error("Error creating URL:", error);
      return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
  };

// Function to redirect to original URL with the short URL
const getLinkWithShortUrl = async function (req, res) {
  try {
    // fetching urlCode from params
    let urlCode = req.params.urlCode;

    // search if urlCode exists
    let url = await urlSchema.findOne({ where: { urlCode: urlCode } });

    if (!url) {
      return res
        .status(404)
        .send({ status: false, message: "URL does not exist" });
    }

    // redirect to the original URL
    return res.status(302).redirect(url.longUrl);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrl, getLinkWithShortUrl };