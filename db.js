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
});

const Restaurant = db.define('restaurant', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
   type: Sequelize.STRING,
   allowNull: false
  }
})

const User = db.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: Sequelize.STRING
})

Rating.belongsTo(Restaurant)
Restaurant.hasOne(Rating)

Rating.belongsToMany(User, {through: 'userRating'})
User.belongsToMany(Rating, {through: 'userRating'})

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
};

module.exports = {
  db,
  Rating,
  Restaurant,
  User,
  seed
};
