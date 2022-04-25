const mongooose = require("mongoose");

const PostSchema = new mongooose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
  
    likes: {
      type: Array,
      default: [],
    },
    img:{
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongooose.model("Post", PostSchema);
