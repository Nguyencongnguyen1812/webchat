const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Chat = new mongoose.Schema(
    {
        name: 'string',
        email: 'string',
        password: 'string',
        quequan: 'string',
        chucvu: 'string',
        ngaysinh: 'string',
        role: 'string'
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('use', Use)