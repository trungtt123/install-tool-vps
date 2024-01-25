const express = require('express');
const Vps = require('../models/Vps');
const command = require('./command');
const router = express.Router();
const fs = require('fs');
router.get('/reset_ngrok', async (req, res) => {
    try {
        await command.reset();
        return res.status(200).send({
            code: "1000",
            message: "OK"
        });
    }
    catch (e) {
        console.log('Error', e);
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.get('/update_source_code', async (req, res) => {
    try {
        const success = command.update_source_code();
        if (success) return res.status(200).send({
            code: "1000",
            message: "OK"
        });
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
    catch (e) {
        console.log('Error', e);
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
router.get('/run_tool_again', async (req, res) => {
    try {
        const success = command.run_tool_again();
        if (success) return res.status(200).send({
            code: "1000",
            message: "OK"
        });
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
    catch (e) {
        console.log('Error', e);
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});
module.exports = router;