import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateToken = (userOrId, expiresIn = "30d") => {
	if (typeof userOrId === "string") {
		return jwt.sign({ id: userOrId }, env.JWT_SECRET, { expiresIn });
	}
	const user = userOrId;
	return jwt.sign(
		{ id: user._id, role: user.role, name: user.name, email: user.email },
		env.JWT_SECRET,
		{ expiresIn }
	);
};