module.exports = {
    opts: {
        UnknownError: {
            code: 'RequestUnknownError',
            description: 'Please contact the API provider for more information.',
            status: 500,
        },
    },
    InvalidRequestPayload: {
        status: 400,
        description: 'The request payload is invalid for this action.',
    },
    MissingFields: {
        status: 400,
        description: 'You doesnt have provided all the fields required for this action.',
    },
    InvalidCredentials: {
        status: 400,
        description: 'The credentials are invalids.',
    },
};
