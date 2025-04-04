import url from 'url';
import {
	decodeAdminToken,
	decodeBusinessToken,
	decodeCustomerToken,
} from '../utils/functions.js';
import { WebSocketServer } from 'ws';

const customers = [];
const admins = [];
const businesses = [];

const setUpWebSocket = (server) => {
	// websocket url: `ws://localhost:${PORT}` or `wss://yourdomain.com`
	const wss = new WebSocketServer({ server });

	console.log('WebSocket server started'.red.bold);

	wss.on('connection', (ws, req) => {
		console.log('New client connected');
		try {
			const parameters = url.parse(req.url, true);
			if (!parameters.query.token || !parameters.query.type) {
				ws.close();
				return;
			}
			const token = parameters.query.token;
			const type = parameters.query.type;
			if (type === 'admin') {
				ws.id = decodeAdminToken(token);
				ws.type = 'admin';
				if (!ws.id) {
					return;
				}
				console.log('Admin connected:', ws.id);
				admins.push(ws);
			} else if (type === 'customer') {
				ws.id = decodeCustomerToken(parameters.query.token);
				ws.type = 'customer';
				if (!ws.id) {
					return;
				}
				console.log('Customer connected:', ws.id);
				customers.push(ws);
			} else if (type === 'business') {
				ws.id = decodeBusinessToken(parameters.query.token);
				ws.type = 'business';
				if (!ws.id) {
					return;
				}
				console.log('Business connected:', ws.id);
				businesses.push(ws);
			}

			ws.on('close', async () => {
				console.log('Client disconnected:', ws.id);
				if (ws.type === 'admin') {
					admins.splice(admins.indexOf(ws), 1);
					console.log(admins);
				} else if (ws.type === 'customer') {
					customers.splice(customers.indexOf(ws), 1);
				} else if (ws.type === 'business') {
					businesses.splice(businesses.indexOf(ws), 1);
				}
			});

			ws.on('error', (error) => {
				console.error('WebSocket error:', error);
			});
		} catch (error) {
			console.error('WebSocket connection error:', error);
		}
	});
};

export { customers, admins, businesses, setUpWebSocket };
