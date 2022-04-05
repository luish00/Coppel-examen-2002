import { mongoose } from '../../common/services/mongoose.service';

const Schema = mongoose.Schema;
const schema = new Schema({
  coment: String,
  createAt: Number,
  fileName: String,
  magnitude: Number,
  score: Number,
  user: String,
});

schema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
schema.set('toJSON', {
  virtuals: true
});

schema.findById = function (cb) {
  return this.model('comments').find({ id: this.id }, cb);
};

const Commen = mongoose.model('comments', schema);
const commentmodel = {}

commentmodel.findById = (id) => {
  return Commen.findById(id)
    .then((result) => {
      result = result.toJSON();
      delete result._id;
      delete result.__v;
      return result;
    });
}

commentmodel.create = (data) => {
  const club = new Commen(data);
  return club.save();
}

commentmodel.inserts = (array) => {
  return Commen.insertMany(array);
}

commentmodel.list = ({ clubId, page, perPage, query }) => {
  return new Promise((resolve, reject) => {
    Commen.find({ clubId, ...query })
      .limit(perPage)
      .skip(perPage * page)
      .sort('createAt')
      .exec((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
  });
}

commentmodel.removeById = (id) => {
  return new Promise((resolve, reject) => {
    Commen.remove({ _id: id }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
}

export default commentmodel;
