import Yup from "yup";
import express from "express";

export default {
  success(res, data, message) {
    res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
    });
  },
  error(res, error, message) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({
        meta: {
          status: 400,
          message,
        },
        data: {
          [`${error.path}`]: error.errors[0],
        },
      });
    }
    if (error?.code) {
      const _err = error;
      return res.status(500).json({
        meta: {
          status: 500,
          message: _err.errorResponse.errmsg,
        },
        data: _err,
      });
    }
    res.status(500).json({
      meta: {
        status: 500,
        message,
      },
      data: error,
    });
  },
  unauthorized(res, message = "unauthorized") {
    res.status(403).json({
      meta: {
        status: 403,
        message,
      },
      data: null,
    });
  },
};
