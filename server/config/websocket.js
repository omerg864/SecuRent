import { wss } from '../server';
import url from 'url';
import {
	decodeAdminToken,
	decodeBusinessToken,
	decodeCustomerToken,
} from '../utils/functions';

const customers = [];
const admins = [];
const businesses = [];

wss.on('connection', (ws, req) => {
	ws.send('Welcome to the WebSocket server!');
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
		} else if (ws.type === 'customer') {
			customers.splice(customers.indexOf(ws), 1);
		} else if (ws.type === 'business') {
			businesses.splice(businesses.indexOf(ws), 1);
		}
	});

	ws.on('error', (error) => {
		console.error('WebSocket error:', error);
	});
});

export { customers, admins, businesses };
