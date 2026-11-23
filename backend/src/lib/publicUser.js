export const toPublicUser = ({ _id, name, email, role }) => ({ id: String(_id), name, email, role });

export default toPublicUser;
