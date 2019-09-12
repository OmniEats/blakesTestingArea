const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/ratingTest'
);

const Rating = db.define('rating', {
  ratingsCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  rating: Sequelize.ENUM('yes', 'maybe', 'no'),
  totalScore: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  name: Sequelize.STRING
});


Rating.prototype.onVote = async function(vote) {
  this.ratingsCount++;
  if (vote === 'yes') {
    this.totalScore++;
  }
  if (vote === 'no') {
    this.totalScore--
  }
  const avgScore = this.totalScore / this.ratingsCount
   if (avgScore >= .33) {
     this.rating = 'yes'
   }
   if (avgScore <= -.33) {
     this.rating = 'no'
   }
   if (avgScore < .33 && avgScore >-.33) {
    this.rating = 'maybe'
   }

  await this.save();
};

const seed = async () => {
  await db.sync({ force: true });
  await Rating.create({ name: 'test' });
};

module.exports = {
  db,
  Rating,
  seed
};
