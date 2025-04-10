import { Router } from "express";
import getContact from "../controller/contact.controller.js";

const router = Router();

router.route('/getcontacts/:id').get(getContact);

export default router;