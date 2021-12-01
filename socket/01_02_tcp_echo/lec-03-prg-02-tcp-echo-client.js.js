const net = require("net");
const readline = require("readline");

const host = "127.0.0.1";
const port = 10397;

// 키보드 입력을 위한 변수
const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 소켓 연결
const socket = net.connect({ host, port });
socket.setEncoding("utf8");

// 소켓이 성공적으로 연결된 것을 감지하는 event listner
// 이벤트가 들어오면 지정한 call back 함수가 호출된다.
socket.on("connect", () => {
  console.log("> echo-client is activated");

  // 키보드 입력을 받는다.
  r.question("> ", (input) => {
    // 키보드 입력이 완료되면 socket.write를 통해 서버로 데이터를 보낸다.
    socket.write(input);
    // quit 명령어가 들어오면 종료한다.
    if (input === "quit") {
      console.log("> echo-client is de-activated");

      r.close();
    }
  });
});

// 소켓으로부터 데이터가 들어온 것을 감지하는 event listner
// 이벤트가 들어오면 지정한 call back 함수가 호출된다.
socket.on("data", (data) => {
  console.log("> received:", data);

  r.question("> ", (input) => {
    // socket.write를 통해 서버에 데이터를 보낸다.
    socket.write(input);
    // quit 명령어가 들어오면 종료한다.
    if (input === "quit") {
      console.log("> echo-client is de-activated");

      r.close();
    }
  });
});
