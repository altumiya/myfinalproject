const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/admin/contactenquiryController');

router.post('/add', contactController.create);

router.get('/view', contactController.view);
router.put('/status/:id', contactController.changeStatus);
router.delete('/delete/:id', contactController.deleteEnquiry);

module.exports = router;