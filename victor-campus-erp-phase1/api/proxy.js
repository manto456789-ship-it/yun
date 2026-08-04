const GAS_URL = 'https://script.google.com/macros/s/AKfycbx5gqERJdjXqOeRl8zXCW94_QcuturvPYBYWYFeGofwwLPHmdcY7LE71VYDVQbHBLnK/exec';

module.exports = async function handler(req, res) {
  try {
    let target = GAS_URL;
    const method = req.method || 'GET';
    const options = { method, redirect: 'follow' };

    if (method === 'GET') {
      const params = new URLSearchParams(req.query || {});
      target += `?${params.toString()}`;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(target, options);
    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    res.status(response.ok ? 200 : response.status);
    try {
      res.json(JSON.parse(text));
    } catch {
      res.status(502).json({ success: false, message: '後端回應格式錯誤', detail: text.slice(0, 300) });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || '代理伺服器錯誤' });
  }
};
