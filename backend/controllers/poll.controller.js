
const Poll = require('../models/poll.model');

// Create a new poll
const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;

        if (!question || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Question and at least 2 options are required'
            });
        }

        const formattedOptions = options.map(option => ({
            text: option.trim()
        }));

        if (formattedOptions.some(option => !option.text)) {
            return res.status(400).json({
                success: false,
                message: 'Options cannot be empty'
            });
        }

        const poll = await Poll.create({
            question,
            options: formattedOptions
        });

        res.status(201).json({
            success: true,
            message: 'Poll created successfully',
            poll
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all polls
const getPolls = async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            polls
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single poll
const getPollById = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({
                success: false,
                message: 'Poll not found'
            });
        }

        res.status(200).json({
            success: true,
            poll
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Vote on a poll

// Vote on a poll
const votePoll = async (req, res) => {
    try {
        const { optionId, voterId } = req.body;

        // Validate voter ID
        if (!voterId || typeof voterId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Voter ID is required'
            });
        }

        if (voterId.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Invalid voter ID'
            });
        }

        if (!optionId) {
            return res.status(400).json({
                success: false,
                message: 'Option ID is required'
            });
        }

        // Atomically check voter and register the vote
        const updatedPoll = await Poll.findOneAndUpdate(
            {
                _id: req.params.id,
                voters: { $ne: voterId },
                'options._id': optionId
            },
            {
                $inc: { 'options.$.votes': 1 },
                $addToSet: { voters: voterId }
            },
            {
                new: true
            }
        );

        if (!updatedPoll) {
            const poll = await Poll.findById(req.params.id);

            if (!poll) {
                return res.status(404).json({
                    success: false,
                    message: 'Poll not found'
                });
            }

            if (poll.voters.includes(voterId)) {
                return res.status(409).json({
                    success: false,
                    message: 'You have already voted in this poll'
                });
            }

            return res.status(404).json({
                success: false,
                message: 'Option not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vote submitted successfully',
            poll: updatedPoll
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get poll results
const getResults = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({
                success: false,
                message: 'Poll not found'
            });
        }

        const totalVotes = poll.options.reduce(
            (total, option) => total + option.votes, 0
        );

        const results = poll.options.map(option => ({
            optionId: option._id,
            text: option.text,
            votes: option.votes,
            percentage: totalVotes === 0
                ? 0
                : Number(((option.votes / totalVotes) * 100).toFixed(2))
        }));

        res.status(200).json({
            success: true,
            totalVotes,
            results
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPoll,
    getPolls,
    getPollById,
    votePoll,
    getResults
};
