import { v4 as uuid } from 'uuid';
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
			ws.send(
				JSON.stringify({
					type: 'auth',
					data: {
						message: 'Please authenticate',
					},
				})
			);
			ws.on('close', async () => {
				console.log('Client disconnected:', ws.id);
				try {
					if (ws.type === 'admin') {
						admins.splice(admins.indexOf(ws), 1);
						console.log(admins);
					} else if (ws.type === 'customer') {
						customers.splice(customers.indexOf(ws), 1);
					} else if (ws.type === 'business') {
						businesses.splice(businesses.indexOf(ws), 1);
					}
				} catch (error) {
					console.error('Error removing WebSocket:', error);
				}
			});

			ws.on('error', (error) => {
				console.error('WebSocket error:', error);
			});

			ws.on('message', (message) => {
				/*
				message format: in stringified JSON
				{
					type: 'messageType',
					data: {
						message data
					}
				}
				Example:
				{
					type: 'notification',
					data: {
						message: 'New transaction available',
						transactionId: '12345'
					}
				}
				auth format:
				{
					type: 'messageType',
					data: {
						token: string,
						type: string, // admin, customer, business
					}
				}
				*/
				try {
					const msg = JSON.parse(message);
					console.log('Received message:', msg);
					if (msg.type === 'auth') {
						const parameters = msg.data;
						if (!parameters.token || !parameters.type) {
							ws.send(
								JSON.stringify({
									type: 'error',
									data: {
										message: 'Invalid token or type',
									},
								})
							);
							return;
						}
						const token = parameters.token;
						const type = parameters.type;
						if (type === 'admin') {
							const id = decodeAdminToken(token);
							if (!id) {
								ws.send(
									JSON.stringify({
										type: 'error',
										data: {
											message: 'Invalid admin token',
										},
									})
								);
								return;
							}
							ws.id = id;
							ws.type = 'admin';
							console.log('Admin connected:', ws.id);
							// Check if the admin is already connected with websocket object ws
							if (admins.includes(ws)) {
								ws.send(
									JSON.stringify({
										type: 'success',
										data: {
											message:
												'Admin connected successfully',
										},
									})
								);
								return;
							}
							admins.push(ws);
							ws.send(
								JSON.stringify({
									type: 'success',
									data: {
										message: 'Admin connected successfully',
									},
								})
							);
						} else if (type === 'customer') {
							const id = decodeCustomerToken(token);
							if (!id) {
								ws.send(
									JSON.stringify({
										type: 'error',
										data: {
											message: 'Invalid customer token',
										},
									})
								);
								return;
							}
							ws.id = id;
							ws.type = 'customer';
							console.log('Customer connected:', ws.id);
							// Check if the customer is already connected
							if (customers.includes(ws)) {
								ws.send(
									JSON.stringify({
										type: 'success',
										data: {
											message:
												'Customer connected successfully',
										},
									})
								);
								return;
							}
							ws.send(
								JSON.stringify({
									type: 'success',
									data: {
										message:
											'Customer connected successfully',
									},
								})
							);
							customers.push(ws);
						} else if (type === 'business') {
							const id = decodeBusinessToken(token);
							if (!id) {
								ws.send(
									JSON.stringify({
										type: 'error',
										data: {
											message: 'Invalid business token',
										},
									})
								);
								return;
							}
							ws.id = id;
							ws.type = 'business';
							console.log('Business connected:', ws.id);
							// Check if the business is already connected
							if (businesses.includes(ws)) {
								ws.send(
									JSON.stringify({
										type: 'success',
										data: {
											message:
												'Business connected successfully',
										},
									})
								);
								return;
							}
							ws.send(
								JSON.stringify({
									type: 'success',
									data: {
										message:
											'Business connected successfully',
									},
								})
							);
							businesses.push(ws);
						}
					}
				} catch (error) {
					console.error('Error parsing message:', error);
					ws.send(
						JSON.stringify({
							type: 'error',
							data: {
								message: 'Invalid message format',
							},
						})
					);
				}
			});
		} catch (error) {
			console.error('WebSocket connection error:', error);
		}
	});
};

export { customers, admins, businesses, setUpWebSocket };
