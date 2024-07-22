import express from "express";
import jwt from "jsonwebtoken";

async function searchCollection(model, searchString, fields) {
  const searchRegex = new RegExp(searchString, "i"); // Case-insensitive regex
  const searchCriteria = fields.map((field) => ({ [field]: searchRegex }));

  try {
    const results = await model.find({ $or: searchCriteria });
    return results;
  } catch (error) {
    console.error(
      `Error searching in ${model.collection.collectionName}:`,
      error
    );
    throw error;
  }
}

export { searchCollection };
