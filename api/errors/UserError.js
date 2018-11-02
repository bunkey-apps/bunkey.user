module.exports = {
    opts: {
        UnknownError: {
            code: 'ClientUnknownError',
            description: 'Please contact the API provider for more information.',
            status: 500,
        },
    },
    UserNotFound: {
        status: 404,
        description: 'User not found.',
    },
    ClientOwnerNotFound: {
        status: 404,
        description: 'Client Owner specified not found.',
    },
    UserAlreadyExist: {
        status: 409,
        description: 'The User Already Exist.',
    },
    UserConflict: {
        status: 409,
        description: 'There is a conflict with the user entity.',
    },
    CurrentPasswordSentInvalid: {
        status: 400,
        description: 'Current password sent invalid.',
    },
};
