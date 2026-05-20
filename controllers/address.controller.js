import * as addressService from '../services/address.service.js';

// Customer shortcut — uses userId from token
export async function getMyAddresses(req, res, next) {
    try {
        const addresses = await addressService.getAddressesByUserId(
            req.user.userId
        );
        res.status(200).json({ addresses });
    } catch (err) {
        next(err);
    }
}