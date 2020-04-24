const mongo = require("mongodb");
const nconf = require("nconf");

var dbo = null;

// connect to MongoDB

mongo.connect(
  nconf.get("mongodbURL"),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, db) => {
    if (err) {
      console.trace(err);
      process.exit(0);
    }
    // connection successful
    dbo = db.db("mockaroo");
    console.log("Connected to MongoDB");
  }
);

function getAllUsers() {
  return new Promise((resolve, reject) => {
    dbo
      .collection("users")
      .find({})
      .limit(10)
      .toArray((err, result) => {
        if (err) {
          console.trace(err);
          reject(err);
        }
        resolve(result);
      });
  });
}

function getUserbyId(query) {
  return new Promise((resolve, reject) => {
    dbo
      .collection("users")
      .find({ id: query.id })
      .limit(10)
      .toArray((err, result) => {
        if (err) {
          console.trace(err);
          reject(err);
        }
        resolve(result);
      });
  });
}

function createUser(userData) {
  return new Promise((resolve, reject) => {
    dbo.collection("users").insertOne(userData, (err, result) => {
      if (err) {
        console.trace(err);
        reject(err);
      }
      resolve(result);
    });
  });
}

function updateUser(userData) {
  return new Promise((resolve, reject) => {
    dbo
      .collection("users")
      .updateOne({ id: userData.id, $set: { userData } }, (err, result) => {
        if (err) {
          console.trace(err);
          reject(err);
        }
        resolve(result);
      });
  });
}

function deleteUser(query) {
  return new Promise((resolve, reject) => {
    dbo.collection("users").deleteOne({ id: query.id }, (err, result) => {
      if (err) {
        console.trace(err);
        reject(err);
      }
      resolve(result);
    });
  });
}

module.exports = {
  getAllUsers: getAllUsers,
  getUserbyId: getUserbyId,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
