const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({
      _id: req.params.id,
    })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1]; // deleting the linked file
        fs.unlink(`images/${filename}`, () => {});
      })
      .catch((error) =>
        res.status(500).json({
          error,
        })
      );
  }
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()

    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
  console.log(req.body);
  console.log(
    "Utilisateur qui ont like ou unlike = " + like,
    "Id de l'utilisateur est : " + userId,
    "Id de la sauce " + sauceId
  );

  Sauce.findOne({
    _id: req.params.id,
  })

    .then((sauces) => {
      if (like == 1) {
        sauces.likes++;
        sauces.usersLiked.push(userId);
      }
      if (like == -1) {
        sauces.dislikes++;
        sauces.usersDisliked.push(userId);
      }
      if (like == 0) {
        if (sauces.usersLiked.includes(userId)) {
          sauces.usersLiked.splice(userId) && sauces.likes--;
        }

        if (sauces.usersDisliked.includes(userId)) {
          sauces.usersDisliked.splice(userId) && sauces.dislikes--;
        }
      }
      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: sauces.likes,
          dislikes: sauces.dislikes,
          usersLiked: sauces.usersLiked,
          usersDisliked: sauces.usersDisliked,
          _id: req.params.id,
        }
      )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
      console.log(sauces.usersLiked);
      console.log(sauces.usersDisliked);
      console.log(sauces.likes);
      console.log(sauces.dislikes);

      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};