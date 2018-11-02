module.exports = {
    opts: {
        UnknownError: {
            code: 'ClientUnknownError',
            description: 'Please contact the API provider for more information.',
            status: 500,
        },
    },
    InvitationNotFound: {
        status: 404,
        description: 'invitation not found.',
    },
    InvitationAnswered: {
        status: 409,
        description: 'The invitation has already been answered.',
    },
    InvitationExpired: {
        status: 409,
        description: 'Invitation expired.',
    },
    InvalidAnswer: {
        status: 409,
        description: 'Invalid answer.',
    },
};
