const router = require('express').Router()
const proposalsController = require('../controllers/proposals.controller')()

module.exports = router

// api routes ===========================================================
router.get('/projects', proposalsController.getProjects)
router.get('/funds', proposalsController.getFunds)
router.get('/organizations', proposalsController.getOrganizations)
