import * as addressService from '../services/address.service.js';
import * as userService from '../services/user.service.js';
import { addressSchema } from '../validations/address.validation.js';

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

// Admin route — uses userId from URL params
export async function getAddressesByUserId(req, res, next) {
    try {
        // Verify the user exists first
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const addresses = await addressService.getAddressesByUserId(
            req.params.id
        );
        res.status(200).json({ addresses });
    } catch (err) {
        next(err);
    }
}

// Customer shortcut
export async function createMyAddress(req, res, next) {
    try {
        const data = addressSchema.parse(req.body);
        const address = await addressService.createAddress(
            req.user.userId,
            data,
        );
        res.status(201).json(address);
    } catch (err) {
        next(err);
    }
}

// Admin route
export async function createAddressForUser(req, res, next) {
    try {
        const data = addressSchema.parse(req.body);

        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const address = await addressService.createAddress(
            req.params.id,
            data,
        );
        res.status(201).json(address);
    } catch (err) {
        next(err);
    }
}