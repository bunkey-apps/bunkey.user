import bcrypt from 'bcryptjs';
import Util from '../../util';

class UserService {
    async update(data) {
        const { ErrorService } = cano.app.services;
        const { User } = cano.app.models;

        if (data.password) {
            return this.updatePassword(data);
        }

        if (data.email) {
            const user = await User.findOne({ email: data.email });
            if (user) throw ErrorService.new('Already exist an user with that email', 409);
        }
        const picker = Util.pickFields(data.role);

        if (!picker) {
            throw ErrorService.new('Invalid rol', 400);
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
