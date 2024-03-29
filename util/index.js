import R from 'ramda';
import bcrypt from 'bcryptjs';

class Util {
    static pickFields(rol) {
        const commonFields = ['email', 'name', 'status'];
        switch (rol) {
            case 'editor': {
                const editorFields = ['clientAssignEditor'];
                return R.pick([...commonFields, ...editorFields]);
            }
            case 'operator':
            case 'client': {
                const editorFields = ['favorites', 'workspace'];
                return R.pick([...commonFields, ...editorFields]);
            }
            case 'admin': {
                return R.pick([...commonFields]);
            }
            default: {
                return false;
            }
        }
    }
    static isEqual(...args) {
        return R.equals.apply(null, args);
    }

    static filterEqualsBy(comparator) {
        console.log(comparator);
        return R.filter(R.equals(comparator));
    }
}

module.exports = Util;
