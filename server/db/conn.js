const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.expots = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verifies that we got a good database object.
      if (db) {
        _db = db.db("users");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};
