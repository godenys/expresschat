'use strict';

const MessageModel = require('./models/message.model');

module.exports = io => {
    io.on('connection', function (socket) {
        socket.emit('connected', 'You are connected');
        socket.join('all');
        socket.on('msg', (content, username) => {
            const obj = {
                date: new Date(),
                content: content,
                username: username
            }
            MessageModel.create(obj, err => {
                if (err) {
                    return console.error('MessageModel', err);
                }
                socket.emit('message', obj);
                socket.to('all').emit('message', obj);
            }); 
        });
        socket.on('receiveHistory', () => {
            MessageModel
                .find({})
                .sort({date: -1})
                .limit(50)
                .sort({date: 1})
                .lean()
                .exec((err, messages) => {
                    if (!err) {
                        socket.emit('history', messages);
                    }
                });
        });
    });
}
