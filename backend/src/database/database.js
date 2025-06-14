import Sequelize from 'sequelize';

export const sequelizeDatabase = async () => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "./database.sqlite"
    });

    await sequelize.sync({force: true});

    return await sequelize.sync();
}