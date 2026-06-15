import Offer from "../models/Offer.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

export const createOffer = async (
  req,
  res
) => {
  try {

    const { postId } = req.params;

    const {
      offerPrice,
      message,
    } = req.body;

    const buyerId = req.user.id;

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    const artistId = post.userId;

    const already =
      await Offer.findOne({
        postId,
        buyerId,
        status: "pending",
      });

    if (already) {
      return res.status(400).json({
        msg: "Offer already sent",
      });
    }

    const offer =
      await Offer.create({
        postId,
        artistId,
        buyerId,
        offerPrice,
        message,
      });

      await Notification.create({
  userId: artistId,
  senderId: buyerId,
  postId,
  type: "offer_received",
  message: "New offer received on your artwork",
});

    res.json(offer);

  } catch (err) {

    res.status(500).json({
      msg: err.message,
    });

  }
};

export const getArtistOffers =
  async (req, res) => {
    try {

      const artistId =
        req.user.id;

      const offers =
        await Offer.find({
          artistId,
        })
          .populate(
            "buyerId",
            "name avatar phone"
          )
          .populate(
            "postId",
            "title price media"
          )
          .sort({
            createdAt: -1,
          });

      res.json(offers);

    } catch (err) {

      res.status(500).json({
        msg: err.message,
      });

    }
  };

export const acceptOffer =
  async (req, res) => {

    try {

      const offer =
        await Offer.findById(
          req.params.id
        );

      if (!offer) {
        return res.status(404).json({
          msg: "Offer not found",
        });
      }

      offer.status =
        "accepted";

      await offer.save();
      await Notification.create({
  userId: offer.buyerId,
  senderId: offer.artistId,
  postId: offer.postId,
  type: "offer_accepted",
  message: "Your offer was accepted",
});

      res.json({
        msg: "Accepted",
      });

    } catch (err) {

      res.status(500).json({
        msg: err.message,
      });

    }
  };



export const declineOffer =
  async (req, res) => {

    try {

      const offer =
        await Offer.findById(
          req.params.id
        );

      if (!offer) {
        return res.status(404).json({
          msg: "Offer not found",
        });
      }

      offer.status =
        "declined";

      await offer.save();

      await Notification.create({
  userId: offer.buyerId,
  senderId: offer.artistId,
  postId: offer.postId,
  type: "offer_declined",
  message: "Your offer was declined",
});

      res.json({
        msg: "Declined",
      });

    } catch (err) {

      res.status(500).json({
        msg: err.message,
      });

    }
  };


  export const getMyOffers =
async (req, res) => {

  try {

    const buyerId =
      req.user.id;

    const offers =
      await Offer.find({
        buyerId,
      })
      .populate(
        "postId",
        "title price media"
      )
      .populate(
        "artistId",
        "name avatar phone"
      )
      .sort({
        createdAt: -1,
      });

    res.json(offers);

  } catch (err) {

    res.status(500).json({
      msg: err.message,
    });

  }
};


export const resetOfferStatus = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ msg: "Offer not found" });
    }

    if (offer.artistId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // RESET BACK TO PENDING (IMPORTANT)
    offer.status = "pending";

    await offer.save();

    res.json({ msg: "Offer reset to pending", offer });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};







export const cancelOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ msg: "Offer not found" });
    }

    const userId = req.user._id || req.user.id;

    if (offer.buyerId.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    if (offer.status === "cancelled") {
      return res.status(400).json({ msg: "Already cancelled" });
    }

    offer.status = "cancelled";
    await offer.save();

    await Notification.create({
  userId: offer.artistId,
  senderId: offer.buyerId,
  postId: offer.postId,
  type: "offer_cancelled",
  message: "Buyer cancelled the offer",
});

    res.json({ msg: "Offer cancelled", offer });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};


export const deleteOffer = async (req, res) => {
  try {

    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        msg: "Offer not found",
      });
    }

    const userId = req.user.id;

    const isBuyer =
      offer.buyerId.toString() === userId;

    const isArtist =
      offer.artistId.toString() === userId;

    if (!isBuyer && !isArtist) {
      return res.status(403).json({
        msg: "Not allowed",
      });
    }

    // only cancelled or declined can be deleted
    if (
      offer.status !== "cancelled" &&
      offer.status !== "declined"
    ) {
      return res.status(400).json({
        msg: "Only cancelled/declined offers can be deleted",
      });
    }

    await Offer.findByIdAndDelete(
      req.params.id
    );

    res.json({
      msg: "Offer deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      msg: err.message,
    });

  }
};