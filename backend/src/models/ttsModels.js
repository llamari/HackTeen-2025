import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import Usuario from './usersModels.js';

const Text = sequelize.define('Text', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, 
            key: 'id'
        }
    }
}, {
    tableName: 'Text' // força o nome exato da tabela no banco
});

// 🔗 Associação
Usuario.hasMany(Text, { foreignKey: 'user_id' });
Text.belongsTo(Usuario, { foreignKey: 'user_id' });

export default Text;
