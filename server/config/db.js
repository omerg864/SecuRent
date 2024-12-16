import mongoose from 'mongoose';

const connectDB = async (listen) => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(
			`MongoDB Connected: ${conn.connection.host}`.cyan.underline
		);
		listen();
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

export default connectDB;
