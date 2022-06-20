import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(
  "mongodb+srv://ibm-user:br1suEutVahpO6Q9@ibm-website.uqj6c.mongodb.net/?retryWrites=true&w=majority"
);

const generateToken = () => {
  const random = Math.random().toString(36).slice(2);
  return random + random;
};

export class User {
  static async register(req) {
    const conn = await client.connect();
    const db = conn.db("ibmWebsite");

    const registerData = req.body;

    const alreadyRegistered = await db.collection("User").findOne({
      $or: [{ email: registerData.email }, { login: registerData.login }],
    });
    if (alreadyRegistered) {
      console.log("Already Registered");
      conn.close();
      return undefined;
    } else {
      await db.collection("User").insertOne({
        email: registerData.email,
        fname: registerData.fname,
        lname: registerData.lname,
        login: registerData.login,
        password: registerData.password,
      });
      console.log("Sucessfully Registered");
      conn.close();
      const token = generateToken();
      return token;
    }
  }

  static async login(req) {
    const loginData = req.body;
    const conn = await client.connect();
    const db = conn.db("ibmWebsite");
    const query = {
      email: loginData.email,
      password: loginData.password,
    };
    const validUser = await db.collection("User").findOne(query);
    conn.close();
    if (validUser) {
      const token = generateToken();
      console.log("User found");
      const response = {
        token: token,
        login: validUser.login,
        email: validUser.email,
      };
      return response;
    } else {
      console.log("User not found");
      return undefined;
    }
  }

  static async getContent(req) {
    const conn = await client.connect();
    const db = conn.db("ibmWebsite");
    let query = {
      login: req.params.login,
    };
    const user = await db.collection("User").findOne(query);
    if (req.params.query != undefined) {
      query = {
        userId: user._id,
        content: new RegExp(`${req.params.query}.*`, "i"),
      };
    } else {
      query = {
        userId: user._id,
      };
    }
    const userPosts = await db
      .collection("Posts")
      .find(query, { _id: 0, content: 1 })
      .toArray();
    return userPosts;
  }

  static async postContent(req) {
    const conn = await client.connect();
    const db = conn.db("ibmWebsite");
    let query = { login: req.params.login };
    const user = await db.collection("User").findOne(query);
    await db.collection("Posts").insertOne({
      userId: user._id,
      content: req.body.content,
    });
    return;
  }
}
