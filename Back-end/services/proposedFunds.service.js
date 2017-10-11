module.exports = proposedFundsService

function proposedFundsService(options) {
    let Funds

    if (!options.modelService) {
        throw new Error('Options.modelService is required')
    }

    Funds = options.modelService

    return {
        getAll: getAll,
        getOne: getOne,
        getFundForMetric: getFundForMetric,
        insert: insert,
        updateOne: updateOne,
        removeOne: removeOne
    }

    function getAll() {
        return Funds.find()
    }

    function getFundForMetric(queryCondition) {
        var date = new Date();
        var timePeriod = parseInt(queryCondition.data.days);
        var range = queryCondition.data.range;
        date.setDate(date.getDate() - timePeriod);
        if (range == "week" || range == "month") {
            return Funds.aggregate([
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
            return Funds.aggregate([
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
        return Funds.findOne(queryCondition)
    }

    function insert(document) {
        let funds = new Funds(document)
        return funds.save()
    }

    function updateOne(queryCondition, doc) {
        return Funds.findOneAndUpdate(queryCondition, doc, {
            new: true
        })
    }

    function removeOne(queryCondition) {
        return Funds.findOneAndRemove(queryCondition)
    }
}
