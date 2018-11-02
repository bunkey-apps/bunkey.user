/* eslint no-use-before-define: 0 */
import MongooseModel from 'mongoose-model-class';
import moment from 'moment';
import includes from 'lodash/includes';
import Util from '../../util';
import { Object } from 'core-js';

class Invitation extends MongooseModel {
  schema() {
    return {
      fullname: { type: String, required: true, index: true },
      email: { type: String, required: true, index: true },
      client: { type: MongooseModel.types.ObjectId, required: true, index: true },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      webToken: { type: String, unique: true, index: true },
      accessToken: { type: String, unique: true, index: true },
      expires: { type: Date },
    };
  }

  async beforeSave(doc, next) {
    const { fullname: name, email } = doc;
    doc.webToken = TokenService.createWebToken();
    let user = await User.findOne({ email }).select('-password -refreshTokens');
    if (!user) {
      user = { email, name };
    } else {
      user = user.toObject();
    }
    Object.assign(user, { role: 'invited' });
    doc.accessToken = TokenService.createToken({ user });
    doc.expires = moment().add(3, 'days').toDate();
    next();
  }

  static async validate(webToken) {
    const invitation = await this.findOne({ webToken });
    if (!invitation) {
      throw new InvitationError('InvitationNotFound');
    }
    if (invitation.status !== 'pending') {
      throw new InvitationError('InvitationAnswered');
    }
    if (Util.isExpired(invitation.expires)) {
      throw new InvitationError('InvitationExpired');
    }
    return invitation;
  }

  static async answer(accessToken, status) {
    const criteria = { accessToken };
    const invitation = await this.findOne({ accessToken });
    if (!invitation) {
      throw new InvitationError('InvitationNotFound');
    }
    if (invitation.status !== 'pending') {
      throw new InvitationError('InvitationAnswered');
    }
    if (!includes(['accepted', 'rejected'], status)) {
      throw new InvitationError('InvalidAnswer');
    }
    const { client, email } = invitation;
    const user = await User.findOne({ email });
    if (!user) {
      throw new UserError('UserNotFound', 'User not found.');
    }
    await user.addWorkClient(client);
    return this.update(criteria, { $set: { status } });
  }

}

module.exports = Invitation;
