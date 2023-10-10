const router = require('express').Router();
const { param, query } = require('express-validator');
const apiErrorReporter = require('../utils/apierrorreporter');
const controller = require('../controllers/metrics_controller.js');
const promiseHandler = require('../utils/promise-handler');

// GET /metrics/999?n=50
router.get(
  '/metrics/:siteId',
  [
    param('siteId').isInt().toInt(),
    query('n').optional().isInt({ min: 1 }).toInt(),
    apiErrorReporter,
  ],
  promiseHandler(async (req, res, next) => {
    const limit =
      req.query.n == null ||
      Number.isNaN(req.query.n) ||
      undefined === req.query.n
        ? 120
        : req.query.n;

    return controller.getMetricsForSite(req.params.siteId, limit);
  })
);

module.exports = router;
