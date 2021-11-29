const net = require("net");
const { exit } = require("process");

const host = "127.0.0.1";
const port = 10397;

let clientPool = []; // 접속한 클라이언트들을 관리할 풀.

// 소켓 서버를 생성한다.
// 서버 생성에 대한 오류를 catch 한다.
try {
  const server = net.createServer((socket) => {
    socket.setEncoding("utf8"); // utf8을 이용하여 인코딩하겠다고 명시.

    // 클라이언트를 관리하는 풀에 새로 연결된 socket을 넣는다.
    clientPool.push(socket);

    console.log(
      "> client connected by Ip address " +
        socket.remoteAddress +
        " with Port number " +
        socket.remotePort
    );

    let RecvData;
    // 소켓으로부터 데이터가 들어온 것을 감지하는 event listner
    // 이벤트가 들어오면 지정한 call back 함수가 호출된다.
    socket.on("data", (data) => {
      console.log("> echoed: " + data + " by asynchronized server");
      RecvData = data;

      // 클라이언트에게 소켓을 통해 메시지를 전달한다.
      writeData(socket, data);
    });

    // FIN 패킷이 들어오는 것에 대하 탐지한다.
    // client가 end를 통해 FIN을 보내면 이를 감지하고, 통신을 종료하도록한다.
    socket.on("end", () => {
      try {
        socket.end();
      } catch {
        console.log("socket destroy error");
      }
    });

    // 소켓연결이 완전히 종료되었음을 감지하는 event listner
    // 이벤트가 들어오면 지정한 call back 함수가 호출된다.
    socket.on("close", () => {
      console.log("> someone disconnect");
      const exitSocket = clientPool.findIndex((item) => item === socket);
      if (exitSocket > -1) clientPool.splice(exitSocket, 1);

      // 만약 모든 연결된 클라이언트가 종료된 경우 자동으로 서버를 종료한다.
      if (clientPool.length == 0) {
        console.log("> stop procedure started");
        server.close();
        console.log("> echo-server is de-activated");
        exit(1);
      } else {
        console.log(
          "> active client are remained : " + clientPool.length + " clients"
        );
      }
    });

    // 해당 소켓에서 에러가 확인하는 것을 감지하는 event listener를 등록한다.
    // 에러가 감지되면 call back 함수가 수행된다.
    socket.on("error", (err) => {
      console.log("net socket error!: " + err);
    });
  });

  // 서버가 특정 host, port에 대해 요청이 들어오는 것을 확인하도록 listen하도록 한다.
  // 서버가 요청이 오기를 기다리는 listen 상태가 된다.
  // try-catch를 통해 서버를 동작시키는데 문제가 발생하는 것을 확인한다.
  try {
    server.listen(port, host, () => {
      console.log("> echo-server is activated");
    });
  } catch {
    console.log("activate server errror");
    exit(1);
  }
} catch {
  console.log("create server error");
  exit(1);
}

// 데이터 보내기
// 특정 socket에게 메시지를 전달한다.
// 실패시 메시지를 다시 보내도록 구현한다.
// drain 핸들러를 통해 메시지가 보내지지 않았다면 다시 보내는 작업을 수행한다.
const writeData = (socket, data) => {
  var success = socket.write(data);
  if (!success) {
    console.log("message write error. send again");
    (function (socket, data) {
      socket.once("drain", function () {
        writeData(socket, data);
      });
    })(socket, data);
  }
};
