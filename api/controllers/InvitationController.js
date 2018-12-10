import moment from 'moment';

class InvitationController {
    async create(ctx) {
        const { body } = ctx.request;
        const { fullname, email, client } = body;
        const owner = await ClientService.getById(client);
        if (!owner) {
            throw new UserError('ClientOwnerNotFound', `Client Owner ${client} Not Found.`);
        }
        let invitation = await Invitation.findOne({ fullname, email, client, status: 'pending' });
        if (!invitation) {
            invitation = await Invitation.create(body);
        } else if (moment().isAfter(invitation.expires)) {
            invitation = await Invitation.create(body);
        }
        await EmailService.sendIntitation(invitation, owner.body);
        ctx.status = 204;
    }

    async validate(ctx) {
        const { body } = ctx.request;
        const { webToken } = body;
        const invitation = await Invitation.validate(webToken);
        const { accessToken } = invitation;
        ctx.body = { accessToken };
        ctx.status = 200;
    }

    async answer(ctx) {
        const { body } = ctx.request;
        const { status, accessToken } = body;
        await Invitation.answer(accessToken, status);
        ctx.status = 204;
    }
}

module.exports = InvitationController;
