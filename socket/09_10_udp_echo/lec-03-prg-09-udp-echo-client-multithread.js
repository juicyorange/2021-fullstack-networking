const host = "127.0.0.1";
const port = 10397;

const dgram = require("dgram");

const client = dgram.createSocket("udp4");

const readline = require("readline");
const { exit } = require("process");

// 키보드 입력을 위한 변수
const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/* 연결 지향이 아니기 때문에 연결하는 과정없이 바로 서버와 통신한다.*/

// 메시지를 받았을때를 감지하는 이벤트 리스너
// 해당 이벤트가 들어오면 콜백함수를 수행한다.
client.on("message", (msg, info) => {
  console.log("> received: ", msg.toString());
});

// 키보드 입력에 대한 리스너 함수를 등록한다.
r.on("line", (input) => {
  // 연결지향이 아니기 때문에 입력값으로 quit이 들어오면 그냥 프로그램을 종료해버린다.
  if (input === "quit") {
    exit();
  } else {
    // quit이 아니라면 데이터를 서버로 보낸다.
    client.send(input, port, host, (err) => {
      // 데이터에 보내는데 실패했을 경우 에러 출력후 종료
      if (err) {
        console.log(err);
        exit();
      }
    });
  }
});
