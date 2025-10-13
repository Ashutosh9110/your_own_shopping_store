import User from "../models/User.js";
import Address from "../models/Address.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone", "role"],
      include: [{ model: Address }],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    await User.update({ name, email, phone }, { where: { id: req.user.id } });
    const updatedUser = await User.findByPk(req.user.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { fullName, street, city, state, postalCode, country, phone, isDefault } = req.body;
    const address = await Address.create({
      userId: req.user.id,
      fullName,
      street,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Failed to add address", error });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id } });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.destroy({ where: { id, userId: req.user.id } });
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address", error });
  }
};
