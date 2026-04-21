/* eslint-disable node/no-unsupported-features/es-syntax */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      const currQuery = this.query.getQuery();

      const words = this.queryString.search.split(" ");

      const regexArr = words.map((word) => ({
        $or: [
          { title: { $regex: word, $options: "i" } },
          { "ingredients.name": { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } },
        ],
      }));

      this.query = this.query.find({
        ...currQuery,
        $and: regexArr,
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);

    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
