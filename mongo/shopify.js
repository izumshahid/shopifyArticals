import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogsSchema = new Schema({
  shopify_artical_Id: {
    type: String,
    required: true,
  },
  custom_data: {
    type: Object,
    required: true,
  },
});

let Mongo_blogs = mongoose.model("blogs", blogsSchema);

export default Mongo_blogs;
// module.exports = Mongo_blogs;
//
