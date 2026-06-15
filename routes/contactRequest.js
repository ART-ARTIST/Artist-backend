import express from "express";
import ContactRequest
from "../models/ContactRequest.js";

import User
from "../models/User.js";

const router = express.Router();
router.post(
  "/send/:artistId",
  async (req, res) => {

    try {

      const { artistId } =
        req.params;

      const { userId } =
        req.body;

      const already =
        await ContactRequest.findOne({
          artistId,
          userId,
          status: "pending",
        });

      if (already) {
        return res.status(400).json({
          msg:
            "Request already sent",
        });
      }
      
     



      const request =
        await ContactRequest.create({
          artistId,
          userId,
        });

      res.json(request);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Server Error",
      });

    }
  }
);


router.get(
  "/artist/:artistId",
  async (req, res) => {

    const requests =
      await ContactRequest
        .find({
          artistId:
            req.params.artistId,
        })
        .populate(
          "userId"
        ).sort({ createdAt: -1 });

    res.json(requests);
  }
);


router.put(
  "/approve/:id",
  async (req, res) => {

    const request =
      await ContactRequest.findById(
        req.params.id
      );

    request.status =
      "approved";

    await request.save();

    res.json({
      success: true,
    });
  }
);

router.put(
  "/reject/:id",
  async (req, res) => {

    const request =
      await ContactRequest.findById(
        req.params.id
      );

    request.status =
      "rejected";

    await request.save();

    res.json({
      success: true,
    });
  }
);


router.put(
  "/reset/:id",
  async (req, res) => {

    const request =
      await ContactRequest.findById(
        req.params.id
      );

    request.status =
      "pending";

    await request.save();

    res.json({
      success: true,
    });

  }
);

router.put(
  "/cancel/:id",
  async (req, res) => {
    try {

      const request =
        await ContactRequest.findById(
          req.params.id
        );

      if (!request) {
        return res.status(404).json({
          msg: "Request not found",
        });
      }

      request.status =
        "cancelled";

      await request.save();

      res.json({
        success: true,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Server Error",
      });

    }
  }
);


router.get(
  "/check/:artistId/:userId",
  async (req, res) => {

    try {

      const request =
        await ContactRequest.findOne({
          artistId: req.params.artistId,
          userId: req.params.userId,
          status: { $ne: "cancelled" }
        });

      res.json({
        exists: !!request,
        status: request?.status || null
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Server Error"
      });

    }

  }
);


router.get(
"/user/:userId",
async(req,res)=>{

const requests =
await ContactRequest
.find({
userId:
req.params.userId
})
.populate(
"artistId"
).sort({ createdAt: -1 });

res.json(requests);

});


router.delete(
  "/delete/:id",
  async (req, res) => {

    try {

      const request =
        await ContactRequest.findById(
          req.params.id
        );

      if (!request) {
        return res.status(404).json({
          msg: "Request not found",
        });
      }

      if (
        request.status !== "rejected" &&
        request.status !== "cancelled"
      ) {
        return res.status(400).json({
          msg:
            "Only rejected or cancelled requests can be deleted",
        });
      }

      await ContactRequest.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg: "Server Error",
      });

    }
  }
);

export default router;