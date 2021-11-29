const net = require("net");
const { exit } = require("process");

const host = "127.0.0.1";
const port = 10397;

// 소켓 서버를 생성한다.
// createServer의 파라미터로 연결이 들어왔을때 실행할 콜백함수를 넣어준다.
const server = net.createServer((socket) => {
  socket.setEncoding("utf8"); // utf8을 이용하여 인코딩하겠다고 명시.

  console.log(
    "> client connected by Ip address " +
      socket.address().address +
      " with Port number " +
      socket.address().port
  );

  let RecvData;

  // 소켓으로부터 데이터가 들어온 것을 감지하는 event listner
  // 이벤트가 들어오면 지정한 call back 함수가 호출된다.
  socket.on("data", (data) => {
    console.log("> echoed: " + data);
    RecvData = data;
    if (RecvData === "quit") {
      console.log("> echo-server is de-activated");
      exit();
    }
    // 클라이언트에게 소켓을 통해 메시지를 전달한다.
    socket.write(data);
  });
});

// 서버가 특정 host, port에 대해 요청이 들어오는 것을 확인하도록 listen하도록 한다.
// 서버가 요청이 오기를 기다리는 listen 상태가 된다.
server.listen(port, host, () => {
  console.log("> echo-server is activated");
});
