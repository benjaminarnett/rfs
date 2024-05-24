import mongoose from "mongoose";
const { Schema, model } = mongoose;

const movieSchema = new Schema({
  title: String,
  release_date: Date,
  rating: Number,
});

const Movie = model("Movie", movieSchema);
export default Movie;
