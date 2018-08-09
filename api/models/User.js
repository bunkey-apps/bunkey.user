/* eslint no-use-before-define: 0*/
import SearchService from 'search-service-mongoose';
import MongooseModel from 'mongoose-model-class';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import Util from '../../util';

const modelFields = [
  'email',
  'password',
  'name',
  'role',
  'workspace',
  'status',
  'clientOwner',
  'clientAssignEditor',
  'favorites',
  'status',
];

class User extends MongooseModel {
    schema() {
        return {
            email: {
                type: String,
                required: true,
                unique: true,
                index: true,
            },
            password: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
                index: true,
            },
            role: {
                type: String,
                required: true,
                enum: ['admin', 'editor', 'client', 'operator'],
            },
            refreshTokens: {
                type: [String],
                index: true,
            },
            workspace: {
                type: MongooseModel.types.ObjectId,
            },
            clientOwner: {
                type: MongooseModel.types.ObjectId,
            },
            clientAssignEditor: [MongooseModel.types.ObjectId],
            favorites: [String],
            status: {
                type: Boolean,
                default: true,
            },
        };
    }

    // static get(query) {
    //     const criteria = {};
    //     return this.find(criteria).select('-password -refreshTokens');
    // }

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
            accessToken: TokenService.createToken(user),
        };
    }

    beforeSave(next) {
        bcrypt.hash(this.password, 10, (err, hash) => {
            this.password = hash;
            next();
        });
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

function buildCriteria({ search, fromDate, toDate }) {
  const criteria = {};
  const filterDate = [];
  if (search) {
    Object.assign(criteria, { $text: { $search: search } });
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
