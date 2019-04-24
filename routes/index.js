const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const Location = require('../models/Location')

/* GET home page */
router.get('/', (req, res, next) => {
    Location.find({})
        .then(locationNames => {
            Event.find({})
                .populate('location')
                .then(events => {
                    eventsObj = events.map(oneEvent => {
                        let going = req.user.goingEvents.map(el => el + '').includes(oneEvent._id + '')
                        const { _id, date, event, door, begin, end, price, location } = oneEvent
                        return { _id, date, event, door, begin, end, price, location, going }
                    })
                    res.render('index', { eventsObj, locationNames })
                })
        })
        .catch(err => {
            console.error('Error while finding events', err)
        })
})

router.post('/', (req, res, next) => {
    const filteredEvents = Object.values(req.body)
    Location.find({})
        .then(locationNames => {
            Event.find({ location: { $in: filteredEvents } })
                .populate('location')
                .then(events => {
                    res.render('index', { events, locationNames })
                })
        })
        .catch(err => {
            console.error('Error while finding events', err)
        })
})

module.exports = router
