export default function handler(req, res) {
    res.setHeader('Set-Cookie', 'access_token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.send("log_out");
}
 