import response from "../utils/response";

export default (roles) => {
  // ['admin', 'user']
  return (req, res, next) => {
    const role = req.user?.role; // 'manager' or 'member' for some reason jadinya di cek dulu
    if (!role || !roles.includes(role)) {
      return response.unauthorized(res, "Forbidden");
    }
    next();
  };
};
