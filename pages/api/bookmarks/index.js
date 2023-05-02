// import { bDelete, store } from "../../../controllers/bookmarks";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await store(req, res);
  }
  if (req.method === "DELETE") {
    return await bDelete(req, res);
  }
}
