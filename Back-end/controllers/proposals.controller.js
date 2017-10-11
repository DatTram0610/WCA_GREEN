const responses = require('../models/responses');
const path = require('path');
const apiPrefix = '/api/proposals';

const proposedProjectModel = require('../models/project').pendingProject;
const proposedFundsModel = require('../models/funds').proposedFunds;
const proposedOrganizationModel = require('../models/organization').proposedOrganization

const proposedOrganizationService = require('../services/proposedOrganization.service')({
    modelService: proposedOrganizationModel
});
const proposedProjectService = require('../services/proposedProject.service')({
	modelService: proposedProjectModel
});
const proposedFundsService = require('../services/proposedFunds.service')({
    modelService: proposedFundsModel
});

module.exports = proposalsController;

function proposalsController() {
    return {
        getProjects: getProjects,
        getFunds: getFunds,
        getOrganizations: getOrganizations
    };

    function getProjects(req, res) {
        let queryCondition = {
            data: req.query
        }
        proposedProjectService
            .getProjectForMetric(queryCondition)
            .then(projects => {
                const responseModel = new responses.ItemsResponse();
                responseModel.items = projects;
                res.json(responseModel);
            })
            .catch(err => {
                res.status(500).send(new responses.ErrorResponse(err));

            });
    };

    function getOrganizations(req, res) {
        let queryCondition = {
            data: req.query
        }
        proposedOrganizationService
            .getOrganizationForMetric(queryCondition)
            .then(organizations => {
                const responseModel = new responses.ItemsResponse();
                responseModel.items = organizations;
                res.json(responseModel);

            })
            .catch(err => {
                res.status(500).send(new responses.ErrorResponse(err));

            });
    };

    function getFunds(req, res) {
        let queryCondition = {
            data: req.query
        }
        proposedFundsService
            .getFundForMetric(queryCondition)
            .then(funds => {
                const responseModel = new responses.ItemsResponse();
                responseModel.items = funds;
                res.json(responseModel);

            })
            .catch(err => {
                res.status(500).send(new responses.ErrorResponse(err));

            });
    };
}
