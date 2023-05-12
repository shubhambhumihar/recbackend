const mongoose = require("mongoose");

exports.validateMongoId = (id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) throw new Error(`Invalid MongoDb id`);
};
