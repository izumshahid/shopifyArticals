const shop = process.env.SHOP;
export const getBlogsEndPoint = `https://${shop}/admin/api/2022-07/blogs.json`;
export const getArticalsEndPOint = `https://${shop}/admin/api/2022-07/blogs/<blogId>/articles.json?limit=250`;
