module.exports = proposedProjectService

function proposedProjectService(options) {
    let ProposedProject

    if (!options.modelService) {
        throw new Error('Options.modelService is required')
    }

    ProposedProject = options.modelService

    return {
        getAll: getAll,
        getProjectForMetric: getProjectForMetric,
        getOne: getOne,
        insert: insert,
        updateOne: updateOne,
        removeOne: removeOne
    }

    function getAll() {
        return ProposedProject.find()
    }

    function getProjectForMetric(queryCondition) {
        var date = new Date();
        var timePeriod = parseInt(queryCondition.data.days);
        var range = queryCondition.data.range;
        date.setDate(date.getDate() - timePeriod);
        if (range == "week" || range == "month") {
            return ProposedProject.aggregate([
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
            return ProposedProject.aggregate([
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

    function getOne(queryCondition) {
        return ProposedProject.findOne(queryCondition)
    }

    function insert(document) {
        let strategy = new ProposedProject(document)
        return strategy.save()
    }

    function updateOne(queryCondition, doc) {
        return ProposedProject.findOneAndUpdate(queryCondition, doc, {
            new: true
        })
    }

    function removeOne(queryCondition) {
        return ProposedProject.findOneAndRemove(queryCondition)
    }
}
