module.exports = (sequelize, DataTypes) => {
  const edit = sequelize.define("Edit", {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  return edit;
};
