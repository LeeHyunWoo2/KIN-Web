import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { visitorId } = req.body;
  const country = req.headers["cf-ipcountry"];

  if (country !== "KR") return res.status(200).json();

  try {
    await axios.post(`${process.env.API_BACKEND_URL}/visitor`, { visitorId }, { headers: req.headers });
    res.status(200).json();
  } catch (error) {
    res.status(500).json({skipToast: true});
  }
}