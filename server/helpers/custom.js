import axios from "axios";

function* genApiCall(content, themeId) {
  for (const item of content) {
    if ("percent" in item) {
      let { name = "", base64Str = "" } = item;
      let thumbUrl = base64Str.split("base64,")[1];

      yield uploadImageToShopify({
        name,
        thumbUrl,
        themeId,
      });
    }
  }
}

async function uploadImageToShopify({ name, thumbUrl, themeId }) {
  try {
    var data = JSON.stringify({
      asset: {
        key: `assets/printFresh_${name}`,
        attachment: thumbUrl,
      },
    });

    var config = {
      method: "put",
      url: `https://${process.env.SHOP}/admin/api/2021-04/themes/${themeId}/assets.json`,
      headers: {
        "X-Shopify-Access-Token": process.env.X_SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const { data: { asset: { public_url } = {} } = {} } = await axios(config);

    return public_url;
  } catch (error) {
    console.log("uploadImageToShopify error :", error.message);
    return "";
  }
}

export const uploadImage = async ({ imagesObj = {} }) => {
  try {
    const themes = await getAllThemes();
    const mainTheme = getPublishedTheme({ themes });
    let cdnArr = [];
    let customArr = [];
    const { content = [] } = imagesObj;

    let i = 0;
    for (const item of content) {
      if ("percent" in item) {
        cdnArr = await Promise.all([...genApiCall(content, mainTheme.id)]);

        customArr.push({
          name: item.name,
          status: "done",
          url: cdnArr[i],
          thumbUrl: cdnArr[i],
        });
        i++;
      } else {
        customArr.push({
          name: item.name,
          status: "done",
          url: item.url,
          thumbUrl: item.url,
        });
      }
    }

    // console.log("=<><><", customArr);

    return customArr;
  } catch (error) {
    console.log("uploadImage error", error.message);
    return error;
  }
};

export const getPublishedTheme = ({ themes = [] }) => {
  return themes.find((theme) => theme.role === "main");
};

export const getAllThemes = async () => {
  var config = {
    method: "get",
    url: `https://${process.env.SHOP}/admin/themes.json`,
    headers: {
      "X-Shopify-Access-Token": process.env.X_SHOPIFY_ACCESS_TOKEN,
    },
  };

  try {
    const themes = await axios(config);
    return themes.data.themes;
  } catch (error) {
    return { error: error.message };
  }
};
