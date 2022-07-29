const admin = require("firebase-admin");

class FirebaseController {
  constructor(collection) {
    const db = admin.firestore();
    this.query = db.collection(collection);
  }
}

module.exports = { FirebaseController };
