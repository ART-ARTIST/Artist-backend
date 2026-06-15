import express from "express";

import auth from "../middleware/auth.js";

import {
  createOffer,
  getArtistOffers,
    getMyOffers,
  acceptOffer,
  declineOffer,
  resetOfferStatus,
  cancelOffer,
  deleteOffer,
} from "../controllers/offerController.js";

const router = express.Router();

router.post(
  "/create/:postId",
  auth,
  createOffer
);

router.get(
  "/artist",
  auth,
  getArtistOffers
);

router.put(
  "/accept/:id",
  auth,
  acceptOffer
);

router.put(
  "/decline/:id",
  auth,
  declineOffer
);
router.put("/reset/:id", auth, resetOfferStatus);

router.put("/cancel/:id", auth, cancelOffer);

router.get(
  "/my-offers",
  auth,
  getMyOffers
);

router.delete(
  "/delete/:id",
  auth,
  deleteOffer
);

export default router;