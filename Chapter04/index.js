console.log(process.env.IP);
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ host:process.env.IP, port: 8081 }),
    users = {};

wss.on('connection', function (connection) {
  connection.on('message', function (message) {
    var data;

    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log("Error parsing JSON");
      data = {};
    }

    switch (data.type) {
      case "keepAliveReq":
        console.log("receive keepAliveReq myName ", data.myName, "other name ", data.name);
        break;
      case "login":
        console.log("User logged in as", data.name);
        if (users[data.name]) {
          sendTo(connection, {
            type: "login",
            success: false
          });
        } else {
          users[data.name] = connection;
          connection.name = data.name;
          sendTo(connection, {
            type: "login",
            success: true
          });
        }

        break;
      case "offer":
        console.log("Sending offer to", data.name);
        var conn = users[data.name];

        if (conn != null) {
          connection.otherName = data.name;
          sendTo(conn, {
            type: "offer",
            offer: data.offer,
            name: connection.name
          });
        }

        break;
      case "answer":
        console.log("Sending answer to", data.name);
        var conn = users[data.name];

        if (conn != null) {
          connection.otherName = data.name;
          sendTo(conn, {
            type: "answer",
            answer: data.answer
          });
        }

        break;
      case "candidate":
        console.log("Sending candidate to", data.name);
        var conn = users[data.name];

        if (conn != null) {
          sendTo(conn, {
            type: "candidate",
            candidate: data.candidate
          });
        }

        break;
      case "leave":
        console.log("recv leave from ", data.myName, "other party is ", data.name);
        var conn = users[data.name];
        conn.otherName = null;

        if (conn != null) {
          sendTo(conn, {
            type: "leave"
          });
        }

        break;
      default:
        sendTo(connection, {
          type: "error",
          message: "Unrecognized command: " + data.type
        });

        break;
    }
  });

  connection.on('close', function () {
    console.log("recv close from ", connection.name, " other user ", connection.otherName);
    if (connection.name) {
      delete users[connection.name];

      if (connection.otherName) {
        var conn = users[connection.otherName];
        if(conn.otherName !==undefined)
             conn.otherName = null;

        if (conn != null) {
          sendTo(conn, {
            type: "leave"
          });
        }
      }
    }
  });
});

function sendTo(conn, message) {
  conn.send(JSON.stringify(message));
}

wss.on('listening', function () {
    console.log("Server started...");
});
