import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {
  res.send('GET request to the user')
})

export default router;