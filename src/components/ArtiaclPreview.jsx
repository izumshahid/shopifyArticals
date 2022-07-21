import React, { useContext } from "react";
import parse from "html-react-parser";
import { MyContext } from "../MyContext";
import { useEffect } from "react";

const ArtiaclPreview = () => {
  const { articalSelected, allDNDItems, shopifyAritcals } =
    useContext(MyContext);

  const header = `<div className="header">
  <div className="pb-4">
    <div className="container-fluid">
      <div className="row justify-content-center no-gutters">
        <div className="col-lg-12 p-0">
          <div className="text-center my-4">
            <div className="untitled-serif-regular-17 font-italic pb-2">
              ${
                shopifyAritcals.data.find(
                  (articalItem) => articalItem.id == articalSelected
                )?.tags[0] || "Travel"
              }
            </div>

            <h1 className="eames-century-modern-regular-32 mb-2 text-center">
              ${
                shopifyAritcals.data.find(
                  (articalItem) => articalItem.id == articalSelected
                )?.title || ""
              }
            </h1>

            <div className="untitled-serif-regular-14 mb-2">
              <span style="font-weight: 400;">
              ${
                shopifyAritcals.data.find(
                  (articalItem) => articalItem.id == articalSelected
                )?.summary_html ||
                "Montauk represents the epitome of a classy summer getaway. Between the food, surf and shopping, this destination has the making of an iconic weekend you’ll plan for year after year. After a recent trip spent soaking up the sun in the Montauk and Hamptons area, I’m excited to share my recommendations!</span>"
              }
               
            </div>

            <div
              className="untitled-serif-regular-14 mb-2"
              style="font-size: 14px; font-style: italic;"
            >
              ${
                shopifyAritcals.data.find(
                  (articalItem) => articalItem.id == articalSelected
                )?.author || ""
              }
            </div>

            <div className="untitled-serif-regular-14 mb-2">July 2022</div>
          </div>
        </div>

        <div className="col-12 p-0">
          <div className="embed-responsive embed-responsive-16by9 mb-2">
            <div className="embed-responsive-item">
              <img
                className="w-100"
                src=
                ${
                  shopifyAritcals.data.find(
                    (articalItem) => articalItem.id == articalSelected
                  )?.image ||
                  "https://i.picsum.photos/id/10/1920/1080.jpg?hmac=Hs_xUcCc7BNrD6fseq1fdN2AC_uSWaywG7V7uh_6fTY"
                }                
                alt=${
                  shopifyAritcals.data.find(
                    (articalItem) => articalItem.id == articalSelected
                  )?.image?.alt || ""
                }
              />
            </div>
          </div>

          <div className="untitled-serif-regular-14 font-italic">
           ${
             shopifyAritcals.data.find(
               (articalItem) => articalItem.id == articalSelected
             )?.image?.alt || ""
           }
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  let text = `<div className="m-2">
    <div className="container-fluid">
      <div className="row no-gutters">
        <div className="col">
          <div className="row justify-content-center no-gutters">
            <div className="col-lg-12 p-0">
              <div className="untitled-serif-regular-16 article-cus-p ">
                <div className="text-center">
                  replace_me
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  let quote = ` <div className="py-1">
  <div className="container-fluid">
    <div className="row justify-content-center no-gutters">
      <div className="col-lg-12 p-0">
        <div className="eames-century-modern-regular-40 text-center">
          <p>
            <strong>replace_me</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>`;

  let image = `<div className="mb-3">
  <div className="container-fluid">
    <div className="row justify-content-center no-gutters">
      <div
        className="col-lg-12 p-0"
        style="marginTop: '0 !important'"
      >
        <div className="embed-responsive embed-responsive-7by5">
          <div className="embed-responsive-item">
            <img
              className="w-100 "
              src="replace_me"
              alt=""
            />
          </div>
        </div>

        <div className="untitled-serif-regular-14 font-italic"></div>
      </div>
    </div>
  </div>
</div>`;

  return (
    <div className="articalPreviewWrapper">
      {articalSelected ? (
        <>
          <p
            className="text-center"
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              textDecoration: "underline",
              marginBottom: "20px",
            }}
          >
            Artical preview
          </p>
          {parse(header)}
          {allDNDItems.map((item, index) => {
            if (item.type === "text") {
              return (
                <div className="text" key={index}>
                  {parse(text.replace("replace_me", item.content))}
                </div>
              );
            } else if (item.type === "image") {
              return (
                <div className="image" key={index}>
                  {parse(
                    image.replace(
                      "replace_me",
                      item.content[0]?.response
                        ? item.content[0]?.response?.cdnObj
                        : item.content[0]?.thumbUrl || ""
                    )
                  )}
                </div>
              );
            } else if (item.type === "images") {
              return <div key={index}>Multi images</div>;
            } else if (item.type === "quote") {
              return (
                <div className="quote" key={index}>
                  {parse(quote.replace("replace_me", item.content))}
                </div>
              );
            } else if (item.type === "collection") {
              return (
                <div key={index}>
                  <img
                    width="100%"
                    src="https://cdn.shopify.com/s/files/1/0522/0542/0732/t/1/assets/Screenshot_1.png?v=1658127956"
                    alt=""
                  />
                </div>
              );
            } else if (item.type === "question") {
              return (
                <div key={index}>
                  {item.inputContent}
                  {parse(item.textareaContent)}
                </div>
              );
            } else if (item.type === "answer") {
              return (
                <div key={index}>
                  {item.inputContent}
                  {parse(item.textareaContent)}
                </div>
              );
            }
          })}
        </>
      ) : null}
    </div>
  );
};

export default ArtiaclPreview;
