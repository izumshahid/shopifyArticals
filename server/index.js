// @ts-check
import { resolve } from "path";
import express from "express";
import multer from "multer";
var upload = multer({ dest: "uploads/" });
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import "dotenv/config";
import mongoose from "mongoose";
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import Mongo_blogs from "../mongo/shopify.js";
import axios from "axios";
import { getAllThemes, uploadImage, uploadToBucket } from "./helpers/custom.js";
import { getArticalsEndPOint, getBlogsEndPoint } from "./EndPoints.js";
import fs from "fs";

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("mognoDb connected successfully ");
  })
  .catch((err) => console.log(err));

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8000", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: false,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop];
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = false
  // process.env.NODE_ENV === "production"
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      if (!res.headersSent) {
        res.status(500).send(error.message);
      }
    }
  });

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  app.use(express.json({ limit: "50mb" }));
  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: false,
      parameterLimit: 50000,
    })
  );

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/*", (req, res, next) => {
    const { shop } = req.query;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
    } else {
      next();
    }
  });

  //get custom json object linked to an artical
  app.post("/api/getArticalData", async (req, res, next) => {
    try {
      const { articalId } = req.body;

      const articalData = await Mongo_blogs.findOne({
        shopify_artical_Id: articalId,
      });
      res.status(200).send({ articalData });
    } catch (error) {
      res
        .status(501)
        .json({ error: error.message, message: "failed to get artical data" });
    }
  });

  //remove the custom json object linked to an artical
  app.delete("/api/RemoveArticalData", async (req, res, next) => {
    try {
      const { articalId } = req.body;

      const articalData = await Mongo_blogs.findOneAndDelete({
        shopify_artical_Id: articalId,
      });
      res.status(200).send({ articalData });
    } catch (error) {
      res.status(501).json({
        error: error.message,
        message: "failed to remove artical data",
      });
    }
  });

  // Create record, store artical id and the custom obj whiich needs to be attached to it
  app.post("/api/articalData", async (req, res, next) => {
    try {
      let { allDNDItems, articalId } = req.body;

      let cdnObj;
      for (let i = 0; i < allDNDItems.length; i++) {
        if (
          allDNDItems[i].type === "image" ||
          allDNDItems[i].type === "images"
        ) {
          const imagesObj = allDNDItems[i];
          // uploadToBucket(req, res, function (error) {
          //   if (error) {
          //     console.log(error);
          //     return res.redirect("/error");
          //   }
          //   console.log("File uploaded successfully.", res);
          // });
          cdnObj = await uploadImage({ imagesObj });
          allDNDItems[i].content = cdnObj;
        }
      }

      await Mongo_blogs.findOneAndUpdate(
        { shopify_artical_Id: articalId },
        {
          shopify_artical_Id: articalId,
          custom_data: allDNDItems,
        },
        {
          upsert: true,
          lean: true,
          new: true,
        }
      );

      return res.status(200).send({ message: "success", allDNDItems });
    } catch (error) {
      console.log("=> /api/articalData error : ", error);
      res.status(501).json({ error: error.message, message: "failed to save" });
    }
  });

  app.get("/api/savedArticalIds", async (req, res, next) => {
    try {
      const records = await Mongo_blogs.find({});

      const articalIds = records.map((record) => record.shopify_artical_Id);

      res.status(200).send({ articalIds });
    } catch (error) {
      res
        .status(501)
        .json({ error: error.message, message: "failed to get ids" });
    }
  });

  app.get("/api/getAllThemes", async (req, res, next) => {
    try {
      const themes = await getAllThemes();
      res.status(200).send({ themes });
    } catch (error) {
      res
        .status(501)
        .json({ error: error.message, message: "failed to get themes" });
    }
  });

  //this is just a simple route for antD image uploader, agar ya nai hoga to vo error dayta ha
  app.post(
    "/api/uploadImage",
    upload.single("file"),
    async (req, res, next) => {
      try {
        const { file } = req;
        const fileContent = fs.readFileSync(file.path);

        // conver filestream to base64
        const base64 =
          "data:image/png;base64," + fileContent.toString("base64");

        res.status(200).json({
          cdnObj: base64,
        });
      } catch (error) {
        res
          .status(501)
          .json({ error: error.message, message: "failed to upload" });
      }
    }
  );

  const getBLogs = async () => {
    var config = {
      method: "get",
      url: getBlogsEndPoint,
      headers: {
        "X-Shopify-Access-Token": process.env.X_SHOPIFY_ACCESS_TOKEN,
      },
    };

    const { data: { blogs = [] } = {} } = await axios(config);
    return blogs;
  };

  app.get("/api/getArticals", async (req, res, next) => {
    try {
      const blogsArr = await getBLogs();

      const articalEndpOint = getArticalsEndPOint.replace(
        "<blogId>",
        blogsArr[0].id
      );

      var config = {
        method: "get",
        url: articalEndpOint,
        headers: {
          "X-Shopify-Access-Token": process.env.X_SHOPIFY_ACCESS_TOKEN,
        },
      };

      const { data: { articles = [] } = {} } = await axios(config);

      //sort wrt update
      articles.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

      res.status(200).json({ articles });
    } catch (error) {
      res
        .status(501)
        .json({ error: error.message, message: "failed to get articals" });
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    console.log("=> Serving static files from dist/client on port : ", PORT);
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}
