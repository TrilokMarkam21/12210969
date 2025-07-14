const Url = require('../src/model/url');
const generateShortCode = require('../src/utils/generateShortCode');
const validUrl = require('validator').isURL;
const geoip = require('geoip-lite');


exports.createShortUrl = async (req, res, next) => {
    try {
        const { url, validity, shortcode} = req.body;
        if (!validUrl(url)) { 
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const shortCode = await generateShortCode(Url, shortcode);
        const minutes = validity || 30;
        const expiry = new Date(Date.now() + minutes * 60 * 1000);
        const newUrl = new Url({originalUrl: url, shortCode, expiryDate: expiry});
        await newUrl.save();
        res.status(201).json({ shortLink: `$req.protocol}://${req.headers.host}/${shortCode}`, expiry: expiry.toISOString() });
    } catch (error) {
        next(error);
    }
};

exports.redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await Url.findOne({ shortCode });
    if (!urlDoc) return res.status(404).json({ error: 'Shortcode not found' });
    if (Date.now() > urlDoc.expiryDate.getTime()) return res.status(410).json({ error: 'Link expired' });

    const referrer = req.get('Referrer') || 'Direct';
    const geo = geoip.lookup(req.ip) || {};
    const location = geo.city || geo.country || 'Unknown';

    urlDoc.clicks.push({ timestamp: new Date(), referrer, location });
    await urlDoc.save();
    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    next(err);
  }
};

exports.getShortUrlStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await Url.findOne({ shortCode });
    if (!urlDoc) return res.status(404).json({ error: 'Shortcode not found' });
    res.json({
      originalUrl: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt,
      expiryDate: urlDoc.expiryDate,
      totalClicks: urlDoc.clicks.length,
      clicks: urlDoc.clicks
    });
  } catch (err) {
    next(err);
  }
};
