const net = require("net");
const readline = require("readline");

const host = "127.0.0.1";
const port = 10397;

// 키보드 입력을 위한 변수
const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input;

r.setPrompt("> ");
r.on("line", (line) => {
  input = line;
});

// 소켓 연결
const socket = net.connect({ host, port });
socket.setEncoding("utf8");

// 소켓 연결되었을때
socket.on("connect", function () {
  console.log("> echo-client is activated");
  // 소켓이 연결되면 바로 입력을 받도록한다.

  r.question("> ", (input) => {
    socket.write(input);
    if (input === "quit") {
      console.log("> echo-client is de-activated");
      socket.destroy();

      r.close();
    }
  });
  // quit 명령어가 들어오면 종료한다.
});

// 서버에서 데이터 받기
socket.on("data", (data) => {
  console.log("> received:", data);

  r.question("> ", (input) => {
    socket.write(input);
    if (input === "quit") {
      console.log("> echo-client is de-activated");
      socket.destroy();

      r.close();
    }
  });
});

// 서버에 데이터 보내기
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
