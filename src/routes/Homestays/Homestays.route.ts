import express,{ Router } from 'express';
import {Homestays} from "../../models/homestays/Homestay.model";

const router = Router();

router.get(
    '/api/v1/homestays',
    () => {
        return Homestays;
    }
)

