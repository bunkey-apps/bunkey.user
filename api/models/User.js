/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import SearchService from 'search-service-mongoose';
import MongooseModel from 'mongoose-model-class';
import bcrypt from 'bcryptjs';
import generator from 'generate-password';
import moment from 'moment';
import Util from '../../util';

const modelFields = [
  'email',
  'name',
  'avatar',
  'role',
  'workspace',
  'status',
  'clientOwner', // @TODO: Remove this after update to front.
  'workClients',
  'clientAssignEditor', // @TODO: Remove this after update to front.
  'favorites',
  'status',
];

class User extends MongooseModel {
  schema() {
    return {
      email: { type: String, required: true, unique: true, index: true },
      password: { type: String, required: true },
      name: { type: String, required: true, index: true },
      avatar: { type: String },
      role: { type: String, required: true, enum: ['admin', 'editor', 'client', 'operator'] },
      refreshTokens: { type: [String], index: true },
      workspace: { type: MongooseModel.types.ObjectId },
      clientOwner: { type: MongooseModel.types.ObjectId }, // @TODO: Remove this after update to front.
      workClients: { type: [MongooseModel.types.ObjectId], default: [] },
      clientAssignEditor: [MongooseModel.types.ObjectId], // @TODO: Remove this after update to front.
      favorites: [String],
      status: { type: Boolean, default: true },
    };
  }

  async beforeSave(doc, next) {
    try {
      const isClient = (doc.role === 'client');
      if (isClient && !doc.clientOwner) {
        throw new RequestError('MissingFields', 'Client Owner unspecified.');
      }
      if (isClient) {
        const result = await ClientService.getById(doc.clientOwner);
        if (!result) {
          throw new UserError('ClientOwnerNotFound', `Client Owner ${doc.clientOwner} Not Found.`);
        }
      }
      const salt = bcrypt.genSaltSync(10);
      doc.password = bcrypt.hashSync(doc.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  }

  static get(query) {
    const criteria = buildCriteria(query);
    const opts = buildOpts(query);
    return SearchService.search(this, criteria, opts);
  }

  static async getById(id, fields = '-password -refreshTokens') {
    const user = await this.findById(id).select(fields);
    if (!user) {
      throw new UserError('UserNotFound', 'User not found.');
    }
    return user;
  }

  static getByClientId(client) {
    return this.find({ workClients: client, role: 'operator' }).select('-password -refreshTokens');
  }

  static async updateById(id, data) {
    await this.getById(id);
    const criteria = {
      _id: id,
    };
    return this.update(criteria, {
      $set: data,
    });
  }

  static async deleteById(id) {
    await this.getById(id);
    const criteria = {
      _id: id,
    };
    return this.remove(criteria);
  }

  static async refreshToken(refreshToken) {
    const user = await this.findOne({
      refreshTokens: refreshToken,
    }).select('id role').lean(true);
    if (!user) {
      throw new AuthorizationError('InsufficientPrivileges', 'Does not have the necessary privileges to perform this operation.');
    }
    return {
      accessToken: TokenService.createToken({ user }),
    };
  }

  static async recoveryPassword(email) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new UserError('UserNotFound', 'User not found.');
    }
    const newPassword = generator.generate({ length: 10, numbers: true });
    await EmailService.sendNewPassword({
      to: email,
      name: user.name,
      password: newPassword,
    });
    user.password = newPassword;
    return user.save();
  }

  addWorkClient(client) {
    const criteria = { _id: this.id };
    return this.model('User').updateOne(criteria, { $addToSet: { workClients: client } });
  }

  removeWorkClient(client) {
    const criteria = { _id: this.id };
    return this.model('User').updateOne(criteria, { $pull: { workClients: client } });
  }

  isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  addRefreshToken(refreshToken) {
    const refreshTokens = [...this.refreshTokens, refreshToken];
    return this.model('User').findByIdAndUpdate(this.id, {
      $set: {
        refreshTokens,
      },
    });
  }

  removeRefreshToken(refreshToken) {
    const filterByRefreshToken = Util.filterEqualsBy(refreshToken);
    const refreshTokens = filterByRefreshToken(this.refreshTokens);
    return this.model('User').findByIdAndUpdate(this.id, {
      $set: {
        refreshTokens,
      },
    });
  }

  disable() {
    return this.model('User').updateById(this.id, {
      status: false,
    });
  }

  options() {
    return {
      versionKey: false,
      timestamps: true,
    };
  }

  config(schema) {
    schema.index({
      '$**': 'text',
    });
  }

}

function buildOpts(query) {
  const {
    page = 1,
    limit = 10,
    orderBy = '-createdAt',
    fields = modelFields.join(','),
  } = query;
  return { page, limit, orderBy, fields };
}

function buildCriteria({ clientOwner, search, fromDate, toDate }) {
  const criteria = {};
  const filterDate = [];
  if (search) {
    Object.assign(criteria, { $text: { $search: search } });
  }
  if (clientOwner) {
    Object.assign(criteria, { clientOwner: MongooseModel.adapter.Types.ObjectId(clientOwner) }); 
  }
  if (fromDate) {
    filterDate.push({
      createdAt: {
        $gte: moment(fromDate, 'DD-MM-YYYY').toDate(),
      },
    });
  }
  if (toDate) {
    filterDate.push({
      createdAt: {
        $lte: moment(toDate, 'DD-MM-YYYY').toDate(),
      },
    });
  }
  if (filterDate.length > 0) {
    Object.assign(criteria, { $and: filterDate });
  }
  return criteria;
}

module.exports = User;
