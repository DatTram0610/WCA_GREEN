/* global angular */
/* https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#data-services */
(function() {
    'use strict'

    angular.module('wca.services')
        .factory('proposalService', proposalServiceFactory)


    proposalServiceFactory.$inject = ['$http', '$q']


    function proposalServiceFactory($http, $q) {
        return {
            getByFundId: getByFundId,
            updateFund: updateFund,
            getAllProposedFunds: getAllProposedFunds,

            getById: getById,
            updateProject: updateProject,
            getAllProposedProjects: getAllProposedProjects,

            getByOrgId: getByOrgId,
            updateOrganization: updateOrganization,
            getAllProposedOrganizations: getAllProposedOrganizations
        }


        //////FUNDS///////////////////////////////////////////////////////

        function getByFundId(id, onSuccess, onError) {
            return $http.get(`/api/proposed-funds/${id}`)
                .then(xhrSuccess)
                .catch(onError)
        }

        function updateFund(fundData, onSuccess, onError) {
            return $http.put(`/api/proposed-funds/${fundData._id}`, fundData)
                .then(xhrSuccess)
                .catch(onError)
        }

        function getAllProposedFunds() {
            return $http.get('/api/proposed-funds')
                .then(xhrSuccess)
                .catch(onError)
        }
        //////PROJECTS///////////////////////////////////////////////////////

        function getById(id, onSuccess, onError) {
            return $http.get(`/api/pending-project/${id}`)
                .then(xhrSuccess)
                .catch(onError)
        }

        function updateProject(projectData, onSuccess, onError) {
            return $http.put(`/api/pending-project/${projectData._id}`, projectData)
                .then(xhrSuccess)
                .catch(onError)
        }

        function getAllProposedProjects() {
            return $http.get('/api/pending-project')
                .then(xhrSuccess)
                .catch(onError)
        }
        //////ORGANIZATIONS//////////////////////////////////////////////////

        function getAllProposedOrganizations() {
            return $http.get('/api/proposedOrganization')
                .then(xhrSuccess)
                .catch(onError)
        }

        function getByOrgId(id, onSuccess, onError) {
            return $http.get(`/api/proposedOrganization/${id}`)
                .then(xhrSuccess)
                .catch(onError)
        }

        function updateOrganization(orgData, onSuccess, onError) {
            return $http.put(`/api/proposedOrganization/${orgData._id}`, orgData)
                .then(xhrSuccess)
                .catch(onError)
        }


        //////SUCCESS & ERROR//////////////////////////////////////////////////


        function xhrSuccess(response) {
            return response.data
        }

        function onError(error) {
            return $q.reject(error.data)
        }

    }
})()
