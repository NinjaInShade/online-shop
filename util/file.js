const fs = require("fs");

function delete_file(file_path) {
  fs.unlink(file_path, (err) => {
    if (err) {
      throw err;
    }
  });
}

module.exports = {
  delete_file,
};
