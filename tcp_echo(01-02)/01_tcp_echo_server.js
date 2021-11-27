const net = require("net");
const { exit } = require("process");

const host = "127.0.0.1";
const port = 10397;

// 소켓 서버를 생성한다.
const server = net.createServer((socket) => {
  socket.setEncoding("utf8"); // utf8을 이용하여 인코딩하겠다고 명시.
  console.log(
    "> client connected by Ip address " +
      socket.address().address +
      " with Port number " +
      socket.address().port
  );

  let RecvData;
  // client로 부터 오는 data를 화면에 출력
  socket.on("data", (data) => {
    console.log("> echoed: " + data);
    RecvData = data;
    if (RecvData === "quit") {
      console.log("> echo-server is de-activated");
      socket.destroy();
      exit();
    }
    // 클라이언트에게 소켓을 통해 메시지를 전달한다.
    writeData(socket, data);
  });
});

// 서버를 동작시킨다.
// 서버가 돌아갈 host, port 넘버를 지정해준다.
server.listen(port, host, () => {
  console.log("> echo-server is activated");
});

// 데이터 보내기
// 특정 socket에게 메시지를 전달한다.
function writeData(socket, data) {
  var success = socket.write(data);
  if (success) {
    (function (socket, data) {
      socket.once("drain", function () {
        writeData(socket, data);
      });
    })(socket, data);
  }
}
