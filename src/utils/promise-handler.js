/**
 * @typedef {import('express').Handler} Handler
 *
 * @param {Function} promise
 * @returns {Promise<Handler>}
 */
const promiseHandler = (promise) => async (req, res, next) => {
  try {
    const result = await promise(req, res, next);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = promiseHandler;
