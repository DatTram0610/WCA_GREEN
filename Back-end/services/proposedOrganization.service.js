module.exports = proposedOrganizationService

function proposedOrganizationService(options) {
    let proposedOrg
    if (!options.modelService) {
        throw new Error('Options.modelService is required')
    }

    ProposedOrg = options.modelService

    return {
        getAll: getAll,
        getOrganizationForMetric: getOrganizationForMetric,
        getOne: getOne,
        insert: insert,
        updateOne: updateOne,
        removeOne: removeOne
    }

    function getOrganizationForMetric(queryCondition) {
        var date = new Date();
        var timePeriod = parseInt(queryCondition.data.days);
        var range = queryCondition.data.range;
        date.setDate(date.getDate() - timePeriod);
        if (range == "week" || range == "month") {
            return ProposedOrg.aggregate([
                {
                    $match: { 'log.createdAt': { $gt: date } }
                },
                {
                    $project: {
                        yearMonthDay: { $dateToString: { format: "%m-%d-%Y", date: "$log.createdAt" } }
                    }
                },
                {
                    $group: {
                        _id: "$yearMonthDay",
                        count: { $sum: 1 }
                    }
                }
            ]).exec()
        }
        else {
            return ProposedOrg.aggregate([
                {
                    $match: { 'log.createdAt': { $gt: date } }
                },
                {
                    $project: {
                        yearMonthDay: { $dateToString: { format: "%m-%Y", date: "$log.createdAt" } }
                    }
                },
                {
                    $group: {
                        _id: "$yearMonthDay",
                        count: { $sum: 1 }
                    }
                }
            ]).exec()
        }
    }

    function getAll() {
        return ProposedOrg.find()
    }

    function getOne(queryCondition) {
        return ProposedOrg.findOne(queryCondition)
    }

    function insert(document) {

        let proposedOrg = new ProposedOrg(document)
        return proposedOrg.save()
    }

    function updateOne(queryCondition, proposedOrg) {
        return ProposedOrg.findOneAndUpdate(queryCondition, proposedOrg, {
            new: true
        })
    }

    function removeOne(queryCondition) {
        return ProposedOrg.findOneAndRemove(queryCondition)
    }

}
