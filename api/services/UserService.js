/* import Util from '../../util'; */

class UserService {
    async update(data) {
        cano.log.debug('data', data);
        const { User } = cano.app.models;

        if (data.password) {
            const user = await User.getById(data.id);
            user.password = data.password;
            return user.save();
        }

        if (data.action === 'updatePassword') {
            return this.updatePassword(data);
        }

        if (data.email) {
            const user = await User.findOne({ email: data.email });
            if (user) throw new UserError('UserAlreadyExist', 'Already exist an user with that email');
        }

        /* const picker = Util.pickFields(data.role);

        if (!picker) {
            throw new RequestError('InvalidRequestPayload', 'You have provided an invalid rol');
        }
        const object = picker(data); */
        await User.updateById(data.id, data);
        return true;
    }

    async updatePassword({ id, currentPassword, newPassword }) {
        if (!currentPassword || !newPassword) {
            throw new RequestError('InvalidRequestPayload', 'You have provided an invalid rol');
        }
        const user = await User.getById(id, 'password');
        if (!user.isValidPassword(currentPassword)) {
            throw new UserError('CurrentPasswordSentInvalid', 'Current password sent invalid.');
        }
        user.password = newPassword;
        return user.save();
    }
}

export default UserService;
