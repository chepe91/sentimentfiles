const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../upload`));
  },
  filename: (req, file, callback) => {
    const match = ["text/plain"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept txt.`;
      return callback(message, null);
    }

    //console.log("user:"+req.session.username);

    var filename = `${req.session.username}-${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;