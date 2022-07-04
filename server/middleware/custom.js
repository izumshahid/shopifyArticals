import axios from "axios";

export async function getAllThemes(req, res, next) {
  try {
    var config = {
      method: "get",
      url: `https://${process.env.SHOP}/admin/themes.json`,
      headers: {
        "X-Shopify-Access-Token": process.env.X_SHOPIFY_ACCESS_TOKEN,
      },
    };

    const themes = await axios(config);
    console.log("themes", themes.data.themes);
    res.status(200).json({ themes });
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
}
