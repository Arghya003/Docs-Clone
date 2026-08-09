import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // ignore
}

const Connection = async (
  username = process.env.DB_USERNAME || "",
  password = process.env.DB_PASSWORD || ""
) => {
  const URL =
    process.env.MONGO_URI ||
    `mongodb+srv://${username}:${password}@cluster0.prtedey.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting with the database ", error);
  }
};

export default Connection;
