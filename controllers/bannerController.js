import Banner from "../models/Banner.js";

export const createBanner =
  async (req, res) => {

    try {

      // const banner =
      //   await Banner.create({

      //     title: req.body.title,

      //     subtitle:
      //       req.body.subtitle,
            
      //        position: req.body.position,

      //     media:
      //       `/uploads/banners/${req.file.filename}`,

      //     mediaType:
      //       req.file.mimetype.startsWith(
      //         "video"
      //       )
      //         ? "video"
      //         : "image",
      //   });
      const banner = await Banner.create({
  title: req.body.title,
  subtitle: req.body.subtitle,
  position: req.body.position,

  media: req.file.path,

  mediaType:
    req.file.mimetype.startsWith("video")
      ? "video"
      : "image",
});

      res.json(banner);

    } catch (err) {

      res.status(500).json({
        msg: err.message,
      });

    }
  };



  export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }); // 👈 ONLY LIVE
    res.json(banners);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


  export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ msg: "Banner not found" });
    }

    await banner.deleteOne();

    res.json({ msg: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



export const toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ msg: "Banner not found" });
    }

    banner.active = !banner.active;
    await banner.save();

    res.json({
      msg: "Updated",
      active: banner.active,
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find(); // 👈 no filter
    res.json(banners);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};