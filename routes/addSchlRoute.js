const express = require('express');
const schoolController = require('../controller/schoolController');
const schoolRouter = express.Router();

schoolRouter.post('/addSchool', schoolController.postAddSchool);
schoolRouter.get('/listSchools', schoolController.getSchoolList);

module.exports = schoolRouter;
