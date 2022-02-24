const socket = io.connect('http://localhost:8000');

socket.on('connect', function(data) {
    socket.emit('join','hello server from cline');
});
socket.on('thread', function(data){
    $('#thread').append('<li>' + data + '<li>')
    console.log(data)
})

$('from').submit(function() {
    const message = $('#message').val();
    socket.emit('messages', message);
    console.log(message)
    this.reset();
    return false;
})
var myForm = document.forms["myForm"];
var u = myForm["message"].value;
console.log('message', u)