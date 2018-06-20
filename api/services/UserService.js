import bcrypt from 'bcryptjs';
import Util from '../../util';

class UserService {
    async update(data) {
        const { User } = cano.app.models;

        if (data.password) {
            return this.updatePassword(data);
        }

        if (data.email) {
            const user = await User.findOne({ email: data.email });
            if (user) throw new UserError('UserAlreadyExist', 'Already exist an user with that email');
        }

        const picker = Util.pickFields(data.role);

        if (!picker) {
            throw new RequestError('InvalidRequestPayload', 'You have provided an invalid rol');
        }
        const object = picker(data);
        await User.updateById(data.id, object);
        return true;
    }

    async updatePassword({ password, id }) {
        const { User } = cano.app.models;
        const hash = await bcrypt.hash(password, 10);
        await User.updateById(id, { password: hash });
        return true;
    }
}

export default UserService;
