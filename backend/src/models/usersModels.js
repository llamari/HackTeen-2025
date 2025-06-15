import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'Usuarios' // força o nome exato da tabela no banco
})

export default Usuario;