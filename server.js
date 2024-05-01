import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import doctorRouter from './routes/doctor.router.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB!');
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRouter);

// app.get("/", (req, res) => {
//     // root route http://localhost:5000/
//     res.send("Hello World!");
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
