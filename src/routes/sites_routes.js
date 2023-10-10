const router = require('express').Router();
const { param, query } = require('express-validator');
const apiErrorReporter = require('../utils/apierrorreporter');
const controller = require('../controllers/sites_controller.js');
const promiseHandler = require('../utils/promise-handler');

/**
 * Custom validate.js validator.  Validates a set of parameters to
 * make sure enough data was passed in to complete a geo search.
 *
 * @param {*} value - unused but required by validate.js.
 * @param {Object} param1 - object containins request parameters to check.
 * @returns {boolean} - true if the provided geo params are complete.
 * @private
 */
const geoParamsValidator = (value, { req }) => {
  const { lat, lng, radius, radiusUnit } = req.query;

  if (lat && lng && radius && radiusUnit) {
    return true;
  }

  throw new Error(
    'When using geo lookup, params lat, lng, radius, radiusUnit are required.'
  );
};

// GET /sites
router.get(
  '/sites',
  [
    /* eslint-disable newline-per-chained-call */
    query('lat').optional().custom(geoParamsValidator).isFloat().toFloat(),
    query('lng').optional().custom(geoParamsValidator).isFloat().toFloat(),
    query('radius')
      .optional()
      .custom(geoParamsValidator)
      .isFloat({ min: 0.1 })
      .toFloat(),
    query('radiusUnit')
      .optional()
      .custom(geoParamsValidator)
      .isIn(['MI', 'KM']),
    query('onlyExcessCapacity').optional().isBoolean().toBoolean(),
    /* eslint-enable */
    apiErrorReporter,
  ],
  promiseHandler(async (req, res, next) =>
    controller.getSitesNearby(
      req.query.lat,
      req.query.lng,
      req.query.radius,
      req.query.radiusUnit,
      req.query.onlyExcessCapacity
    )
  )
);

// GET /sites/999
router.get(
  '/sites/:siteId',
  [param('siteId').isInt().toInt(), apiErrorReporter],
  promiseHandler(async (req, res, next) =>
    controller.getSite(req.params.siteId)
  )
);

module.exports = router;
