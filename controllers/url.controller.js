const shortId = require("short-id");
const validUrl = require("valid-url");
const { urlSchema } = require("../models/index");

// eslint-disable-next-line func-names
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number") return false;
  return true;
};

// Function to create a shortened URL
// eslint-disable-next-line func-names
const createUrl = async function (req, res) {
  try {
    // validate request body
    if (!req.body.longUrl) {
      return res
        .status(400)
        .send({ status: false, message: "Request body must contain 'longUrl'" });
    }

    // fetch longUrl
    const longUrl = req.body.longUrl.trim(); // Trim whitespace from the URL
    const baseUrl = "http://localhost:8550/r/";

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
    const existingUrl = await urlSchema.findOne({ where: { longUrl } });

    if (existingUrl) {
      return res.status(400).send({
        status: false,
        message: "The provided URL already exists in the database",
        data: existingUrl,
      });
    }

    // axios call to check if the link is working or not
    // try {
    //   // Additional error handling for axios
    //   const response = await axios.get(longUrl);
    //   if (response.status !== 200) {
    //     return res.status(400).send({ status: false, message: "Invalid URL" });
    //   }
    // } catch (error) {
    //   console.error("Error fetching URL:", error);
    //   return res.status(400).send({ status: false, message: "Invalid URL" });
    // }
    // const expirationDate = new Date();
    // expirationDate.setMonth(expirationDate.getMonth() + 1);
    // creating shortUrl

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Add one day
    expirationDate.setHours(12); // Set the hour to 12 (noon)
    expirationDate.setMinutes(0); // Set the minutes to 0
    expirationDate.setSeconds(0); // Set the seconds to 0

    const id = shortId.generate(longUrl);
    const shortUrl = baseUrl + id;

    // creating url record
    const url = await urlSchema.create({
      longUrl,
      shortUrl,
      URLCode: id,
      expirationDate,
    });

    return res.status(200).json({ message: "URL generated", url });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating URL:", error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

// eslint-disable-next-line func-names
const getLinkWithShortUrl = async function (req, res) {
  try {
    // Fetching urlCode from params
    const urlCode = req.params.URLCode;

    // Search if urlCode exists
    const url = await urlSchema.findOne({ where: { URLCode: urlCode } });

    if (!url) {
      // If the urlCode doesn't exist, send a 404 response
      // return res.status(404).send({ status: false, message: "URL does not exist" });
      return res.write("<h1>URL is invalid</h1>");
    }

    // Redirect to the original URL
    return res.redirect(url.longUrl);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    // Handle any errors
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUrl = async (req, res) => {
  try {
    const { urlCode } = req.params;

    // Check if the urlCode is valid
    if (!shortId.isValid(urlCode)) {
      return res.status(400).send({ status: false, message: "Invalid urlCode" });
    }

    // Find the URL data in the database
    const urlData = await urlCode.findOne({ where: { urlCode } });

    if (urlData) {
      // Redirect to the long URL
      return res.status(302).redirect(urlData.longUrl);
    }
    return res.status(404).send({ status: false, message: "No URL Found" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrl, getLinkWithShortUrl, getUrl };
