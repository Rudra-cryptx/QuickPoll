
const express = require('express');

const router = express.Router();

const {
    createPoll,
    getPolls,
    getPollById,
    votePoll,
    getResults
} = require('../controllers/poll.controller');

router.post('/', createPoll);

router.get('/', getPolls);

router.get('/:id', getPollById);

router.post('/:id/vote', votePoll);

router.get('/:id/results', getResults);

module.exports = router;
