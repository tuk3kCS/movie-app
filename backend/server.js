const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-app')
  .then(() => console.log('Đã kết nối đến MongoDB'))
  .catch(err => console.error('Lỗi kết nối đến MongoDB:', err));

const metricsSchema = new mongoose.Schema({
  movieId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  posterUrl: { type: String, required: true },
  count: { type: Number, default: 1 },
});

const Metrics = mongoose.model('Metrics', metricsSchema);

// Cập nhật số lần tìm kiếm
app.post('/api/update-search-count', async (req, res) => {
  try {

    const { movieId, title, posterUrl } = req.body;
    
    if (!movieId || !title) {
      return res.status(400).json({ error: 'Movie ID và title là bắt buộc' });
    }

    // Tìm và cập nhật, hoặc tạo nếu không tồn tại
    const movie = await Metrics.findOneAndUpdate(
      { movieId: movieId }, 
      {
        $inc: { count: 1 },
        $set: {
          title: title,
          posterUrl: posterUrl,
        }
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json({
      success: true,
      movie: movie,
      message: `Đã cập nhật số lần tìm kiếm cho "${title}"`
    });

  } catch (error) {
    console.error('Lỗi cập nhật số lần tìm kiếm:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
});

// Lấy phim thịnh hành
app.get('/api/get-trending-movies', async (req, res) => {
  try {
    const mostSearched = await Metrics
      .find()
      .sort({ count: -1 })
      .limit(5);

    res.json({
      success: true,
      movies: mostSearched
    });

  } catch (error) {
    console.error('Lỗi lấy phim được tìm kiếm nhiều nhất:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
});